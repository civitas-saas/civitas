import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';

export interface CertidaoInstituicao {
  nome: string;
  emissor: string;
  validade: string;
  status: 'Regular' | 'Expirada';
  comprovanteUrl: string;
}

export interface ProjetoPublico {
  id: string;
  nome: string;
  fomentoOrigem: string;
  centroCusto: string;
  orcamentoAprovado: number;
  orcamentoExecutado: number;
  dataInicio: string;
  dataFim: string;
  statusPrestacao: string;
}

export interface GastoPublico {
  id: string;
  projetoNome: string;
  data: string;
  descricao: string;
  valor: number;
  categoria: string;
  notaFiscal: string;
}

@Component({
  selector: 'app-transparencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transparencia.component.html',
  styleUrl: './transparencia.component.css'
})
export class TransparenciaComponent {
  public supabaseService = inject(SupabaseService);

  // States
  public buscaGasto: string = '';
  public filtroProjetoGasto: string = '';
  public showReportModal: boolean = false;
  public selectedProjectForReport: ProjetoPublico | null = null;
  public reportType: 'Parcial' | 'Final' = 'Final';

  // Institution profile details
  public orgCnpj: string = '45.892.124/0001-88';
  public orgNome: string = 'Instituto Civitas pelo Desenvolvimento Social';
  public seloRating: string = 'A+ Selo Ouro';

  // Organization's own regularity certs (Compliance info)
  public certidoes: CertidaoInstituicao[] = [
    {
      nome: 'Tributos Federais e Dívida Ativa da União',
      emissor: 'Receita Federal do Brasil / PGFN',
      validade: '2026-11-20',
      status: 'Regular',
      comprovanteUrl: 'cnd_federal_instituto_2026.pdf'
    },
    {
      nome: 'Certificado de Regularidade do FGTS (CRF)',
      emissor: 'Caixa Econômica Federal',
      validade: '2026-08-15',
      status: 'Regular',
      comprovanteUrl: 'crf_fgts_instituto_2026.pdf'
    },
    {
      nome: 'Certidão Negativa de Débitos Trabalhistas (CNDT)',
      emissor: 'Tribunal Superior do Trabalho / JT',
      validade: '2026-10-05',
      status: 'Regular',
      comprovanteUrl: 'cndt_trabalhista_instituto_2026.pdf'
    },
    {
      nome: 'Certidão de Tributos Mobiliários e Imobiliários',
      emissor: 'Secretaria Municipal da Fazenda',
      validade: '2026-09-12',
      status: 'Regular',
      comprovanteUrl: 'cnd_municipal_instituto_2026.pdf'
    }
  ];

  // List of active public projects
  public projetos: ProjetoPublico[] = [
    {
      id: 'proj-1',
      nome: 'Inclusão Digital para Jovens de Baixa Renda',
      fomentoOrigem: 'Fundação Itaú',
      centroCusto: 'CC-101',
      orcamentoAprovado: 180000,
      orcamentoExecutado: 64282,
      dataInicio: '2026-03-01',
      dataFim: '2026-11-30',
      statusPrestacao: 'Em Preparação'
    },
    {
      id: 'proj-2',
      nome: 'Alfabetização Cidadã para Adultos',
      fomentoOrigem: 'Prefeitura de São Paulo',
      centroCusto: 'CC-102',
      orcamentoAprovado: 90000,
      orcamentoExecutado: 90000,
      dataInicio: '2025-06-01',
      dataFim: '2026-02-15',
      statusPrestacao: 'Aprovada'
    },
    {
      id: 'proj-3',
      nome: 'Esporte e Lazer no Bairro',
      fomentoOrigem: 'Ministério do Esporte',
      centroCusto: 'CC-103',
      orcamentoAprovado: 250000,
      orcamentoExecutado: 0,
      dataInicio: '2026-06-01',
      dataFim: '2027-05-31',
      statusPrestacao: 'Enviada'
    },
    {
      id: 'proj-4',
      nome: 'Reciclagem de Resíduos e Sustentabilidade',
      fomentoOrigem: 'Fundo Verde Ambiental',
      centroCusto: 'CC-104',
      orcamentoAprovado: 180000,
      orcamentoExecutado: 18000,
      dataInicio: '2026-01-15',
      dataFim: '2026-08-31',
      statusPrestacao: 'Corrigir Pendências'
    }
  ];

