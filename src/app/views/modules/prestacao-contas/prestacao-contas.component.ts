import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';

export interface ComentarioItemPrestacao {
  id: string;
  autor: string;
  data: string;
  texto: string;
}

export interface DespesaPrestacao {
  id: string;
  projetoId: string;
  data: string;
  descricao: string;
  valor: number;
  categoria: string;
  statusItem: 'Pendente' | 'Aprovado' | 'Rejeitado';
  notaFiscal: string;
  comprovanteUrl: string;
  evidenciasVinculadas: string[]; // IDs of evidences
  comentarios: ComentarioItemPrestacao[];
}

export interface PrestacaoProjeto {
  projetoId: string;
  projetoNome: string;
  status: 'Em Preparação' | 'Enviada' | 'Em Análise' | 'Aprovada' | 'Rejeitada' | 'Corrigir Pendências';
  dataCriacao: string;
  dataAtualizacao: string;
  solicitante: string;
  centroCusto: string;
  fomentoOrigem: string;
}

export interface EvidenciaMock {
  id: string;
  tipo: string;
  arquivoNome: string;
  statusValidacao: string;
  projetoId: string;
}

@Component({
  selector: 'app-prestacao-contas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './prestacao-contas.component.html',
  styleUrl: './prestacao-contas.component.css'
})
export class PrestacaoContasComponent {
  public supabaseService = inject(SupabaseService);

  // States
  public selectedProjectId: string = 'proj-1';
  public activeInvoiceInputId: string | null = null;
  public activeVoucherInputId: string | null = null;
  public tempInvoiceCode: string = '';
  public tempVoucherFile: string = '';

  // Evidence Linker Modal
  public showEvidenceModal: boolean = false;
  public selectedDespesa: DespesaPrestacao | null = null;

  // Report Modal
  public showReportModal: boolean = false;
  public reportType: 'Parcial' | 'Final' = 'Parcial';

  // Audit In-row Comment Form
  public activeCommentInputId: string | null = null;
  public tempCommentText: string = '';
  public activeRejectionInputId: string | null = null;
  public tempRejectionReason: string = '';

  // Available Projects with Prestação de Contas status
  public prestacoes: PrestacaoProjeto[] = [
    {
      projetoId: 'proj-1',
      projetoNome: 'Inclusão Digital para Jovens de Baixa Renda',
      status: 'Em Preparação',
      dataCriacao: '2026-03-01',
      dataAtualizacao: '2026-06-10',
      solicitante: 'Luciana M. Silva',
      centroCusto: 'CC-101',
      fomentoOrigem: 'Fundação Itaú'
    },
    {
      projetoId: 'proj-2',
      projetoNome: 'Alfabetização Cidadã para Adultos',
      status: 'Aprovada',
      dataCriacao: '2025-06-01',
      dataAtualizacao: '2026-02-15',
      solicitante: 'Maria Helena Rocha',
      centroCusto: 'CC-102',
      fomentoOrigem: 'Prefeitura de São Paulo'
    },
    {
      projetoId: 'proj-3',
      projetoNome: 'Esporte e Lazer no Bairro',
      status: 'Enviada',
      dataCriacao: '2026-06-01',
      dataAtualizacao: '2026-06-05',
      solicitante: 'Prof. Thiago Santos',
      centroCusto: 'CC-103',
      fomentoOrigem: 'Ministério do Esporte'
    },
    {
      projetoId: 'proj-4',
      projetoNome: 'Reciclagem de Resíduos e Sustentabilidade',
      status: 'Corrigir Pendências',
      dataCriacao: '2026-01-15',
      dataAtualizacao: '2026-06-08',
      solicitante: 'Arthur de Souza',
      centroCusto: 'CC-104',
      fomentoOrigem: 'Fundo Verde Ambiental'
    }
  ];

