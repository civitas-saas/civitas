import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Edital {
  id: string;
  titulo: string;
  orgao: string;
  tipo: string;
  area: 'Cultura' | 'Esporte' | 'Educação' | 'Saúde' | 'Social' | 'Meio Ambiente';
  dataPublicacao: string;
  prazoInscricao: string;
  valorDisponivel: number;
  requisitos: string;
  documentosObrigatorios: string[];
  anexos: string[];
  status: 'Aberto' | 'Em Análise' | 'Concluído' | 'Cancelado';
}

@Component({
  selector: 'app-editais',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './editais.component.html',
  styleUrl: './editais.component.css'
})
export class EditaisComponent {
  // Views state
  public currentView: 'list' | 'create' | 'edit' | 'detail' = 'list';
  public selectedEdital: Edital | null = null;

  // Filter & Search states
  public searchQuery: string = '';
  public filterArea: string = 'all';
  public filterStatus: string = 'all';
  public filterPrazo: string = 'all';

  // Form states
  public editalForm: Partial<Edital> = {};
  public tempDoc: string = '';
  public tempAnexo: string = '';

  // Initial rich mock data
  public editais: Edital[] = [
    {
      id: 'edt-1',
      titulo: 'Edital de Fomento à Cultura Viva 2026',
      orgao: 'Secretaria Estadual de Cultura',
      tipo: 'Chamamento Público',
      area: 'Cultura',
      dataPublicacao: '2026-02-15',
      prazoInscricao: '2026-06-30',
      valorDisponivel: 450000,
      requisitos: 'Entidades ativas há mais de 2 anos, portfólio comprovado de projetos artísticos locais e regularidade fiscal estadual.',
      documentosObrigatorios: ['Estatuto Social Atualizado', 'Ata de Eleição da Diretoria', 'Certidão Negativa Tributária', 'Relatório de Projetos Executados'],
      anexos: ['Edital_Cultura_Viva_Completo.pdf', 'Manual_Orientacao_Cultura.docx'],
      status: 'Aberto'
    },
    {
      id: 'edt-2',
      titulo: 'Chamamento Público Esporte para Todos',
      orgao: 'Ministério do Esporte',
      tipo: 'Fomento Direto',
      area: 'Esporte',
      dataPublicacao: '2026-03-01',
      prazoInscricao: '2026-07-15',
      valorDisponivel: 1200000,
      requisitos: 'Associações desportivas sem fins lucrativos com infraestrutura adequada de atendimento a jovens.',
      documentosObrigatorios: ['Certidão de Registro Esportivo', 'Balanço Patrimonial 2025', 'Plano de Trabalho Esporte'],
      anexos: ['Termo_Referencia_Esporte.pdf', 'Modelo_Plano_Trabalho.xlsx'],
      status: 'Aberto'
    },
    {
      id: 'edt-3',
      titulo: 'Programa de Apoio Pedagógico Contraturno',
      orgao: 'Fundo Municipal de Educação',
      tipo: 'Convênio de Cooperação',
      area: 'Educação',
      dataPublicacao: '2025-11-10',
      prazoInscricao: '2026-02-28',
      valorDisponivel: 350000,
      requisitos: 'Experiência prévia em contraturno escolar de no mínimo 1 ano, equipe multidisciplinar qualificada.',
      documentosObrigatorios: ['Certidão Federal Unificada', 'Projeto Pedagógico Preliminar', 'Comprovante de Sede Física'],
      anexos: ['Diretrizes_Educacao_Integral.pdf'],
      status: 'Concluído'
    },
    {
      id: 'edt-4',
      titulo: 'Saúde da Família Comunitária',
      orgao: 'Fundo Estadual de Saúde',
      tipo: 'Chamamento Público',
      area: 'Saúde',
      dataPublicacao: '2026-04-10',
      prazoInscricao: '2026-08-30',
      valorDisponivel: 800000,
      requisitos: 'Cadastro ativo no CNES (Cadastro Nacional de Estabelecimentos de Saúde), equipe com profissionais médicos/enfermeiros credenciados.',
      documentosObrigatorios: ['Registro CNES', 'Ata da Assembleia Geral', 'Certidão de Regularidade Municipal'],
      anexos: ['Instrucao_Normativa_Saude.pdf'],
      status: 'Em Análise'
    },
    {
      id: 'edt-5',
      titulo: 'Inclusão Produtiva e Capacitação Social',
      orgao: 'Secretaria de Assistência Social',
      tipo: 'Termo de Colaboração',
      area: 'Social',
      dataPublicacao: '2026-05-02',
      prazoInscricao: '2026-06-12',
      valorDisponivel: 280000,
      requisitos: 'Entidades registradas no CMAS (Conselho Municipal de Assistência Social), plano de inserção ao mercado de trabalho local.',
      documentosObrigatorios: ['Registro Ativo CMAS', 'Ata de Posse dos Conselheiros', 'Certidão Negativa FGTS'],
      anexos: ['Especificacao_Capacitacao_Social.pdf'],
      status: 'Aberto'
    },
    {
      id: 'edt-6',
      titulo: 'Florestas e Sustentabilidade Urbana 2026',
      orgao: 'Fundo Verde de Proteção Ambiental',
      tipo: 'Apoio a Projetos',
      area: 'Meio Ambiente',
      dataPublicacao: '2026-01-20',
      prazoInscricao: '2026-05-10',
      valorDisponivel: 600000,
      requisitos: 'Entidades com foco ambiental de conservação botânica ou reciclagem de resíduos sólidos.',
      documentosObrigatorios: ['Estatuto Social', 'Certificado OSCIP (se houver)', 'Relatório de Atividades Ambientais'],
      anexos: ['Edital_Reciclagem_Sustentabilidade.pdf'],
      status: 'Cancelado'
    }
  ];

