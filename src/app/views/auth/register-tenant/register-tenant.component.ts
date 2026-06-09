import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-register-tenant',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-tenant.component.html',
  styleUrl: './register-tenant.component.css'
})
export class RegisterTenantComponent {
  private fb = inject(FormBuilder);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  public tenantForm: FormGroup;
  public errorMessage = signal<string | null>(null);
  public isLoading = signal<boolean>(false);

  constructor() {
    this.tenantForm = this.fb.group({
      orgName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  async onSubmit() {
    if (this.tenantForm.invalid) {
      this.tenantForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { orgName } = this.tenantForm.value;
    const userId = this.supabaseService.currentUser()?.id;

    if (!userId) {
      this.errorMessage.set('Sessão expirada. Por favor, faça login novamente.');
      this.isLoading.set(false);
      this.router.navigate(['/login']);
      return;
    }

    try {
      await this.supabaseService.registerTenant(orgName, userId);
      // Success, route guard will now pass
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Erro ao cadastrar organização:', error);
      this.errorMessage.set(error.message || 'Ocorreu um erro ao cadastrar sua organização.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout() {
    try {
      await this.supabaseService.signOut();
      this.router.navigate(['/login']);
    } catch (e) {
      console.error('Erro ao sair:', e);
    }
  }
}