  // List of expenses to reconcile
  public despesas: DespesaPrestacao[] = [
    {
      id: 'd-1',
      projetoId: 'proj-1',
      data: '2026-03-22',
      descricao: 'Compra de 15 computadores e roteador corporativo',
      valor: 48000,
      categoria: 'Equipamentos',
      statusItem: 'Aprovado',
      notaFiscal: 'NF-88492',
      comprovanteUrl: 'comprovante_pagamento_notebooks.pdf',
      evidenciasVinculadas: ['ev-1'],
      comentarios: [
        { id: 'c-1', autor: 'Auditor Federal', data: '2026-04-02', texto: 'Comprovante bancário bate perfeitamente com a NF vinculada.' }
      ]
    },
    {
      id: 'd-2',
      projetoId: 'proj-1',
      data: '2026-05-10',
      descricao: 'Honorários docentes - Módulo I (Lógica de Prog.)',
      valor: 12000,
      categoria: 'Recursos Humanos',
      statusItem: 'Aprovado',
      notaFiscal: 'RPA-223',
      comprovanteUrl: 'recibo_pagamento_prof_thiago.pdf',
      evidenciasVinculadas: [],
      comentarios: []
    },
    {
      id: 'd-3',
      projetoId: 'proj-1',
      data: '2026-04-10',
      descricao: 'Locação do laboratório de informática',
      valor: 4282,
      categoria: 'Serviços de Terceiros',
      statusItem: 'Pendente',
      notaFiscal: 'NF-0192',
      comprovanteUrl: '',
      evidenciasVinculadas: [],
      comentarios: []
    },
    {
      id: 'd-4',
      projetoId: 'proj-1',
      data: '2026-06-08',
      descricao: 'Serviços de consultoria pedagógica',
      valor: 8500,
      categoria: 'Serviços de Terceiros',
      statusItem: 'Pendente',
      notaFiscal: '',
      comprovanteUrl: '',
      evidenciasVinculadas: [],
      comentarios: []
    },
    // proj-2
    {
      id: 'd-5',
      projetoId: 'proj-2',
      data: '2025-06-08',
      descricao: 'Aquisição de material didático e apostilas',
      valor: 4000,
      categoria: 'Material Didático',
      statusItem: 'Aprovado',
      notaFiscal: 'NF-5541',
      comprovanteUrl: 'nota_fiscal_editora.pdf',
      evidenciasVinculadas: ['ev-3'],
      comentarios: []
    },
    {
      id: 'd-6',
      projetoId: 'proj-2',
      data: '2025-11-28',
      descricao: 'Pagamento professores de letramento noturno',
      valor: 46000,
      categoria: 'Recursos Humanos',
      statusItem: 'Aprovado',
      notaFiscal: 'RPA-882',
      comprovanteUrl: 'recibos_professores_folha.pdf',
      evidenciasVinculadas: [],
      comentarios: []
    },
    // proj-4
    {
      id: 'd-7',
      projetoId: 'proj-4',
      data: '2026-04-12',
      descricao: 'Aquisição de Prensa Hidráulica Reciclagem',
      valor: 96500,
      categoria: 'Equipamentos',
      statusItem: 'Rejeitado',
      notaFiscal: 'NF-3342',
      comprovanteUrl: '',
      evidenciasVinculadas: [],
      comentarios: [
        { id: 'c-5', autor: 'Auditor Fundo Verde', data: '2026-05-10', texto: 'REJEITADO: Falta anexo do comprovante bancário da transferência de pagamento.' }
      ]
    },
    {
      id: 'd-8',
      projetoId: 'proj-4',
      data: '2026-05-02',
      descricao: 'Treinamento das Cooperativas Locais',
      valor: 18000,
      categoria: 'Serviços de Terceiros',
      statusItem: 'Aprovado',
      notaFiscal: 'NF-0982',
      comprovanteUrl: 'comprovante_pagamento_treino.pdf',
      evidenciasVinculadas: ['ev-5'],
      comentarios: []
    }
  ];

