import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';

export interface ComentarioEvidencia {
  id: string;
  autor: string;
  data: string;
  texto: string;
}

export interface Evidencia {
  id: string;
  tipo: 'Foto' | 'Vídeo' | 'PDF' | 'Nota Fiscal' | 'Recibo' | 'Contrato' | 'Lista de Presença' | 'Documento Digitalizado' | 'Link Externo';
  projetoId: string;
  projetoNome: string;
  etapa: string;
  responsavel: string;
  data: string;
  localizacao?: string;
  arquivoUrl: string;
  arquivoNome: string;
  statusValidacao: 'Pendente' | 'Aprovado' | 'Rejeitado';
  comentarios: ComentarioEvidencia[];
}

@Component({
  selector: 'app-evidencias',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './evidencias.component.html',
  styleUrl: './evidencias.component.css'
})
export class EvidenciasComponent {
  public supabaseService = inject(SupabaseService);

  // Filter and view states
  public filtroProjeto: string = '';
  public filtroTipo: string = '';
  public filtroStatus: string = '';
  public buscaTextual: string = '';

  // Form states
  public showAddForm: boolean = false;
  public novaEvidenciaForm: Partial<Evidencia> = {
    tipo: 'Foto',
    projetoId: 'proj-1',
    etapa: 'Infraestrutura e Laboratórios',
    responsavel: '',
    localizacao: '',
    arquivoUrl: '',
    arquivoNome: ''
  };
  public selectedFile: File | null = null;
  public uploadProgress: number = 0;
  public isUploading: boolean = false;

  // Details Modal states
  public selectedEvidencia: Evidencia | null = null;
  public novoComentario: string = '';
  public motivoRejeicao: string = '';
  public showRejectionInput: boolean = false;

  // Config options
  public tiposEvidencia: Evidencia['tipo'][] = [
    'Foto',
    'Vídeo',
    'PDF',
    'Nota Fiscal',
    'Recibo',
    'Contrato',
    'Lista de Presença',
    'Documento Digitalizado',
    'Link Externo'
  ];

  public projetos = [
    { 
      id: 'proj-1', 
      nome: 'Inclusão Digital para Jovens de Baixa Renda', 
      etapas: ['Infraestrutura e Laboratórios', 'Seleção de Alunos', 'Execução de Aulas - Módulo I', 'Avaliação e Encerramento'] 
    },
    { 
      id: 'proj-2', 
      nome: 'Alfabetização Cidadã para Adultos', 
      etapas: ['Planejamento Pedagógico', 'Matrículas abertas', 'Aulas de Letramento', 'Exames Finais'] 
    },
    { 
      id: 'proj-3', 
      nome: 'Esporte e Lazer no Bairro', 
      etapas: ['Reforma da Quadra', 'Inscrição das Equipes', 'Campeonato Municipal', 'Entrega de Medalhas'] 
    },
    { 
      id: 'proj-4', 
      nome: 'Reciclagem de Resíduos e Sustentabilidade', 
      etapas: ['Aquisição de Prensas', 'Capacitação de Cooperativas', 'Campanhas de Coleta', 'Relatório de Destinação'] 
    }
  ];

