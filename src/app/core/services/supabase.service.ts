import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  public supabase: SupabaseClient;
  
  // State represented as Angular Signals
  public currentUser = signal<User | null>(null);
  public currentProfile = signal<any | null>(null);
  public currentTenant = signal<any | null>(null);
  public isLoading = signal<boolean>(true);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });

    // Listen to auth changes
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      this.isLoading.set(true);
      await this.handleAuthStateChange(session);
      this.isLoading.set(false);
    });

    // Initial check
    this.checkSession();
  }

  private async checkSession() {
    const { data: { session } } = await this.supabase.auth.getSession();
    await this.handleAuthStateChange(session);
    this.isLoading.set(false);
  }

  private async handleAuthStateChange(session: Session | null) {
    if (session?.user) {
      this.currentUser.set(session.user);
      await this.loadProfileAndTenant(session.user.id);
    } else {
      this.currentUser.set(null);
      this.currentProfile.set(null);
      this.currentTenant.set(null);
    }
  }

  private async loadProfileAndTenant(userId: string) {
    try {
      // Load Profile
      const { data: profile, error: profileError } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        this.currentProfile.set(null);
        this.currentTenant.set(null);
        return;
      }

      this.currentProfile.set(profile);

      // Load Tenant if user has one assigned
      if (profile.tenant_id) {
        const { data: tenant, error: tenantError } = await this.supabase
          .from('tenants')
          .select('*')
          .eq('id', profile.tenant_id)
          .single();

        if (tenantError) {
          console.error('Error fetching tenant:', tenantError);
        } else {
          this.currentTenant.set(tenant);
        }
      } else {
        this.currentTenant.set(null);
      }
    } catch (e) {
      console.error('Unexpected error loading profile/tenant:', e);
    }
  }

  // --- Auth Actions ---

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signUp(email: string, password: string, fullName: string) {
    // Trigger handle_new_user automatically creates a profile with full_name passed in user_metadata
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'admin' // First user registering the tenant defaults to admin
        }
      }
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.currentUser.set(null);
    this.currentProfile.set(null);
    this.currentTenant.set(null);
  }

  // --- Multi-Tenant Actions ---

  async registerTenant(orgName: string, userProfileId: string) {
    const slug = orgName
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-'); // Remove duplicate -

    // Call Supabase RPC to create tenant and associate profile in a single Transaction
    const { data: tenant, error } = await this.supabase.rpc('create_new_tenant', {
      tenant_name: orgName,
      tenant_slug: slug
    });

    if (error) throw error;

    // Fetch the updated profile to sync local state
    const { data: profile, error: profileError } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userProfileId)
      .single();

    if (profileError) throw profileError;

    // Refresh state signals
    this.currentProfile.set(profile);
    this.currentTenant.set(tenant);

    return { tenant, profile };
  }
}