  // Mocked evidences from Evidências component that can be linked
  public evidenciasMock: EvidenciaMock[] = [
    { id: 'ev-1', tipo: 'Foto', arquivoNome: 'lab_inauguracao_computadores.jpg', statusValidacao: 'Aprovado', projetoId: 'proj-1' },
    { id: 'ev-2', tipo: 'Lista de Presença', arquivoNome: 'lista_presenca_aula1_assinado.pdf', statusValidacao: 'Pendente', projetoId: 'proj-1' },
    { id: 'ev-3', tipo: 'PDF', arquivoNome: 'projeto_pedagogico_v1.pdf', statusValidacao: 'Aprovado', projetoId: 'proj-2' },
    { id: 'ev-4', tipo: 'Nota Fiscal', arquivoNome: 'nota_fiscal_notebooks_focotech.pdf', statusValidacao: 'Rejeitado', projetoId: 'proj-1' },
    { id: 'ev-5', tipo: 'Link Externo', arquivoNome: 'Matéria na Imprensa - Sustentabilidade Hoje', statusValidacao: 'Aprovado', projetoId: 'proj-4' }
  ];

  // ----------------------------------------------------
  // GETTERS & COMPUTED PROPERTIES
  // ----------------------------------------------------
  public get activePrestacao(): PrestacaoProjeto | null {
    return this.prestacoes.find(p => p.projetoId === this.selectedProjectId) || null;
  }

  public get activeDespesas(): DespesaPrestacao[] {
    return this.despesas.filter(d => d.projetoId === this.selectedProjectId);
  }

  public get activeEvidenciasDisponiveis(): EvidenciaMock[] {
    return this.evidenciasMock.filter(e => e.projetoId === this.selectedProjectId);
  }

  // Financial math summaries
  public get totalDespesasProjeto(): number {
    return this.activeDespesas.reduce((sum, d) => sum + d.valor, 0);
  }

  public get totalAprovadoProjeto(): number {
    return this.activeDespesas
      .filter(d => d.statusItem === 'Aprovado')
      .reduce((sum, d) => sum + d.valor, 0);
  }

  public get percentConciliado(): number {
    const total = this.activeDespesas.length;
    if (total === 0) return 0;
    const conciliados = this.activeDespesas.filter(d => d.notaFiscal && d.comprovanteUrl).length;
    return Math.round((conciliados / total) * 100);
  }

  public get countEvidenciasVinculadas(): number {
    return this.activeDespesas.reduce((sum, d) => sum + d.evidenciasVinculadas.length, 0);
  }

  // ----------------------------------------------------
  // CONCILIATION IN-ROW INPUT HANDLERS
  // ----------------------------------------------------
  public openInvoiceInput(dId: string): void {
    this.activeInvoiceInputId = dId;
    this.tempInvoiceCode = '';
  }

  public saveInvoiceCode(d: DespesaPrestacao): void {
    if (this.tempInvoiceCode.trim()) {
      d.notaFiscal = this.tempInvoiceCode.trim();
      this.activeInvoiceInputId = null;
      this.tempInvoiceCode = '';
      alert('Nota fiscal vinculada com sucesso.');
    }
  }

  public openVoucherInput(dId: string): void {
    this.activeVoucherInputId = dId;
    this.tempVoucherFile = '';
  }

  public saveVoucherFile(d: DespesaPrestacao): void {
    if (this.tempVoucherFile.trim()) {
      d.comprovanteUrl = this.tempVoucherFile.trim();
      this.activeVoucherInputId = null;
      this.tempVoucherFile = '';
      alert('Comprovante de pagamento anexado com sucesso.');
    }
  }

  // ----------------------------------------------------
  // EVIDENCE LINKER DIALOG HANDLERS
  // ----------------------------------------------------
  public openEvidenceLinker(d: DespesaPrestacao): void {
    this.selectedDespesa = d;
    this.showEvidenceModal = true;
  }

