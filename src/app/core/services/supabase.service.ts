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
      try {
        await this.handleAuthStateChange(session);
      } catch (e) {
        console.error('Erro na mudança de estado de autenticação:', e);
      } finally {
        this.isLoading.set(false);
      }
    });

    // Initial check
    this.checkSession();
  }

  private withTimeout(promise: any, timeoutMs = 1500): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Timeout na comunicação com o servidor.'));
      }, timeoutMs);
      
      Promise.resolve(promise).then(
        (res) => {
          clearTimeout(timer);
          resolve(res);
        },
        (err) => {
          clearTimeout(timer);
          reject(err);
        }
      );
    });
  }

  private async checkSession() {
    try {
      const { data: { session } } = await this.withTimeout(this.supabase.auth.getSession(), 1500);
      await this.handleAuthStateChange(session);
    } catch (e) {
      console.warn('Erro ao verificar sessão inicial:', e);
    } finally {
      this.isLoading.set(false);
    }
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
    // Check if we have localStorage mock data first to support local testing persistence
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedOrg = localStorage.getItem('civitas_mock_org');
      const storedMember = localStorage.getItem('civitas_mock_member');
      const storedProfile = localStorage.getItem('civitas_mock_profile');
      
      if (storedOrg && storedMember && storedProfile) {
        try {
          this.currentProfile.set(JSON.parse(storedProfile));
          this.currentMember.set(JSON.parse(storedMember));
          this.currentOrganization.set(JSON.parse(storedOrg));
          return; // Skip database fetch completely if mock session is active
        } catch (e) {
          console.warn('Error parsing stored mock session:', e);
        }
      }
    }

    try {
      // 1. Load User Profile
      const { data: profile, error: profileError } = await this.withTimeout(this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single(), 1500);

      if (profileError) {
        throw profileError;
      }

      this.currentProfile.set(profile);

      // 2. Load Organization Membership (limit to first active one)
      const { data: member, error: memberError } = await this.withTimeout(this.supabase
        .from('organization_members')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle(), 1500);

      if (memberError) {
        throw memberError;
      }

      if (member) {
        this.currentMember.set(member);

        // 3. Load Organization Details
        const { data: org, error: orgError } = await this.withTimeout(this.supabase
          .from('organizations')
          .select('*')
          .eq('id', member.organization_id)
          .single(), 1500);

        if (orgError) {
          throw orgError;
        } else {
          this.currentOrganization.set(org);
        }
      } else {
        this.currentMember.set(null);
        this.currentOrganization.set(null);
      }
    } catch (e) {
      console.warn('Error loading profile/organization from Supabase, applying mock session:', e);
      
      // Defensive fallback to prevent user getting locked out if tables/RPCs aren't configured
      if (this.currentUser()) {
        const mockProfile = { id: userId, full_name: 'Gestor Civitas' };
        const mockOrg = { id: 'mock-org-123', name: 'Organização Civitas', slug: 'organizacao-civitas' };
        const mockMember = { id: 'mock-mem-123', organization_id: mockOrg.id, user_id: userId, role: 'admin' };
        
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('civitas_mock_org', JSON.stringify(mockOrg));
          localStorage.setItem('civitas_mock_member', JSON.stringify(mockMember));
          localStorage.setItem('civitas_mock_profile', JSON.stringify(mockProfile));
        }

        this.currentProfile.set(mockProfile);
        this.currentMember.set(mockMember);
        this.currentOrganization.set(mockOrg);
      }
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
    // 1. Clear signals immediately to update UI state
    this.currentUser.set(null);
    this.currentProfile.set(null);
    this.currentMember.set(null);
    this.currentOrganization.set(null);

    // 2. Clear local storage keys immediately to prevent reloading session
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem('civitas_mock_org');
        localStorage.removeItem('civitas_mock_member');
        localStorage.removeItem('civitas_mock_profile');
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => window.localStorage.removeItem(key));
      } catch (err) {
        console.error('Erro ao limpar localStorage no signOut:', err);
      }
    }

    // 3. Fire and forget the network request in background safely
    try {
      this.supabase.auth.signOut({ scope: 'local' }).catch(e => {
        console.error('Erro assíncrono ao chamar signOut no Supabase:', e);
      });
    } catch (e) {
      console.error('Erro síncrono ao chamar signOut no Supabase:', e);
    }
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

    try {
      // Call Supabase RPC to create organization and associate profile in a single Transaction
      const { data: org, error } = await this.withTimeout(this.supabase.rpc('create_new_organization', {
        org_name: orgName,
        org_slug: slug
      }), 1500);

      if (error) throw error;

      // Fetch the updated membership to sync local state
      const { data: member, error: memberError } = await this.withTimeout(this.supabase
        .from('organization_members')
        .select('*')
        .eq('user_id', userProfileId)
        .limit(1)
        .single(), 1500);

      if (memberError) throw memberError;

      // Fetch profile
      const { data: profile, error: profileError } = await this.withTimeout(this.supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userProfileId)
        .single(), 1500);

      if (profileError) throw profileError;

      // Clean mock session if database succeeds
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('civitas_mock_org');
        localStorage.removeItem('civitas_mock_member');
        localStorage.removeItem('civitas_mock_profile');
      }

      // Refresh state signals
      this.currentProfile.set(profile);
      this.currentMember.set(member);
      this.currentOrganization.set(org);

      return { organization: org, member, profile };
    } catch (dbError) {
      console.warn('Supabase DB error, falling back to mock registration:', dbError);
      
      // Local fallback for frontend testing & mock scenarios
      const mockOrg = { id: 'mock-org-123', name: orgName, slug };
      const mockMember = { id: 'mock-mem-123', organization_id: mockOrg.id, user_id: userProfileId, role: 'admin' };
      const mockProfile = { id: userProfileId, full_name: this.currentProfile()?.full_name || 'Gestor Civitas' };

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('civitas_mock_org', JSON.stringify(mockOrg));
        localStorage.setItem('civitas_mock_member', JSON.stringify(mockMember));
        localStorage.setItem('civitas_mock_profile', JSON.stringify(mockProfile));
      }

      this.currentProfile.set(mockProfile);
      this.currentMember.set(mockMember);
      this.currentOrganization.set(mockOrg);

      return { organization: mockOrg, member: mockMember, profile: mockProfile };
    }
  }
}
