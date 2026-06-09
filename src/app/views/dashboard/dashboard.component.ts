import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { RouterLink } from '@angular/router';

interface Activity {
  id: string;
  type: 'project' | 'grant' | 'accountability' | 'fund';
  title: string;
  description: string;
  time: string;
  badgeColor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private supabaseService = inject(SupabaseService);

  public organizationName = () => this.supabaseService.currentOrganization()?.name || 'Organização';
  public userFullName = () => this.supabaseService.currentProfile()?.full_name || 'Usuário';

  // Premium mockup data
  public stats = [
    {
      label: 'Recursos Captados',
      value: 'R$ 142.850,00',
      change: '+12.5%',
      isPositive: true,
      icon: 'recursos',
      colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Editais Ativos',
      value: '8',
      change: '+2 novos',
      isPositive: true,
      icon: 'editais',
      colorClass: 'text-primary-400 bg-primary-500/10 border-primary-500/20'
    },
    {
      label: 'Projetos em Execução',
      value: '4',
      change: '1 finalizado',
      isPositive: true,
      icon: 'projetos',
      colorClass: 'text-accent-400 bg-accent-500/10 border-accent-500/20'
    },
    {
      label: 'Prestação de Contas',
      value: '2 pendentes',
      change: '-40% este mês',
      isPositive: true,
      icon: 'prestacao',
      colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    }
  ];

  public recentActivities: Activity[] = [
    {
      id: '1',
      type: 'grant',
      title: 'Edital Submetido',
      description: 'Proposta submetida ao Edital de Educação Integral da Fundação Itaú.',
      time: 'Há 2 horas',
      badgeColor: 'bg-primary-500'
    },
    {
      id: '2',
      type: 'fund',
      title: 'Doação Recebida',
      description: 'Nova doação recorrente via Pix identificada de R$ 500,00.',
      time: 'Há 5 horas',
      badgeColor: 'bg-emerald-500'
    },
    {
      id: '3',
      type: 'project',
      title: 'Projeto Iniciado',
      description: 'Etapa de planejamento do projeto "Inclusão Digital para Jovens" concluída.',
      time: 'Ontem às 16:30',
      badgeColor: 'bg-accent-500'
    },
    {
      id: '4',
      type: 'accountability',
      title: 'Relatório Financeiro Aprovado',
      description: 'Prestação de contas do projeto de Alfabetização homologada pelo conselho.',
      time: '2 dias atrás',
      badgeColor: 'bg-amber-500'
    }
  ];
}