  // List of pre-loaded evidences
  public evidencias: Evidencia[] = [
    {
      id: 'ev-1',
      tipo: 'Foto',
      projetoId: 'proj-1',
      projetoNome: 'Inclusão Digital para Jovens de Baixa Renda',
      etapa: 'Infraestrutura e Laboratórios',
      responsavel: 'Luciana M. Silva',
      data: '2026-05-15',
      localizacao: 'Laboratório de Informática - Núcleo Comunitário',
      arquivoUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
      arquivoNome: 'lab_inauguracao_computadores.jpg',
      statusValidacao: 'Aprovado',
      comentarios: [
        { id: 'c-1', autor: 'Auditor Federal', data: '2026-05-18', texto: 'Laboratório verificado. 15 computadores novos instalados conforme plano.' }
      ]
    },
    {
      id: 'ev-2',
      tipo: 'Lista de Presença',
      projetoId: 'proj-1',
      projetoNome: 'Inclusão Digital para Jovens de Baixa Renda',
      etapa: 'Execução de Aulas - Módulo I',
      responsavel: 'Prof. Thiago Santos',
      data: '2026-06-02',
      localizacao: 'Sala de Aulas A',
      arquivoUrl: 'lista_presenca_aula1.pdf',
      arquivoNome: 'lista_presenca_aula1_assinado.pdf',
      statusValidacao: 'Pendente',
      comentarios: []
    },
    {
      id: 'ev-3',
      tipo: 'PDF',
      projetoId: 'proj-2',
      projetoNome: 'Alfabetização Cidadã para Adultos',
      etapa: 'Planejamento Pedagógico',
      responsavel: 'Maria Helena Rocha',
      data: '2026-04-10',
      arquivoUrl: 'plano_pedagogico_alfabetizacao.pdf',
      arquivoNome: 'projeto_pedagogico_v1.pdf',
      statusValidacao: 'Aprovado',
      comentarios: [
        { id: 'c-2', autor: 'Diretoria Pedagógica', data: '2026-04-12', texto: 'Plano aprovado de acordo com a BNCC de jovens e adultos.' }
      ]
    },
    {
      id: 'ev-4',
      tipo: 'Nota Fiscal',
      projetoId: 'proj-1',
      projetoNome: 'Inclusão Digital para Jovens de Baixa Renda',
      etapa: 'Infraestrutura e Laboratórios',
      responsavel: 'Raimundo Nonato',
      data: '2026-03-24',
      localizacao: 'Fornecedor Foco Tech',
      arquivoUrl: 'nf_88492.pdf',
      arquivoNome: 'nota_fiscal_notebooks_focotech.pdf',
      statusValidacao: 'Rejeitado',
      comentarios: [
        { id: 'c-3', autor: 'Financeiro Central', data: '2026-03-28', texto: 'Arquivo corrompido. Não é possível ler o código de barras ou a chave da NF.' }
      ]
    },
    {
      id: 'ev-5',
      tipo: 'Link Externo',
      projetoId: 'proj-4',
      projetoNome: 'Reciclagem de Resíduos e Sustentabilidade',
      etapa: 'Campanhas de Coleta',
      responsavel: 'Arthur de Souza',
      data: '2026-06-08',
      arquivoUrl: 'https://www.sustentabilidade-hoje.org/noticia-campanha-civitas-reciclagem',
      arquivoNome: 'Matéria na Imprensa - Sustentabilidade Hoje',
      statusValidacao: 'Aprovado',
      comentarios: [
        { id: 'c-4', autor: 'Comunicação Civitas', data: '2026-06-09', texto: 'Excelente cobertura jornalística sobre o evento de lançamento das cooperativas.' }
      ]
    }
  ];

  // ----------------------------------------------------
  // GETTERS & COMPUTES
  // ----------------------------------------------------
  public get filteredEvidencias(): Evidencia[] {
    return this.evidencias.filter(ev => {
      const matchProjeto = !this.filtroProjeto || ev.projetoId === this.filtroProjeto;
      const matchTipo = !this.filtroTipo || ev.tipo === this.filtroTipo;
      const matchStatus = !this.filtroStatus || ev.statusValidacao === this.filtroStatus;
      
      const search = this.buscaTextual.toLowerCase().trim();
      const matchText = !search || 
        ev.arquivoNome.toLowerCase().includes(search) || 
        ev.responsavel.toLowerCase().includes(search) ||
        ev.etapa.toLowerCase().includes(search) ||
        ev.comentarios.some(c => c.texto.toLowerCase().includes(search));
        
      return matchProjeto && matchTipo && matchStatus && matchText;
    });
  }

  // Count summaries
  public get countTotal(): number {
    return this.evidencias.length;
  }

