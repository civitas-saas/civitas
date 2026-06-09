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
  const member = supabaseService.currentMember();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // If user is authenticated but has no organization membership, redirect to onboarding
  if (!member && !state.url.includes('/register-organization')) {
    router.navigate(['/register-organization']);
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
