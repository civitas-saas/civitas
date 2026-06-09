import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./views/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./views/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: 'register-organization',
    loadComponent: () => import('./views/auth/register-organization/register-organization.component').then(m => m.RegisterOrganizationComponent),
    canActivate: [authGuard]
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./views/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'editais',
        loadComponent: () => import('./views/modules/editais/editais.component').then(m => m.EditaisComponent)
      },
      {
        path: 'captacao',
        loadComponent: () => import('./views/modules/captacao/captacao.component').then(m => m.CaptacaoComponent)
      },
      {
        path: 'projetos',
        loadComponent: () => import('./views/modules/projetos/projetos.component').then(m => m.ProjetosComponent)
      },
      {
        path: 'fornecedores',
        loadComponent: () => import('./views/modules/fornecedores/fornecedores.component').then(m => m.FornecedoresComponent)
      },
      {
        path: 'evidencias',
        loadComponent: () => import('./views/modules/evidencias/evidencias.component').then(m => m.EvidenciasComponent)
      },
      {
        path: 'prestacao-contas',
        loadComponent: () => import('./views/modules/prestacao-contas/prestacao-contas.component').then(m => m.PrestacaoContasComponent)
      },
      {
        path: 'transparencia',
        loadComponent: () => import('./views/modules/transparencia/transparencia.component').then(m => m.TransparenciaComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