  public get countAprovadas(): number {
    return this.evidencias.filter(e => e.statusValidacao === 'Aprovado').length;
  }

  public get countPendentes(): number {
    return this.evidencias.filter(e => e.statusValidacao === 'Pendente').length;
  }

  public get countRejeitadas(): number {
    return this.evidencias.filter(e => e.statusValidacao === 'Rejeitado').length;
  }

  // Etapas options based on selected project in form
  public get formEtapas(): string[] {
    const projId = this.novaEvidenciaForm.projetoId;
    const proj = this.projetos.find(p => p.id === projId);
    return proj ? proj.etapas : [];
  }

  // ----------------------------------------------------
  // AUDITING & ACTIONS
  // ----------------------------------------------------
  public openDetails(ev: Evidencia): void {
    this.selectedEvidencia = ev;
    this.novoComentario = '';
    this.motivoRejeicao = '';
    this.showRejectionInput = false;
  }

  public closeDetails(): void {
    this.selectedEvidencia = null;
  }

  public approveEvidencia(ev: Evidencia): void {
    ev.statusValidacao = 'Aprovado';
    ev.comentarios.push({
      id: `c-${Date.now()}`,
      autor: this.supabaseService.currentProfile()?.full_name || 'Auditor Civitas',
      data: new Date().toISOString().split('T')[0],
      texto: 'Evidência validada e aprovada para prestação de contas.'
    });
    alert('Evidência aprovada com sucesso!');
  }

  public startRejection(): void {
    this.showRejectionInput = true;
    this.motivoRejeicao = '';
  }

  public cancelRejection(): void {
    this.showRejectionInput = false;
  }

  public rejectEvidencia(ev: Evidencia): void {
    if (!this.motivoRejeicao.trim()) {
      alert('Por favor, informe a justificativa da rejeição.');
      return;
    }

    ev.statusValidacao = 'Rejeitado';
    ev.comentarios.push({
      id: `c-${Date.now()}`,
      autor: this.supabaseService.currentProfile()?.full_name || 'Auditor Civitas',
      data: new Date().toISOString().split('T')[0],
      texto: `REJEITADO: ${this.motivoRejeicao.trim()}`
    });

    this.showRejectionInput = false;
    alert('Evidência rejeitada com a justificativa registrada.');
  }

  public addComment(ev: Evidencia): void {
    if (!this.novoComentario.trim()) return;

    ev.comentarios.push({
      id: `c-${Date.now()}`,
      autor: this.supabaseService.currentProfile()?.full_name || 'Usuário Civitas',
      data: new Date().toISOString().split('T')[0],
      texto: this.novoComentario.trim()
    });

    this.novoComentario = '';
  }

  // ----------------------------------------------------
  // FILE SELECTION & UPLOAD
  // ----------------------------------------------------
  public onFileSelected(event: any): void {
    const file = event.target?.files?.[0];
    if (file) {
      this.selectedFile = file;
      this.novaEvidenciaForm.arquivoNome = file.name;
    }
  }

  public openAddForm(): void {
    this.novaEvidenciaForm = {
      tipo: 'Foto',
      projetoId: 'proj-1',
      etapa: 'Infraestrutura e Laboratórios',
      responsavel: this.supabaseService.currentProfile()?.full_name || '',
      localizacao: '',
      arquivoUrl: '',
      arquivoNome: ''
    };
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.isUploading = false;
    this.showAddForm = true;
  }

