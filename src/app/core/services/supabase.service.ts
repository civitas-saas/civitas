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
  public currentMember = signal<any | null>(null);
  public currentOrganization = signal<any | null>(null);
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
      await this.loadProfileAndOrganization(session.user.id);
    } else {
      this.currentUser.set(null);
      this.currentProfile.set(null);
      this.currentMember.set(null);
      this.currentOrganization.set(null);
    }
  }

  private async loadProfileAndOrganization(userId: string) {
    try {
      // 1. Load User Profile
      const { data: profile, error: profileError } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        this.currentProfile.set(null);
        this.currentMember.set(null);
        this.currentOrganization.set(null);
        return;
      }

      this.currentProfile.set(profile);

      // 2. Load Organization Membership (limit to first active one)
      const { data: member, error: memberError } = await this.supabase
        .from('organization_members')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (memberError) {
        console.error('Error fetching membership:', memberError);
        this.currentMember.set(null);
        this.currentOrganization.set(null);
        return;
      }

      if (member) {
        this.currentMember.set(member);

        // 3. Load Organization Details
        const { data: org, error: orgError } = await this.supabase
          .from('organizations')
          .select('*')
          .eq('id', member.organization_id)
          .single();

        if (orgError) {
          console.error('Error fetching organization:', orgError);
          this.currentOrganization.set(null);
        } else {
          this.currentOrganization.set(org);
        }
      } else {
        this.currentMember.set(null);
        this.currentOrganization.set(null);
      }
    } catch (e) {
      console.error('Unexpected error loading profile/organization:', e);
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
          full_name: fullName
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
    this.currentMember.set(null);
    this.currentOrganization.set(null);
  }

  // --- Multi-Tenant Actions ---

  async registerOrganization(orgName: string, userProfileId: string) {
    const slug = orgName
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-'); // Remove duplicate -

    // Call Supabase RPC to create organization and associate profile in a single Transaction
    const { data: org, error } = await this.supabase.rpc('create_new_organization', {
      org_name: orgName,
      org_slug: slug
    });

    if (error) throw error;

    // Fetch the updated membership to sync local state
    const { data: member, error: memberError } = await this.supabase
      .from('organization_members')
      .select('*')
      .eq('user_id', userProfileId)
      .limit(1)
      .single();

    if (memberError) throw memberError;

    // Fetch profile
    const { data: profile, error: profileError } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userProfileId)
      .single();

    if (profileError) throw profileError;

    // Refresh state signals
    this.currentProfile.set(profile);
    this.currentMember.set(member);
    this.currentOrganization.set(org);

    return { organization: org, member, profile };
  }
}