  public closeEvidenceLinker(): void {
    this.selectedDespesa = null;
    this.showEvidenceModal = false;
  }

  public isEvidenceLinked(evId: string): boolean {
    if (!this.selectedDespesa) return false;
    return this.selectedDespesa.evidenciasVinculadas.includes(evId);
  }

  public toggleEvidenceLink(evId: string): void {
    if (!this.selectedDespesa) return;
    const index = this.selectedDespesa.evidenciasVinculadas.indexOf(evId);
    if (index > -1) {
      this.selectedDespesa.evidenciasVinculadas.splice(index, 1);
    } else {
      this.selectedDespesa.evidenciasVinculadas.push(evId);
    }
  }

  public getEvidenciaName(evId: string): string {
    const ev = this.evidenciasMock.find(e => e.id === evId);
    return ev ? ev.arquivoNome : evId;
  }

  // ----------------------------------------------------
  // ITEM AUDITING ACTIONS (APPROVE/REJECT/COMMENT)
  // ----------------------------------------------------
  public approveItem(d: DespesaPrestacao): void {
    d.statusItem = 'Aprovado';
    d.comentarios.push({
      id: `c-${Date.now()}`,
      autor: this.supabaseService.currentProfile()?.full_name || 'Auditor Civitas',
      data: new Date().toISOString().split('T')[0],
      texto: 'Despesa validada administrativamente. Documentos e evidências conformes.'
    });
    alert('Despesa aprovada.');
  }

  public startRejection(dId: string): void {
    this.activeRejectionInputId = dId;
    this.tempRejectionReason = '';
  }

  public cancelRejection(): void {
    this.activeRejectionInputId = null;
  }

  public rejectItem(d: DespesaPrestacao): void {
    if (!this.tempRejectionReason.trim()) {
      alert('Por favor, informe a justificativa da recusa.');
      return;
    }

    d.statusItem = 'Rejeitado';
    d.comentarios.push({
      id: `c-${Date.now()}`,
      autor: this.supabaseService.currentProfile()?.full_name || 'Auditor Civitas',
      data: new Date().toISOString().split('T')[0],
      texto: `REJEITADO: ${this.tempRejectionReason.trim()}`
    });

    this.activeRejectionInputId = null;
    alert('Despesa rejeitada com observações registradas.');
  }

  public openCommentInput(dId: string): void {
    this.activeCommentInputId = dId;
    this.tempCommentText = '';
  }

  public saveItemComment(d: DespesaPrestacao): void {
    if (!this.tempCommentText.trim()) return;

    d.comentarios.push({
      id: `c-${Date.now()}`,
      autor: this.supabaseService.currentProfile()?.full_name || 'Gestor Civitas',
      data: new Date().toISOString().split('T')[0],
      texto: this.tempCommentText.trim()
    });

    this.activeCommentInputId = null;
    this.tempCommentText = '';
  }

  // ----------------------------------------------------
  // GLOBAL PRESTACAO STATUS TRANSITIONS
  // ----------------------------------------------------
  public changeGlobalStatus(newStatus: PrestacaoProjeto['status']): void {
    const p = this.activePrestacao;
    if (!p) return;

    p.status = newStatus;
    p.dataAtualizacao = new Date().toISOString().split('T')[0];
    alert(`Status da prestação de contas alterado para: ${newStatus}`);
  }

  // ----------------------------------------------------
  // REPORT VIEW GENERATOR
  // ----------------------------------------------------
  public triggerReport(type: 'Parcial' | 'Final'): void {
    this.reportType = type;
    this.showReportModal = true;
  }

  public closeReport(): void {
    this.showReportModal = false;
  }

  public printReport(): void {
    window.print();
  }

  // Helpers
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

  public getCategoryTotal(cat: string): number {
    return this.activeDespesas
      .filter(d => d.categoria === cat && d.statusItem === 'Aprovado')
      .reduce((sum, d) => sum + d.valor, 0);
  }
}
