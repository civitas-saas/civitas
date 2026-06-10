import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface OrcamentoCategoria {
  categoria: string;
  previsto: number;
  executado: number;
}

export interface Transacao {
  id: string;
  projetoId: string;
  projetoNome: string;
  tipo: 'Receita' | 'Despesa';
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  centroCusto: string;
  status: 'Pendente' | 'Aprovado' | 'Rejeitado';
  comprovanteUrl: string;
  notaFiscal: string;
}

export interface ProjetoFinanceiro {
  id: string;
  nome: string;
  centroCusto: string;
  fomentoOrigem: string;
}

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './financeiro.component.html',
  styleUrl: './financeiro.component.css'
})
export class FinanceiroComponent {
  // Navigation tabs
  public activeView: 'consolidated' | 'project' = 'consolidated';
  public selectedProjectId: string = 'proj-1';

  // Forms and Modals state
  public showAddTransactionForm: boolean = false;
  public transactionForm: Partial<Transacao> = {};
  public tempInvoiceCode: string = '';
  public tempVoucherFile: string = '';
  public activeInvoiceInputId: string | null = null;
  public activeVoucherInputId: string | null = null;

  // Options
  public categories = [
    'Recursos Humanos',
    'Equipamentos',
    'Serviços de Terceiros',
    'Material Didático',
    'Divulgação',
    'Custos Administrativos',
    'Infraestrutura',
    'Outros'
  ];

  // Mock Projects mapped with Cost Center and Funder
  public projetos: ProjetoFinanceiro[] = [
    { id: 'proj-1', nome: 'Inclusão Digital para Jovens de Baixa Renda', centroCusto: 'CC-101', fomentoOrigem: 'Fundação Itaú' },
    { id: 'proj-2', nome: 'Alfabetização Cidadã para Adultos', centroCusto: 'CC-102', fomentoOrigem: 'Prefeitura de São Paulo' },
    { id: 'proj-3', nome: 'Esporte e Lazer no Bairro', centroCusto: 'CC-103', fomentoOrigem: 'Ministério do Esporte' },
    { id: 'proj-4', nome: 'Reciclagem de Resíduos e Sustentabilidade', centroCusto: 'CC-104', fomentoOrigem: 'Fundo Verde Ambiental' }
  ];

  // Budget matrix by category for each project (Approved vs Executed limits)
  public categoriasOrcamento: Record<string, OrcamentoCategoria[]> = {
    'proj-1': [
      { categoria: 'Recursos Humanos', previsto: 80000, executado: 12000 },
      { categoria: 'Equipamentos', previsto: 50000, executado: 48000 },
      { categoria: 'Serviços de Terceiros', previsto: 30000, executado: 4282 },
      { categoria: 'Divulgação', previsto: 10000, executado: 0 },
      { categoria: 'Custos Administrativos', previsto: 30000, executado: 0 }
    ],
    'proj-2': [
      { categoria: 'Recursos Humanos', previsto: 50000, executado: 46000 },
      { categoria: 'Material Didático', previsto: 10000, executado: 4000 },
      { categoria: 'Custos Administrativos', previsto: 30000, executado: 40000 }
    ],
    'proj-3': [
      { categoria: 'Recursos Humanos', previsto: 120000, executado: 0 },
      { categoria: 'Infraestrutura', previsto: 80000, executado: 0 },
      { categoria: 'Equipamentos', previsto: 30000, executado: 0 },
      { categoria: 'Outros', previsto: 20000, executado: 0 }
    ],
    'proj-4': [
      { categoria: 'Equipamentos', previsto: 110000, executado: 96500 },
      { categoria: 'Recursos Humanos', previsto: 40000, executado: 0 },
      { categoria: 'Serviços de Terceiros', previsto: 30000, executado: 18000 }
    ]
  };