  // Public ledger of approved expenses
  public gastos: GastoPublico[] = [
    {
      id: 'g-1',
      projetoNome: 'Inclusão Digital para Jovens de Baixa Renda',
      data: '2026-03-22',
      descricao: 'Compra de 15 computadores e roteador corporativo',
      valor: 48000,
      categoria: 'Equipamentos',
      notaFiscal: 'NF-88492'
    },
    {
      id: 'g-2',
      projetoNome: 'Inclusão Digital para Jovens de Baixa Renda',
      data: '2026-05-10',
      descricao: 'Honorários docentes - Módulo I (Lógica de Prog.)',
      valor: 12000,
      categoria: 'Recursos Humanos',
      notaFiscal: 'RPA-223'
    },
    {
      id: 'g-3',
      projetoNome: 'Inclusão Digital para Jovens de Baixa Renda',
      data: '2026-04-10',
      descricao: 'Locação do laboratório de informática',
      valor: 4282,
      categoria: 'Serviços de Terceiros',
      notaFiscal: 'NF-0192'
    },
    {
      id: 'g-4',
      projetoNome: 'Alfabetização Cidadã para Adultos',
      data: '2025-06-08',
      descricao: 'Aquisição de material didático e apostilas',
      valor: 4000,
      categoria: 'Material Didático',
      notaFiscal: 'NF-5541'
    },
    {
      id: 'g-5',
      projetoNome: 'Alfabetização Cidadã para Adultos',
      data: '2025-11-28',
      descricao: 'Pagamento professores de letramento noturno',
      valor: 46000,
      categoria: 'Recursos Humanos',
      notaFiscal: 'RPA-882'
    },
    {
      id: 'g-6',
      projetoNome: 'Alfabetização Cidadã para Adultos',
      data: '2026-02-12',
      descricao: 'Auditoria externa de contas e balanços',
      valor: 40000,
      categoria: 'Custos Administrativos',
      notaFiscal: 'NF-9988'
    },
    {
      id: 'g-7',
      projetoNome: 'Reciclagem de Resíduos e Sustentabilidade',
      data: '2026-05-02',
      descricao: 'Treinamento das Cooperativas Locais',
      valor: 18000,
      categoria: 'Serviços de Terceiros',
      notaFiscal: 'NF-0982'
    }
  ];

  // ----------------------------------------------------
  // GETTERS & COMPUTED PROPERTIES
  // ----------------------------------------------------
  public get filteredGastos(): GastoPublico[] {
    return this.gastos.filter(g => {
      const matchProj = !this.filtroProjetoGasto || g.projetoNome === this.filtroProjetoGasto;
      const search = this.buscaGasto.toLowerCase().trim();
      const matchSearch = !search ||
        g.descricao.toLowerCase().includes(search) ||
        g.projetoNome.toLowerCase().includes(search) ||
        g.categoria.toLowerCase().includes(search) ||
        g.notaFiscal.toLowerCase().includes(search);
      return matchProj && matchSearch;
    });
  }

  public get totalRecursosRecebidos(): number {
    return this.projetos.reduce((sum, p) => sum + p.orcamentoAprovado, 0);
  }

  public get totalRecursosExecutados(): number {
    return this.projetos.reduce((sum, p) => sum + p.orcamentoExecutado, 0);
  }

  public get countProjetosAtivos(): number {
    return this.projetos.length;
  }

  public get countCertidoesValidas(): number {
    return this.certidoes.filter(c => c.status === 'Regular').length;
  }

  // ----------------------------------------------------
  // REPORT DIALOG ACTIONS
  // ----------------------------------------------------
  public openReport(p: ProjetoPublico, type: 'Parcial' | 'Final'): void {
    this.selectedProjectForReport = p;
    this.reportType = type;
    this.showReportModal = true;
  }

  public closeReport(): void {
    this.selectedProjectForReport = null;
    this.showReportModal = false;
  }

  public printReport(): void {
    window.print();
  }

  public downloadDocSimulated(fileName: string): void {
    alert(`Simulação: Baixando cópia oficial em PDF da certidão "${fileName}"`);
  }

  // ----------------------------------------------------
  // MATH & FORMATTING HELPERS
  // ----------------------------------------------------
  public getPercentBudget(p: ProjetoPublico): number {
    if (!p.orcamentoAprovado) return 0;
    return Math.min(Math.round((p.orcamentoExecutado / p.orcamentoAprovado) * 100), 100);
  }

  public formatCurrency(val: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  }

  public formatCurrencyDecimal(val: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(val);
  }

  // Categories helper compilation for public report preview
  public getCategoryPublicTotal(cat: string): number {
    if (!this.selectedProjectForReport) return 0;
    const projName = this.selectedProjectForReport.nome;
    return this.gastos
      .filter(g => g.projetoNome === projName && g.categoria === cat)
      .reduce((sum, g) => sum + g.valor, 0);
  }
}
