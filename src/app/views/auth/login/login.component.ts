import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  public loginForm: FormGroup;
  public errorMessage = signal<string | null>(null);
  public isLoading = signal<boolean>(false);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    try {
      await this.supabaseService.signIn(email, password);
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Erro de login:', error);
      this.errorMessage.set(
        error.message === 'Invalid login credentials' 
          ? 'Credenciais inválidas. Verifique seu e-mail e senha.' 
          : error.message || 'Ocorreu um erro ao realizar o login.'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