  public async submitForm(): Promise<void> {
    const f = this.novaEvidenciaForm;
    if (!f.responsavel || !f.tipo || !f.etapa) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const proj = this.projetos.find(p => p.id === f.projetoId);
    if (!proj) return;

    const newEvidencia: Evidencia = {
      id: `ev-${Date.now()}`,
      tipo: f.tipo || 'Foto',
      projetoId: f.projetoId || 'proj-1',
      projetoNome: proj.nome,
      etapa: f.etapa || '',
      responsavel: f.responsavel || '',
      data: new Date().toISOString().split('T')[0],
      localizacao: f.localizacao || '',
      arquivoUrl: f.arquivoUrl || '',
      arquivoNome: f.arquivoNome || 'Link Externo',
      statusValidacao: 'Pendente',
      comentarios: []
    };

    // If it is a link external, we don't upload a file
    if (newEvidencia.tipo === 'Link Externo') {
      if (!f.arquivoUrl) {
        alert('Por favor, insira o link externo de referência.');
        return;
      }
      newEvidencia.arquivoNome = 'Link Externo';
      this.evidencias.unshift(newEvidencia);
      this.showAddForm = false;
      alert('Evidência (Link) registrada com sucesso!');
      return;
    }

    // Must select a file if it is not link external
    if (!this.selectedFile) {
      alert('Por favor, selecione um arquivo para realizar o upload.');
      return;
    }

    newEvidencia.arquivoNome = this.selectedFile.name;
    this.isUploading = true;
    this.uploadProgress = 0;

    // Real Supabase Storage Upload Attempt
    try {
      const fileExt = this.selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `evidencias/${newEvidencia.projetoId}/${fileName}`;

      // Simulate UI progress while fetching network
      const progressTimer = setInterval(() => {
        if (this.uploadProgress < 85) {
          this.uploadProgress += 15;
        }
      }, 100);

      // Perform upload
      const { data, error } = await this.supabaseService.supabase.storage
        .from('evidencias')
        .upload(filePath, this.selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressTimer);

      if (error) {
        throw error;
      }

      // Upload success - get public URL
      const { data: urlData } = this.supabaseService.supabase.storage
        .from('evidencias')
        .getPublicUrl(filePath);

      this.uploadProgress = 100;
      newEvidencia.arquivoUrl = urlData.publicUrl;

      setTimeout(() => {
        this.evidencias.unshift(newEvidencia);
        this.isUploading = false;
        this.showAddForm = false;
        alert('Evidência enviada com sucesso para o Supabase Storage!');
      }, 400);

    } catch (err: any) {
      console.warn('Falha no upload real para o Supabase Storage (redirecionando para simulação local):', err);
      
      // Fallback: visual simulation timer
      const fallbackTimer = setInterval(() => {
        this.uploadProgress += 10;
        if (this.uploadProgress >= 100) {
          clearInterval(fallbackTimer);
          
          // Generate a mock URL that matches aesthetic patterns
          const fileEncoded = encodeURIComponent(this.selectedFile!.name);
          newEvidencia.arquivoUrl = `mock-storage://evidencias/${newEvidencia.projetoId}/${Date.now()}_${fileEncoded}`;
          
          setTimeout(() => {
            this.evidencias.unshift(newEvidencia);
            this.isUploading = false;
            this.showAddForm = false;
            alert('Upload concluído no ambiente de simulação local!');
          }, 300);
        }
      }, 150);
    }
  }

  private resetForm(): void {
    this.novaEvidenciaForm = {
      tipo: 'Foto',
      projetoId: 'proj-1',
      etapa: 'Infraestrutura e Laboratórios',
      responsavel: '',
      localizacao: '',
      arquivoUrl: '',
      arquivoNome: ''
    };
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.isUploading = false;
  }

  // ----------------------------------------------------
  // GENERAL HELPERS
  // ----------------------------------------------------
  public isImage(ev: Evidencia): boolean {
    if (ev.tipo === 'Foto') return true;
    const name = ev.arquivoNome.toLowerCase();
    return name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.gif') || name.startsWith('https://images.unsplash.com');
  }

  public isVideo(ev: Evidencia): boolean {
    if (ev.tipo === 'Vídeo') return true;
    const name = ev.arquivoNome.toLowerCase();
    return name.endsWith('.mp4') || name.endsWith('.webm') || name.endsWith('.mov');
  }

  public openLink(url: string): void {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank');
    } else {
      alert(`Simulação: Baixando/Visualizando arquivo de evidência "${url}"`);
    }
  }
}
