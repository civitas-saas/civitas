import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { RouterLink } from '@angular/router';

interface Activity {
  id: string;
  type: 'project' | 'grant' | 'accountability' | 'fund' | 'supplier' | 'evidence';
  title: string;
  description: string;
  time: string;
  badgeColor: string;
}

interface Alert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  time: string;
  route: string;
  actionLabel: string;
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

  // State
  public activeTimeframe: 'month' | 'quarter' | 'year' = 'month';
  public hoveredPointIndex: number | null = null;

  // 7 indicators requested by the user
  public kpis = [
    {
      label: 'Projetos Ativos',
      value: '12',
      change: '+3 este mês',
      isPositive: true,
      icon: 'projetos',
      route: '/projetos',
      colorClass: 'text-primary-400 bg-primary-500/10 border-primary-500/20'
    },
    {
      label: 'Editais em Aberto',
      value: '8',
      change: 'Prazo até 30/Jun',
      isPositive: true,
      icon: 'editais',
      route: '/editais',
      colorClass: 'text-sky-400 bg-sky-500/10 border-sky-500/20'
    },
    {
      label: 'Recursos Captados',
      value: 'R$ 1.840.000,00',
      change: '+15.4% de aumento',
      isPositive: true,
      icon: 'captado',
      route: '/captacao',
      colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    {
      label: 'Recursos Executados',
      value: 'R$ 620.000,00',
      change: '33.7% do total captado',
      isPositive: true,
      icon: 'executado',
      route: '/prestacao-contas',
      colorClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    },
    {
      label: 'Pendências de Prestação',
      value: '3 pendentes',
      change: '1 em atraso crítico',
      isPositive: false,
      icon: 'prestacao',
      route: '/prestacao-contas',
      colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    {
      label: 'Fornecedores Pendentes',
      value: '5 pendentes',
      change: 'Aguardando compliance',
      isPositive: false,
      icon: 'fornecedores',
      route: '/fornecedores',
      colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Evidências p/ Validar',
      value: '14 arquivos',
      change: 'Enviadas recentemente',
      isPositive: true,
      icon: 'evidencias',
      route: '/evidencias',
      colorClass: 'text-teal-400 bg-teal-500/10 border-teal-500/20'
    }
  ];

  // Chart 1: Financial Evolution (Captado vs Executado)
  public chartMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
  public chartCaptado = [800000, 1050000, 1200000, 1450000, 1680000, 1840000];
  public chartExecutado = [220000, 310000, 420000, 490000, 560000, 620000];

  // Chart 2: Project status breakdown
  public projectStatusData = [
    { label: 'Planejamento', count: 3, percentage: 25, colorClass: 'text-primary-400', strokeClass: 'stroke-primary-500', bgClass: 'bg-primary-500' },
    { label: 'Em Execução', count: 5, percentage: 41.7, colorClass: 'text-accent-400', strokeClass: 'stroke-accent-500', bgClass: 'bg-accent-500' },
    { label: 'Prestação de Contas', count: 3, percentage: 25, colorClass: 'text-amber-400', strokeClass: 'stroke-amber-500', bgClass: 'bg-amber-500' },
    { label: 'Concluído', count: 1, percentage: 8.3, colorClass: 'text-emerald-400', strokeClass: 'stroke-emerald-500', bgClass: 'bg-emerald-500' }
  ];

  // Actionable alerts
  public alerts: Alert[] = [
    {
      id: 'a1',
      type: 'danger',
      title: 'Prestação de Contas Atrasada',
      description: 'O Projeto "Alfabetização Cidadã" está com prazo de prestação expirado há 3 dias.',
      time: 'Há 5 minutos',
      route: '/prestacao-contas',
      actionLabel: 'Resolver'
    },
    {
      id: 'a2',
      type: 'warning',
      title: 'Fornecedor Pendente de Compliance',
      description: 'A empresa "Construções Civis Ltda" cadastrou-se mas requer análise de certidões negativas.',
      time: 'Há 1 hora',
      route: '/fornecedores',
      actionLabel: 'Homologar'
    },
    {
      id: 'a3',
      type: 'info',
      title: 'Novas Evidências de Execução',
      description: '3 novas evidências (fotos/recibos) foram enviadas para validação no Edital 04/2026.',
      time: 'Há 3 horas',
      route: '/evidencias',
      actionLabel: 'Validar'
    },
    {
      id: 'a4',
      type: 'success',
      title: 'Recurso Adicional Captado',
      description: 'Termo de fomento com a Fundação Itaú homologado com sucesso no valor de R$ 350.000,00.',
      time: 'Ontem',
      route: '/captacao',
      actionLabel: 'Visualizar'
    }
  ];

  // Recent activity log
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
      description: 'Nova doação recorrente via Pix identificada de R$ 1.500,00.',
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
      type: 'supplier',
      title: 'Fornecedor Cadastrado',
      description: 'Prestador "Transportes e Logística Silva" concluiu cadastro de faturamento.',
      time: 'Ontem às 11:20',
      badgeColor: 'bg-amber-500'
    },
    {
      id: '5',
      type: 'evidence',
      title: 'Evidência Uploaded',
      description: 'Relatório pedagógico de execução do projeto Esporte e Lazer anexado pelo gestor.',
      time: '2 dias atrás',
      badgeColor: 'bg-teal-500'
    }
  ];

  // Helper getters for SVG interactive line chart coordinates (Canvas: 500w x 200h)
  get captadoPath(): string {
    const max = 2000000;
    return this.chartCaptado.map((val, i) => {
      const x = i * (500 / 5);
      const y = 200 - (val / max) * 150 - 20;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }

  get captadoAreaPath(): string {
    const max = 2000000;
    const points = this.chartCaptado.map((val, i) => {
      const x = i * (500 / 5);
      const y = 200 - (val / max) * 150 - 20;
      return `${x},${y}`;
    });
    return `M 0,200 L ${points.map(p => p.replace(',', ' ')).join(' L ')} L 500,200 Z`;
  }

  get executadoPath(): string {
    const max = 2000000;
    return this.chartExecutado.map((val, i) => {
      const x = i * (500 / 5);
      const y = 200 - (val / max) * 150 - 20;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  }

  get executadoAreaPath(): string {
    const max = 2000000;
    const points = this.chartExecutado.map((val, i) => {
      const x = i * (500 / 5);
      const y = 200 - (val / max) * 150 - 20;
      return `${x},${y}`;
    });
    return `M 0,200 L ${points.map(p => p.replace(',', ' ')).join(' L ')} L 500,200 Z`;
  }

  get chartPoints() {
    const max = 2000000;
    return this.chartMonths.map((month, i) => {
      const x = i * (500 / 5);
      const yCap = 200 - (this.chartCaptado[i] / max) * 150 - 20;
      const yExe = 200 - (this.chartExecutado[i] / max) * 150 - 20;
      return {
        index: i,
        month,
        x,
        yCap,
        yExe,
        valCap: this.formatCurrency(this.chartCaptado[i]),
        valExe: this.formatCurrency(this.chartExecutado[i])
      };
    });
  }

  // Donut SVG logic (Radius = 50, Circumference = 314.16)
  get donutSegments() {
    const circumference = 314.16;
    let currentOffset = 0;
    
    return this.projectStatusData.map(status => {
      const strokeDasharray = `${(status.percentage / 100) * circumference} ${circumference}`;
      const strokeDashoffset = currentOffset;
      currentOffset -= (status.percentage / 100) * circumference;
      return {
        ...status,
        strokeDasharray,
        strokeDashoffset
      };
    });
  }

  // Actions
  public selectTimeframe(timeframe: 'month' | 'quarter' | 'year') {
    this.activeTimeframe = timeframe;
    // Simulate updating chart values on timeframe change for polish
    if (timeframe === 'month') {
      this.chartCaptado = [800000, 1050000, 1200000, 1450000, 1680000, 1840000];
      this.chartExecutado = [220000, 310000, 420000, 490000, 560000, 620000];
    } else if (timeframe === 'quarter') {
      this.chartCaptado = [1200000, 1350000, 1500000, 1650000, 1750000, 1840000];
      this.chartExecutado = [450000, 480000, 520000, 560000, 590000, 620000];
    } else {
      this.chartCaptado = [400000, 700000, 1100000, 1300000, 1600000, 1840000];
      this.chartExecutado = [100000, 200000, 350000, 450000, 550000, 620000];
    }
  }

  public removeAlert(id: string) {
    this.alerts = this.alerts.filter(a => a.id !== id);
  }

  public formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  }
}