  // Areas option list
  public areas = ['Cultura', 'Esporte', 'Educação', 'Saúde', 'Social', 'Meio Ambiente'];
  
  // Statuses option list
  public statuses = ['Aberto', 'Em Análise', 'Concluído', 'Cancelado'];

  // Filtering function
  public get filteredEditais(): Edital[] {
    const today = new Date().toISOString().split('T')[0];

    return this.editais.filter(edital => {
      // 1. Text search
      const matchesText = 
        edital.titulo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        edital.orgao.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        edital.tipo.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      // 2. Area Filter
      const matchesArea = this.filterArea === 'all' || edital.area === this.filterArea;
      
      // 3. Status Filter
      const matchesStatus = this.filterStatus === 'all' || edital.status === this.filterStatus;

      // 4. Deadline Filter
      let matchesDeadline = true;
      if (this.filterPrazo === 'active') {
        matchesDeadline = edital.prazoInscricao >= today && edital.status === 'Aberto';
      } else if (this.filterPrazo === 'expired') {
        matchesDeadline = edital.prazoInscricao < today || edital.status !== 'Aberto';
      }

      return matchesText && matchesArea && matchesStatus && matchesDeadline;
    });
  }

  // View Navigation Actions
  public viewList(): void {
    this.currentView = 'list';
    this.selectedEdital = null;
    this.editalForm = {};
  }

  public viewDetail(edital: Edital): void {
    this.selectedEdital = edital;
    this.currentView = 'detail';
  }

  public viewCreate(): void {
    this.editalForm = {
      titulo: '',
      orgao: '',
      tipo: '',
      area: 'Cultura',
      dataPublicacao: new Date().toISOString().split('T')[0],
      prazoInscricao: '',
      valorDisponivel: 0,
      requisitos: '',
      documentosObrigatorios: [],
      anexos: [],
      status: 'Aberto'
    };
    this.tempDoc = '';
    this.tempAnexo = '';
    this.currentView = 'create';
  }

  public viewEdit(edital: Edital): void {
    this.selectedEdital = edital;
    // Deep clone to avoid mutating raw list immediately
    this.editalForm = JSON.parse(JSON.stringify(edital));
    this.tempDoc = '';
    this.tempAnexo = '';
    this.currentView = 'edit';
  }

  // CRUD Operations
  public saveNewEdital(): void {
    if (!this.editalForm.titulo || !this.editalForm.orgao || !this.editalForm.prazoInscricao) {
      alert('Por favor, preencha os campos obrigatórios (Título, Órgão e Prazo de Inscrição).');
      return;
    }

    const newEd: Edital = {
      id: `edt-${Date.now()}`,
      titulo: this.editalForm.titulo || '',
      orgao: this.editalForm.orgao || '',
      tipo: this.editalForm.tipo || 'Chamamento Público',
      area: this.editalForm.area || 'Cultura',
      dataPublicacao: this.editalForm.dataPublicacao || new Date().toISOString().split('T')[0],
      prazoInscricao: this.editalForm.prazoInscricao || '',
      valorDisponivel: this.editalForm.valorDisponivel || 0,
      requisitos: this.editalForm.requisitos || '',
      documentosObrigatorios: this.editalForm.documentosObrigatorios || [],
      anexos: this.editalForm.anexos || [],
      status: this.editalForm.status || 'Aberto'
    };

    this.editais.unshift(newEd);
    this.viewList();
  }

  public saveEditEdital(): void {
    if (!this.selectedEdital || !this.editalForm.id) return;
    
    if (!this.editalForm.titulo || !this.editalForm.orgao || !this.editalForm.prazoInscricao) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    const index = this.editais.findIndex(e => e.id === this.editalForm.id);
    if (index !== -1) {
      this.editais[index] = this.editalForm as Edital;
    }

    this.viewList();
  }

  public deleteEdital(id: string): void {
    if (confirm('Tem certeza de que deseja excluir este edital permanentemente?')) {
      this.editais = this.editais.filter(e => e.id !== id);
      if (this.currentView === 'detail') {
        this.viewList();
      }
    }
  }

  // Document Helpers
  public addDocument(): void {
    if (this.tempDoc.trim()) {
      if (!this.editalForm.documentosObrigatorios) {
        this.editalForm.documentosObrigatorios = [];
      }
      this.editalForm.documentosObrigatorios.push(this.tempDoc.trim());
      this.tempDoc = '';
    }
  }

  public removeDocument(index: number): void {
    this.editalForm.documentosObrigatorios?.splice(index, 1);
  }

  // Attachment Helpers
  public addAttachment(): void {
    if (this.tempAnexo.trim()) {
      if (!this.editalForm.anexos) {
        this.editalForm.anexos = [];
      }
      this.editalForm.anexos.push(this.tempAnexo.trim());
      this.tempAnexo = '';
    }
  }

  public removeAttachment(index: number): void {
    this.editalForm.anexos?.splice(index, 1);
  }

  // General Helpers
  public formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  }

  public isDeadlineClose(dateStr: string): boolean {
    const today = new Date();
    const deadline = new Date(dateStr);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 15;
  }

  public getDaysRemaining(dateStr: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(dateStr);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Inscrições encerradas';
    if (diffDays === 0) return 'Encerra hoje!';
    if (diffDays === 1) return 'Encerra amanhã!';
    return `${diffDays} dias restantes`;
  }
}
