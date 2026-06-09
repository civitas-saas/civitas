import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

const waitLoading = async (supabaseService: SupabaseService) => {
  if (supabaseService.isLoading()) {
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!supabaseService.isLoading()) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }
};

export const authGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  await waitLoading(supabaseService);

  const user = supabaseService.currentUser();
  const profile = supabaseService.currentProfile();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // If user is authenticated but has no tenant, redirect to tenant creation onboarding
  if (profile && !profile.tenant_id && !state.url.includes('/register-tenant')) {
    router.navigate(['/register-tenant']);
    return false;
  }

  return true;
};

export const noAuthGuard: CanActivateFn = async (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  await waitLoading(supabaseService);

  const user = supabaseService.currentUser();

  if (user) {
    router.navigate(['/']);
    return false;
  }

  return true;
};