  // Chronological list of bank transactions and cost entries
  public transacoes: Transacao[] = [
    {
      id: 't-1',
      projetoId: 'proj-1',
      projetoNome: 'Inclusão Digital para Jovens de Baixa Renda',
      tipo: 'Receita',
      descricao: '1ª Parcela de repasse - Convênio Fundação Itaú',
      valor: 75000,
      data: '2026-03-05',
      categoria: 'Repasse',
      centroCusto: 'CC-101',
      status: 'Aprovado',
      comprovanteUrl: 'repasse_parcela_1.pdf',
      notaFiscal: ''
    },
    {
      id: 't-2',
      projetoId: 'proj-1',
      projetoNome: 'Inclusão Digital para Jovens de Baixa Renda',
      tipo: 'Despesa',
      descricao: 'Compra de 15 computadores e roteador corporativo',
      valor: 48000,
      data: '2026-03-22',
      categoria: 'Equipamentos',
      centroCusto: 'CC-101',
      status: 'Aprovado',
      comprovanteUrl: 'comprovante_pagamento_notebooks.pdf',
      notaFiscal: 'NF-88492'
    },
    {
      id: 't-3',
      projetoId: 'proj-1',
      projetoNome: 'Inclusão Digital para Jovens de Baixa Renda',
      tipo: 'Despesa',
      descricao: 'Honorários docentes - Módulo I (Lógica de Prog.)',
      valor: 12000,
      data: '2026-05-10',
      categoria: 'Recursos Humanos',
      centroCusto: 'CC-101',
      status: 'Aprovado',
      comprovanteUrl: 'recibo_pagamento_prof_thiago.pdf',
      notaFiscal: 'RPA-223'
    },
    {
      id: 't-4',
      projetoId: 'proj-1',
      projetoNome: 'Inclusão Digital para Jovens de Baixa Renda',
      tipo: 'Despesa',
      descricao: 'Locação do laboratório de informática',
      valor: 4282,
      data: '2026-04-10',
      categoria: 'Serviços de Terceiros',
      centroCusto: 'CC-101',
      status: 'Aprovado',
      comprovanteUrl: 'recibo_locacao_abril.pdf',
      notaFiscal: 'NF-0192'
    },
    {
      id: 't-5',
      projetoId: 'proj-1',
      projetoNome: 'Inclusão Digital para Jovens de Baixa Renda',
      tipo: 'Despesa',
      descricao: 'Serviços de consultoria pedagógica',
      valor: 8500,
      data: '2026-06-08',
      categoria: 'Serviços de Terceiros',
      centroCusto: 'CC-101',
      status: 'Pendente',
      comprovanteUrl: '',
      notaFiscal: ''
    },
    {
      id: 't-6',
      projetoId: 'proj-2',
      projetoNome: 'Alfabetização Cidadã para Adultos',
      tipo: 'Receita',
      descricao: 'Repasse parcela única - Convênio Municipal',
      valor: 90000,
      data: '2025-06-02',
      categoria: 'Repasse',
      centroCusto: 'CC-102',
      status: 'Aprovado',
      comprovanteUrl: 'comprovante_repasse_municipal.pdf',
      notaFiscal: ''
    },
    {
      id: 't-7',
      projetoId: 'proj-2',
      projetoNome: 'Alfabetização Cidadã para Adultos',
      tipo: 'Despesa',
      descricao: 'Aquisição de material didático e apostilas',
      valor: 4000,
      data: '2025-06-08',
      categoria: 'Material Didático',
      centroCusto: 'CC-102',
      status: 'Aprovado',
      comprovanteUrl: 'nota_fiscal_editora.pdf',
      notaFiscal: 'NF-5541'
    },
    {
      id: 't-8',
      projetoId: 'proj-2',
      projetoNome: 'Alfabetização Cidadã para Adultos',
      tipo: 'Despesa',
      descricao: 'Pagamento professores de letramento noturno',
      valor: 46000,
      data: '2025-11-28',
      categoria: 'Recursos Humanos',
      centroCusto: 'CC-102',
      status: 'Aprovado',
      comprovanteUrl: 'recibos_professores_folha.pdf',
      notaFiscal: 'RPA-882'
    },
    {
      id: 't-9',
      projetoId: 'proj-2',
      projetoNome: 'Alfabetização Cidadã para Adultos',
      tipo: 'Despesa',
      descricao: 'Auditoria externa de contas e balanços',
      valor: 40000,
      data: '2026-02-12',
      categoria: 'Custos Administrativos',
      centroCusto: 'CC-102',
      status: 'Aprovado',
      comprovanteUrl: 'relatorio_auditoria_final.pdf',
      notaFiscal: 'NF-9988'
    },
    {
      id: 't-10',
      projetoId: 'proj-3',
      projetoNome: 'Esporte e Lazer no Bairro',
      tipo: 'Receita',
      descricao: '1ª Parcela Repasse - Ministério do Esporte',
      valor: 120000,
      data: '2026-06-01',
      categoria: 'Repasse',
      centroCusto: 'CC-103',
      status: 'Aprovado',
      comprovanteUrl: 'repasse_ministerio_p1.pdf',
      notaFiscal: ''
    },
    {
      id: 't-11',
      projetoId: 'proj-3',
      projetoNome: 'Esporte e Lazer no Bairro',
      tipo: 'Despesa',
      descricao: 'Adiantamento caução de sinal para locação de quadras',
      valor: 8000,
      data: '2026-06-05',
      categoria: 'Infraestrutura',
      centroCusto: 'CC-103',
      status: 'Pendente',
      comprovanteUrl: '',
      notaFiscal: ''
    }
  ];

