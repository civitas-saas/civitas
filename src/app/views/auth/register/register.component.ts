import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  public registerForm: FormGroup;
  public errorMessage = signal<string | null>(null);
  public isLoading = signal<boolean>(false);

  constructor() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { fullName, email, password } = this.registerForm.value;

    try {
      await this.supabaseService.signUp(email, password, fullName);
      // Wait briefly for auth state to update then navigate
      setTimeout(() => {
        this.router.navigate(['/register-tenant']);
      }, 500);
    } catch (error: any) {
      console.error('Erro de cadastro:', error);
      this.errorMessage.set(error.message || 'Ocorreu um erro ao realizar o cadastro.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
