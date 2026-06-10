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
  public organizationName = () => this.supabaseService.currentOrganization()?.name || 'Carregando...';
  public userEmail = () => this.supabaseService.currentUser()?.email || '';
  public userFullName = () => this.supabaseService.currentProfile()?.full_name || 'Usuário';
  public userRole = () => {
    const role = this.supabaseService.currentMember()?.role;
    if (!role) return 'Membro';
    // Format to capitalized/Portuguese equivalent
    const roleMapping: Record<string, string> = {
      'admin': 'Administrador',
      'gestor': 'Gestor de Projetos',
      'financeiro': 'Financeiro',
      'auditor': 'Auditor',
      'patrocinador': 'Patrocinador',
      'fornecedor': 'Fornecedor'
    };
    return roleMapping[role] || role;
  };

  public menuItems: MenuItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Editais', route: '/editais', icon: 'editais' },
    { label: 'Captação de Recursos', route: '/captacao', icon: 'captacao' },
    { label: 'Projetos', route: '/projetos', icon: 'projetos' },
    { label: 'Fornecedores', route: '/fornecedores', icon: 'fornecedores' },
    { label: 'Evidências', route: '/evidencias', icon: 'evidencias' },
    { label: 'Gestão Financeira', route: '/financeiro', icon: 'prestacao' },
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
    } catch (e) {
      console.error('Erro ao deslogar:', e);
    } finally {
      this.router.navigate(['/login']);
    }
  }
}