  // ----------------------------------------------------
  // CONSOLIDATED GETTERS
  // ----------------------------------------------------
  public get totalRecebidoConsolidado(): number {
    return this.transacoes
      .filter(t => t.tipo === 'Receita' && t.status === 'Aprovado')
      .reduce((sum, t) => sum + t.valor, 0);
  }

  public get totalPagoConsolidado(): number {
    return this.transacoes
      .filter(t => t.tipo === 'Despesa' && t.status === 'Aprovado')
      .reduce((sum, t) => sum + t.valor, 0);
  }

  public get saldoGeralConsolidado(): number {
    return this.totalRecebidoConsolidado - this.totalPagoConsolidado;
  }

  public get totalPendenteConsolidado(): number {
    return this.transacoes
      .filter(t => t.tipo === 'Despesa' && t.status === 'Pendente')
      .reduce((sum, t) => sum + t.valor, 0);
  }

  public get countPendenteConsolidado(): number {
    return this.transacoes.filter(t => t.tipo === 'Despesa' && t.status === 'Pendente').length;
  }

  // ----------------------------------------------------
  // PROJECT SPECIFIC GETTERS
  // ----------------------------------------------------
  public get selectedProject(): ProjetoFinanceiro | null {
    return this.projetos.find(p => p.id === this.selectedProjectId) || null;
  }

  public get totalRecebidoProjeto(): number {
    return this.transacoes
      .filter(t => t.projetoId === this.selectedProjectId && t.tipo === 'Receita' && t.status === 'Aprovado')
      .reduce((sum, t) => sum + t.valor, 0);
  }

  public get totalPagoProjeto(): number {
    return this.transacoes
      .filter(t => t.projetoId === this.selectedProjectId && t.tipo === 'Despesa' && t.status === 'Aprovado')
      .reduce((sum, t) => sum + t.valor, 0);
  }

  public get saldoProjeto(): number {
    return this.totalRecebidoProjeto - this.totalPagoProjeto;
  }

  public get totalPendenteProjeto(): number {
    return this.transacoes
      .filter(t => t.projetoId === this.selectedProjectId && t.tipo === 'Despesa' && t.status === 'Pendente')
      .reduce((sum, t) => sum + t.valor, 0);
  }

  public get categoriesProgress(): OrcamentoCategoria[] {
    return this.categoriasOrcamento[this.selectedProjectId] || [];
  }

  // Get project transactions
  public getProjectTransactions(projId: string): Transacao[] {
    return this.transacoes.filter(t => t.projetoId === projId);
  }

  // ----------------------------------------------------
  // INTERACTIVE ACTIONS
  // ----------------------------------------------------

  // Approve payment or receipt
  public approveTransaction(t: Transacao): void {
    t.status = 'Aprovado';
    
    // If it's a despesa, update category execution totals in budget matrix
    if (t.tipo === 'Despesa') {
      const budgetList = this.categoriasOrcamento[t.projetoId];
      if (budgetList) {
        const catObj = budgetList.find(c => c.categoria === t.categoria);
        if (catObj) {
          catObj.executado += t.valor;
        } else {
          // If category not mapped, create it
          budgetList.push({ categoria: t.categoria, previsto: t.valor, executado: t.valor });
        }
      }
    }
    alert(`Lançamento "${t.descricao}" aprovado com sucesso!`);
  }

  // Reject payment
  public rejectTransaction(t: Transacao): void {
    t.status = 'Rejeitado';
    alert(`Lançamento "${t.descricao}" rejeitado.`);
  }

  // Form actions
  public openAddTransaction(): void {
    const proj = this.selectedProject;
    this.transactionForm = {
      tipo: 'Despesa',
      descricao: '',
      valor: 0,
      categoria: this.categories[0],
      centroCusto: proj ? proj.centroCusto : 'CC-000',
      status: 'Pendente',
      comprovanteUrl: '',
      notaFiscal: ''
    };
    this.showAddTransactionForm = true;
  }

