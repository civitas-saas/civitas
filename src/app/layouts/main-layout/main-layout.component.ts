import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';

interface MenuItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {
  public supabaseService = inject(SupabaseService);
  private router = inject(Router);

  public isMobileMenuOpen = signal<boolean>(false);
  public isProfileDropdownOpen = signal<boolean>(false);

  // Dynamic signals from service
  public tenantName = () => this.supabaseService.currentTenant()?.name || 'Carregando...';
  public userEmail = () => this.supabaseService.currentUser()?.email || '';
  public userFullName = () => this.supabaseService.currentProfile()?.full_name || 'Usuário';

  public menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Editais', route: '/editais', icon: 'editais' },
    { label: 'Captação de Recursos', route: '/captacao', icon: 'captacao' },
    { label: 'Projetos', route: '/projetos', icon: 'projetos' },
    { label: 'Fornecedores', route: '/fornecedores', icon: 'fornecedores' },
    { label: 'Evidências', route: '/evidencias', icon: 'evidencias' },
    { label: 'Prestação de Contas', route: '/prestacao-contas', icon: 'prestacao' },
    { label: 'Portal de Transparência', route: '/transparencia', icon: 'transparencia' }
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  toggleProfileDropdown() {
    this.isProfileDropdownOpen.update(v => !v);
  }

  async logout() {
    try {
      await this.supabaseService.signOut();
      this.router.navigate(['/login']);
    } catch (e) {
      console.error('Erro ao deslogar:', e);
    }
  }
}