  public saveTransaction(): void {
    if (!this.transactionForm.descricao || !this.transactionForm.valor || this.transactionForm.valor <= 0) {
      alert('Por favor, preencha a descrição e um valor válido.');
      return;
    }

    const proj = this.selectedProject;
    if (!proj) return;

    const newTrans: Transacao = {
      id: `t-${Date.now()}`,
      projetoId: proj.id,
      projetoNome: proj.nome,
      tipo: this.transactionForm.tipo || 'Despesa',
      descricao: this.transactionForm.descricao || '',
      valor: this.transactionForm.valor || 0,
      data: new Date().toISOString().split('T')[0],
      categoria: this.transactionForm.categoria || 'Outros',
      centroCusto: proj.centroCusto,
      status: this.transactionForm.status || 'Pendente',
      comprovanteUrl: this.transactionForm.comprovanteUrl || '',
      notaFiscal: this.transactionForm.notaFiscal || ''
    };

    this.transacoes.unshift(newTrans);
    this.showAddTransactionForm = false;

    // If approved immediately, trigger budget increments
    if (newTrans.status === 'Aprovado') {
      const budgetList = this.categoriasOrcamento[newTrans.projetoId];
      if (budgetList) {
        const catObj = budgetList.find(c => c.categoria === newTrans.categoria);
        if (catObj) {
          catObj.executado += newTrans.valor;
        } else {
          budgetList.push({ categoria: newTrans.categoria, previsto: newTrans.valor, executado: newTrans.valor });
        }
      }
    }

    alert('Transação registrada com sucesso!');
  }

  // Link invoice directly
  public openInvoiceInput(transId: string): void {
    this.activeInvoiceInputId = transId;
    this.tempInvoiceCode = '';
  }

  public saveInvoiceLink(t: Transacao): void {
    if (this.tempInvoiceCode.trim()) {
      t.notaFiscal = this.tempInvoiceCode.trim();
      this.activeInvoiceInputId = null;
      this.tempInvoiceCode = '';
      alert(`Nota fiscal vinculada com sucesso à despesa.`);
    }
  }

  // Attach voucher simulation
  public openVoucherInput(transId: string): void {
    this.activeVoucherInputId = transId;
    this.tempVoucherFile = '';
  }

  public saveVoucherLink(t: Transacao): void {
    if (this.tempVoucherFile.trim()) {
      t.comprovanteUrl = this.tempVoucherFile.trim();
      this.activeVoucherInputId = null;
      this.tempVoucherFile = '';
      alert(`Comprovante fiscal anexado com sucesso.`);
    }
  }

  // ----------------------------------------------------
  // STATISTICS & CHART SIMULATION HELPERS
  // ----------------------------------------------------
  
  // Expenses distribution breakdown for Consolidated Donut graphic
  public getCategoryExpensesConsolidated(): { category: string; value: number; percentage: number; color: string }[] {
    const expenses = this.transacoes.filter(t => t.tipo === 'Despesa' && t.status === 'Aprovado');
    const total = expenses.reduce((sum, t) => sum + t.valor, 0);
    
    if (total === 0) return [];

    const categoriesMap: Record<string, number> = {};
    expenses.forEach(t => {
      categoriesMap[t.categoria] = (categoriesMap[t.categoria] || 0) + t.valor;
    });

    const colors = ['#06b6d4', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6', '#64748b'];

    return Object.keys(categoriesMap).map((catName, idx) => {
      const val = categoriesMap[catName];
      return {
        category: catName,
        value: val,
        percentage: Math.round((val / total) * 100),
        color: colors[idx % colors.length]
      };
    });
  }

  // Category percentage calculation for progress bar
  public getCategoryProgressPercentage(cat: OrcamentoCategoria): number {
    if (!cat.previsto) return 0;
    return Math.min(Math.round((cat.executado / cat.previsto) * 100), 100);
  }

  // BRL Currency formatting
  public formatCurrency(val: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  }

  // BRL Currency formatting with decimal
  public formatCurrencyDecimal(val: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(val);
  }

  public openDocument(fileName: string): void {
    alert(`Simulação: Abrindo/Baixando comprovante fiscal "${fileName}"`);
  }
}
