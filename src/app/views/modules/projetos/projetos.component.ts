import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface TimelineStep {
  id: string;
  titulo: string;
  data: string;
  concluida: boolean;
}

export interface ChecklistItem {
  id: string;
  descricao: string;
  concluida: boolean;
}

export interface WorkPlanItem {
  id: string;
  etapa: string;
  atividade: string;
  responsavel: string;
  dataPrevista: string;
  dataRealizada?: string;
  orcamentoPrevisto: number;
  orcamentoExecutado: number;
  status: 'Pendente' | 'Em Andamento' | 'Concluído' | 'Atrasado';
  evidenciasObrigatorias: string[];
}

export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  organizacao: string;
  editalVinculado: string;
  patrocinadorVinculado: string;
  objetivo: string;
  publicoAlvo: string;
  valorAprovado: number;
  valorCaptado: number;
  valorExecutado: number;
  dataInicio: string;
  dataFim: string;
  status: 'Planejamento' | 'Em Execução' | 'Prestação de Contas' | 'Concluído' | 'Cancelado';
  timeline: TimelineStep[];
  checklist: ChecklistItem[];
  planoTrabalho: WorkPlanItem[];
}

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './projetos.component.html',
  styleUrl: './projetos.component.css'
} )
export class ProjetosComponent {
  // Navigation views
  public currentView: 'list' | 'create' | 'edit' | 'detail' = 'list';
  public selectedProject: Projeto | null = null;

  // Search and Filters
  public searchQuery: string = '';
  public filterStatus: string = 'all';

  // Detail view active tab and sub-views
  public activeDetailTab: 'panel' | 'workplan' | 'cronograma' = 'workplan';
  public activeWorkPlanView: 'table' | 'kanban' | 'timeline' = 'table';

  // Work Plan Form control
  public showWorkPlanForm: boolean = false;
  public editingWorkPlanItem: WorkPlanItem | null = null;
  public workPlanForm: Partial<WorkPlanItem> = {};
  public tempEvidenceInput: string = '';

  // Forms Management for basic project
  public projectForm: Partial<Projeto> = {};
  public tempChecklistItemDesc: string = '';
  public tempTimelineTitle: string = '';
  public tempTimelineDate: string = '';

  // Options
  public statusOptions = ['Planejamento', 'Em Execução', 'Prestação de Contas', 'Concluído', 'Cancelado'];
  public commonEtapas = [
    'Etapa 1: Infraestrutura e Preparação',
    'Etapa 2: Divulgação e Seleção',
    'Etapa 3: Execução Pedagógica / Atividades',
    'Etapa 4: Encerramento e Relatórios'
  ];
  public workPlanStatusOptions = ['Pendente', 'Em Andamento', 'Concluído', 'Atrasado'];

  // Mock initial data
  public projetos: Projeto[] = [
    {
      id: 'proj-1',
      nome: 'Inclusão Digital para Jovens de Baixa Renda',
      descricao: 'Capacitação profissional em tecnologia para jovens da comunidade local. O projeto ensina programação básica, introdução à robótica e preparação para entrevistas de emprego na área de T.I.',
      organizacao: 'Instituto Mão Amiga',
      editalVinculado: 'Edital de Fomento à Cultura Viva 2026',
      patrocinadorVinculado: 'Fundação Itaú',
      objetivo: 'Capacitar 200 jovens e encaminhar ao menos 30% para vagas de estágio em tecnologia no primeiro semestre.',
      publicoAlvo: 'Jovens de 14 a 18 anos residentes em áreas de vulnerabilidade social.',
      valorAprovado: 200000,
      valorCaptado: 150000,
      valorExecutado: 64282,
      dataInicio: '2026-03-01',
      dataFim: '2026-11-30',
      status: 'Em Execução',
      timeline: [
        { id: 't-1', titulo: 'Planejamento pedagógico e compra de computadores', data: '2026-03-10', concluida: true },
        { id: 't-2', titulo: 'Abertura das inscrições e processo seletivo', data: '2026-03-25', concluida: true },
        { id: 't-3', titulo: 'Inauguração da sala de T.I. e início das aulas', data: '2026-04-15', concluida: true },
        { id: 't-4', titulo: 'Seminário de Projetos Práticos de Programação', data: '2026-08-20', concluida: false },
        { id: 't-5', titulo: 'Formatura e integração profissional', data: '2026-11-25', concluida: false }
      ],
      checklist: [
        { id: 'c-1', descricao: 'Contratação dos professores de T.I.', concluida: true },
        { id: 'c-2', descricao: 'Compra e configuração dos 15 notebooks', concluida: true },
        { id: 'c-3', descricao: 'Elaboração das apostilas didáticas', concluida: true },
        { id: 'c-4', descricao: 'Aula inaugural com mentores do mercado', concluida: true },
        { id: 'c-5', descricao: 'Entrega dos certificados parciais do Módulo I', concluida: false },
        { id: 'c-6', descricao: 'Pesquisa final de satisfação e empregabilidade', concluida: false }
      ],
      planoTrabalho: [
        {
          id: 'wp-1-1',
          etapa: 'Etapa 1: Infraestrutura e Preparação',
          atividade: 'Readequação física do laboratório e instalação elétrica',
          responsavel: 'Carlos Mendonça',
          dataPrevista: '2026-03-10',
          dataRealizada: '2026-03-08',
          orcamentoPrevisto: 12000,
          orcamentoExecutado: 11500,
          status: 'Concluído',
          evidenciasObrigatorias: ['Contrato de Locação', 'Fotos do Laboratório']
        },
        {
          id: 'wp-1-2',
          etapa: 'Etapa 1: Infraestrutura e Preparação',
          atividade: 'Compra e configuração dos 15 computadores e rede wi-fi',
          responsavel: 'Mariana Silva',
          dataPrevista: '2026-03-20',
          dataRealizada: '2026-03-22',
          orcamentoPrevisto: 45000,
          orcamentoExecutado: 48000,
          status: 'Concluído',
          evidenciasObrigatorias: ['Nota Fiscal Eletrônica', 'Relatório de Ativos']
        },
        {
          id: 'wp-1-3',
          etapa: 'Etapa 2: Divulgação e Seleção',
          atividade: 'Processo seletivo e matrículas de jovens da comunidade',
          responsavel: 'Ana Paula Dias',
          dataPrevista: '2026-04-05',
          dataRealizada: '2026-04-04',
          orcamentoPrevisto: 3000,
          orcamentoExecutado: 2800,
          status: 'Concluído',
          evidenciasObrigatorias: ['Fichas de Inscrição', 'Edital de Seleção']
        },
        {
          id: 'wp-1-4',
          etapa: 'Etapa 3: Execução Pedagógica / Atividades',
          atividade: 'Aulas diárias do Módulo I (Lógica e Web Básica)',
          responsavel: 'Thiago Martins',
          dataPrevista: '2026-06-30',
          dataRealizada: '',
          orcamentoPrevisto: 25000,
          orcamentoExecutado: 12000,
          status: 'Em Andamento',
          evidenciasObrigatorias: ['Diários de Classe', 'Frequência dos Alunos']
        },
        {
          id: 'wp-1-5',
          etapa: 'Etapa 3: Execução Pedagógica / Atividades',
          atividade: 'Realização de Hackathon e desenvolvimento de projetos práticos',
          responsavel: 'Thiago Martins',
          dataPrevista: '2026-08-20',
          dataRealizada: '',
          orcamentoPrevisto: 8000,
          orcamentoExecutado: 0,
          status: 'Pendente',
          evidenciasObrigatorias: ['Fotos do Evento', 'Repositórios do Github']
        },
        {
          id: 'wp-1-6',
          etapa: 'Etapa 4: Encerramento e Relatórios',
          atividade: 'Visita técnica de mentoria no ecossistema de inovação',
          responsavel: 'Ana Paula Dias',
          dataPrevista: '2026-05-15',
          dataRealizada: '',
          orcamentoPrevisto: 6000,
          orcamentoExecutado: 0,
          status: 'Atrasado',
          evidenciasObrigatorias: ['Lista de Presença Assinada', 'Relatório Técnico']
        }
      ]
    },
    {
      id: 'proj-2',
      nome: 'Alfabetização Cidadã para Adultos',
      descricao: 'Curso noturno de letramento, alfabetização matemática e cidadania para adultos e idosos da comunidade do Sol.',
      organizacao: 'ONG Civitas Brasil',
      editalVinculado: 'Termo de Cooperação Municipal 08/2025',
      patrocinadorVinculado: 'Prefeitura de São Paulo',
      objetivo: 'Alfabetizar 80 adults não alfabetizados da região periférica para permitir inserção no mercado e autonomia básica.',
      publicoAlvo: 'Adultos e idosos acima de 35 anos que não concluíram o ensino primário.',
      valorAprovado: 90000,
      valorCaptado: 90000,
      valorExecutado: 90000,
      dataInicio: '2025-06-01',
      dataFim: '2026-02-15',
      status: 'Prestação de Contas',
      timeline: [
        { id: 't-6', titulo: 'Formulação de metodologia andragógica', data: '2025-06-05', concluida: true },
        { id: 't-7', titulo: 'Formação continuada de educadores sociais', data: '2025-06-18', concluida: true },
        { id: 't-8', titulo: 'Formatura festiva e entrega de diplomas', data: '2026-02-10', concluida: true }
      ],
      checklist: [
        { id: 'c-7', descricao: 'Mapeamento de alunos nas residências', concluida: true },
        { id: 'c-8', descricao: 'Compra de material escolar básico', concluida: true },
        { id: 'c-9', descricao: 'Homologação do relatório financeiro final', concluida: false }
      ],
      planoTrabalho: [
        {
          id: 'wp-2-1',
          etapa: 'Etapa 1: Infraestrutura e Preparação',
          atividade: 'Elaboração das apostilas de andragogia e material de apoio',
          responsavel: 'Clara Rodrigues',
          dataPrevista: '2025-06-10',
          dataRealizada: '2025-06-08',
          orcamentoPrevisto: 4000,
          orcamentoExecutado: 4000,
          status: 'Concluído',
          evidenciasObrigatorias: ['Apostila Homologada', 'Projeto Pedagógico']
        },
        {
          id: 'wp-2-2',
          etapa: 'Etapa 3: Execução Pedagógica / Atividades',
          atividade: 'Desenvolvimento das aulas noturnas de letramento',
          responsavel: 'Lucas Fonseca',
          dataPrevista: '2025-11-30',
          dataRealizada: '2025-11-28',
          orcamentoPrevisto: 46000,
          orcamentoExecutado: 46000,
          status: 'Concluído',
          evidenciasObrigatorias: ['Lista de Presença', 'Fotos das Oficinas']
        },
        {
          id: 'wp-2-3',
          etapa: 'Etapa 4: Encerramento e Relatórios',
          atividade: 'Consolidação das notas fiscais e envio ao setor municipal',
          responsavel: 'Clara Rodrigues',
          dataPrevista: '2026-02-10',
          dataRealizada: '2026-02-12',
          orcamentoPrevisto: 2000,
          orcamentoExecutado: 2000,
          status: 'Concluído',
          evidenciasObrigatorias: ['Parecer de Auditoria', 'Comprovantes de Custos']
        }
      ]
    },
    {
      id: 'proj-3',
      nome: 'Esporte e Lazer no Bairro',
      descricao: 'Oficinas esportivas descentralizadas de futebol, vôlei e atletismo para tirar crianças das ruas no período pós-escolar.',
      organizacao: 'Associação Crescer Juntos',
      editalVinculado: 'Chamamento Público Esporte para Todos',
      patrocinadorVinculado: 'Ministério do Esporte',
      objetivo: 'Atendimento de 150 crianças matriculadas na rede municipal de ensino com atividades de contra-turno no ginásio local.',
      publicoAlvo: 'Crianças de 8 a 13 anos estudantes de escolas públicas.',
      valorAprovado: 250000,
      valorCaptado: 120000,
      valorExecutado: 0,
      dataInicio: '2026-07-01',
      dataFim: '2027-04-30',
      status: 'Planejamento',
      timeline: [
        { id: 't-9', titulo: 'Locação do ginásio municipal e vistoria', data: '2026-06-15', concluida: false },
        { id: 't-10', titulo: 'Contratação de educadores físicos credenciados', data: '2026-06-25', concluida: false },
        { id: 't-11', titulo: 'Compra de bolas, coletes e redes de proteção', data: '2026-07-05', concluida: false }
      ],
      checklist: [
        { id: 'c-10', descricao: 'Vistoria técnica de segurança do espaço', concluida: false },
        { id: 'c-11', descricao: 'Abertura das inscrições nas escolas parceiras', concluida: false }
      ],
      planoTrabalho: [
        {
          id: 'wp-3-1',
          etapa: 'Etapa 1: Infraestrutura e Preparação',
          atividade: 'Vistoria técnica e locação do ginásio municipal',
          responsavel: 'Roberto Souza',
          dataPrevista: '2026-06-15',
          dataRealizada: '',
          orcamentoPrevisto: 10000,
          orcamentoExecutado: 0,
          status: 'Pendente',
          evidenciasObrigatorias: ['Laudo de Vistoria', 'Termo de Permissão']
        },
        {
          id: 'wp-3-2',
          etapa: 'Etapa 1: Infraestrutura e Preparação',
          atividade: 'Contratação e capacitação de educadores físicos',
          responsavel: 'Patrícia Neves',
          dataPrevista: '2026-06-25',
          dataRealizada: '',
          orcamentoPrevisto: 15000,
          orcamentoExecutado: 0,
          status: 'Pendente',
          evidenciasObrigatorias: ['Contrato de Trabalho', 'Certificados de Ed. Física']
        },
        {
          id: 'wp-3-3',
          etapa: 'Etapa 2: Divulgação e Seleção',
          atividade: 'Inscrições abertas e distribuição dos kits esportivos',
          responsavel: 'Roberto Souza',
          dataPrevista: '2026-07-05',
          dataRealizada: '',
          orcamentoPrevisto: 12000,
          orcamentoExecutado: 0,
          status: 'Pendente',
          evidenciasObrigatorias: ['Lista de Entrega de Kits', 'Fichas de Autorização']
        }
      ]
    },
    {
      id: 'proj-4',
      nome: 'Reciclagem de Resíduos e Sustentabilidade',
      descricao: 'Desenvolvimento de ecopontos comunitários e qualificação técnica para a cooperativa de catadores de materiais recicláveis.',
      organizacao: 'Cooperativa Recicla Vale',
      editalVinculado: 'Fomento Florestas e Sustentabilidade Urbana',
      patrocinadorVinculado: 'Fundo Verde Ambiental',
      objetivo: 'Aumentar a renda mensal de 40 catadores cooperados em no mínimo 25% através de melhor separação de plástico e metal.',
      publicoAlvo: 'Catadores autônomos e cooperados do município.',
      valorAprovado: 180000,
      valorCaptado: 180000,
      valorExecutado: 178500,
      dataInicio: '2025-08-01',
      dataFim: '2026-05-30',
      status: 'Concluído',
      timeline: [
        { id: 't-12', titulo: 'Entrega de equipamentos de EPI para os catadores', data: '2025-08-15', concluida: true },
        { id: 't-13', titulo: 'Instalação da prensa hidráulica industrial', data: '2025-10-01', concluida: true },
        { id: 't-14', titulo: 'Treinamento de triagem avançada de polímeros', data: '2025-11-20', concluida: true }
      ],
      checklist: [
        { id: 'c-12', descricao: 'Entrega de botas e luvas de proteção térmica', concluida: true },
        { id: 'c-13', descricao: 'Venda do primeiro lote prensado para a indústria', concluida: true }
      ],
      planoTrabalho: [
        {
          id: 'wp-4-1',
          etapa: 'Etapa 1: Infraestrutura e Preparação',
          atividade: 'Compra e entrega de EPIs para os 40 cooperados',
          responsavel: 'Gilberto Ramos',
          dataPrevista: '2025-08-15',
          dataRealizada: '2025-08-14',
          orcamentoPrevisto: 15000,
          orcamentoExecutado: 14500,
          status: 'Concluído',
          evidenciasObrigatorias: ['Recibos de Entrega de EPI', 'Fotos dos Cooperados']
        },
        {
          id: 'wp-4-2',
          etapa: 'Etapa 1: Infraestrutura e Preparação',
          atividade: 'Instalação de prensa hidráulica industrial',
          responsavel: 'Gilberto Ramos',
          dataPrevista: '2025-10-01',
          dataRealizada: '2025-10-05',
          orcamentoPrevisto: 80000,
          orcamentoExecutado: 82000,
          status: 'Concluído',
          evidenciasObrigatorias: ['Nota Fiscal da Prensa', 'Fotos da Instalação']
        },
        {
          id: 'wp-4-3',
          etapa: 'Etapa 3: Execução Pedagógica / Atividades',
          atividade: 'Oficinas de triagem avançada de polímeros e metais',
          responsavel: 'Fernanda Lins',
          dataPrevista: '2025-11-20',
          dataRealizada: '2025-11-22',
          orcamentoPrevisto: 18000,
          orcamentoExecutado: 18000,
          status: 'Concluído',
          evidenciasObrigatorias: ['Lista de Presença', 'Certificados de Conclusão']
        }
      ]
    }
  ];

  // Filtering projects
  public get filteredProjetos(): Projeto[] {
    return this.projetos.filter(proj => {
      const matchesText = 
        proj.nome.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        proj.descricao.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        proj.editalVinculado.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.filterStatus === 'all' || proj.status === this.filterStatus;

      return matchesText && matchesStatus;
    });
  }

  // Views Controls
  public viewList(): void {
    this.currentView = 'list';
    this.selectedProject = null;
    this.projectForm = {};
  }

  public viewDetail(proj: Projeto): void {
    this.selectedProject = proj;
    this.currentView = 'detail';
    this.activeDetailTab = 'workplan'; // Default to work plan tab
    this.activeWorkPlanView = 'table';
    this.showWorkPlanForm = false;
    this.editingWorkPlanItem = null;
  }

  public viewCreate(): void {
    this.projectForm = {
      nome: '',
      descricao: '',
      organizacao: 'Organização Civitas',
      editalVinculado: '',
      patrocinadorVinculado: '',
      objetivo: '',
      publicoAlvo: '',
      valorAprovado: 0,
      valorCaptado: 0,
      valorExecutado: 0,
      dataInicio: new Date().toISOString().split('T')[0],
      dataFim: '',
      status: 'Planejamento',
      timeline: [],
      checklist: [],
      planoTrabalho: []
    };
    this.tempChecklistItemDesc = '';
    this.tempTimelineTitle = '';
    this.tempTimelineDate = '';
    this.currentView = 'create';
  }

  public viewEdit(proj: Projeto): void {
    this.selectedProject = proj;
    this.projectForm = JSON.parse(JSON.stringify(proj)); // deep clone
    this.tempChecklistItemDesc = '';
    this.tempTimelineTitle = '';
    this.tempTimelineDate = '';
    this.currentView = 'edit';
  }

  // CRUD Operations
  public saveNewProject(): void {
    if (!this.projectForm.nome || !this.projectForm.dataInicio || !this.projectForm.dataFim) {
      alert('Por favor, preencha o Nome do Projeto e o Período de Vigência.');
      return;
    }

    const newProj: Projeto = {
      id: `proj-${Date.now()}`,
      nome: this.projectForm.nome || '',
      descricao: this.projectForm.descricao || '',
      organizacao: this.projectForm.organizacao || 'Organização Civitas',
      editalVinculado: this.projectForm.editalVinculado || 'Edital não vinculado',
      patrocinadorVinculado: this.projectForm.patrocinadorVinculado || 'Não especificado',
      objetivo: this.projectForm.objetivo || '',
      publicoAlvo: this.projectForm.publicoAlvo || '',
      valorAprovado: this.projectForm.valorAprovado || 0,
      valorCaptado: this.projectForm.valorCaptado || 0,
      valorExecutado: this.projectForm.valorExecutado || 0,
      dataInicio: this.projectForm.dataInicio || '',
      dataFim: this.projectForm.dataFim || '',
      status: this.projectForm.status || 'Planejamento',
      timeline: this.projectForm.timeline || [],
      checklist: this.projectForm.checklist || [],
      planoTrabalho: this.projectForm.planoTrabalho || []
    };

    this.projetos.unshift(newProj);
    this.viewList();
  }

  public saveEditProject(): void {
    if (!this.selectedProject || !this.projectForm.id) return;

    if (!this.projectForm.nome || !this.projectForm.dataInicio || !this.projectForm.dataFim) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const index = this.projetos.findIndex(p => p.id === this.projectForm.id);
    if (index !== -1) {
      this.projetos[index] = this.projectForm as Projeto;
    }
    
    this.viewList();
  }

  public deleteProject(id: string): void {
    if (confirm('Deseja excluir este projeto permanentemente?')) {
      this.projetos = this.projetos.filter(p => p.id !== id);
      if (this.currentView === 'detail') {
        this.viewList();
      }
    }
  }

  // Interactivity Actions in Detail View
  public toggleCheckItem(item: ChecklistItem): void {
    item.concluida = !item.concluida;
  }

  public toggleTimelineStep(step: TimelineStep): void {
    step.concluida = !step.concluida;
  }

  // In-Detail Form actions (Checklist and Timeline Quick additions)
  public addChecklistItemDirect(proj: Projeto): void {
    if (this.tempChecklistItemDesc.trim()) {
      proj.checklist.push({
        id: `c-${Date.now()}`,
        descricao: this.tempChecklistItemDesc.trim(),
        concluida: false
      });
      this.tempChecklistItemDesc = '';
    }
  }

  public removeChecklistItemDirect(proj: Projeto, index: number): void {
    proj.checklist.splice(index, 1);
  }

  public addTimelineStepDirect(proj: Projeto): void {
    if (this.tempTimelineTitle.trim() && this.tempTimelineDate) {
      proj.timeline.push({
        id: `t-${Date.now()}`,
        titulo: this.tempTimelineTitle.trim(),
        data: this.tempTimelineDate,
        concluida: false
      });
      // Sort timeline steps chronologically by date
      proj.timeline.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
      
      this.tempTimelineTitle = '';
      this.tempTimelineDate = '';
    } else {
      alert('Preencha a descrição e a data do marco da timeline.');
    }
  }

  public removeTimelineStepDirect(proj: Projeto, index: number): void {
    proj.timeline.splice(index, 1);
  }

  // Form Creation/Edition helpers for Arrays
  public addChecklistItemForm(): void {
    if (this.tempChecklistItemDesc.trim()) {
      if (!this.projectForm.checklist) this.projectForm.checklist = [];
      this.projectForm.checklist.push({
        id: `c-${Date.now()}`,
        descricao: this.tempChecklistItemDesc.trim(),
        concluida: false
      });
      this.tempChecklistItemDesc = '';
    }
  }

  public removeChecklistItemForm(index: number): void {
    this.projectForm.checklist?.splice(index, 1);
  }

  public addTimelineStepForm(): void {
    if (this.tempTimelineTitle.trim() && this.tempTimelineDate) {
      if (!this.projectForm.timeline) this.projectForm.timeline = [];
      this.projectForm.timeline.push({
        id: `t-${Date.now()}`,
        titulo: this.tempTimelineTitle.trim(),
        data: this.tempTimelineDate,
        concluida: false
      });
      this.projectForm.timeline.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
      this.tempTimelineTitle = '';
      this.tempTimelineDate = '';
    }
  }

  public removeTimelineStepForm(index: number): void {
    this.projectForm.timeline?.splice(index, 1);
  }

  // WORK PLAN ACTIONS
  public openAddWorkPlanItem(): void {
    this.editingWorkPlanItem = null;
    this.workPlanForm = {
      etapa: this.commonEtapas[0],
      atividade: '',
      responsavel: '',
      dataPrevista: new Date().toISOString().split('T')[0],
      dataRealizada: '',
      orcamentoPrevisto: 0,
      orcamentoExecutado: 0,
      status: 'Pendente',
      evidenciasObrigatorias: []
    };
    this.tempEvidenceInput = '';
    this.showWorkPlanForm = true;
  }

  public openEditWorkPlanItem(item: WorkPlanItem): void {
    this.editingWorkPlanItem = item;
    this.workPlanForm = JSON.parse(JSON.stringify(item));
    this.tempEvidenceInput = '';
    this.showWorkPlanForm = true;
  }

  public addEvidenceTag(): void {
    if (this.tempEvidenceInput.trim()) {
      if (!this.workPlanForm.evidenciasObrigatorias) {
        this.workPlanForm.evidenciasObrigatorias = [];
      }
      this.workPlanForm.evidenciasObrigatorias.push(this.tempEvidenceInput.trim());
      this.tempEvidenceInput = '';
    }
  }

  public removeEvidenceTag(idx: number): void {
    this.workPlanForm.evidenciasObrigatorias?.splice(idx, 1);
  }

  public saveWorkPlanItem(proj: Projeto): void {
    if (!this.workPlanForm.atividade || !this.workPlanForm.responsavel || !this.workPlanForm.dataPrevista) {
      alert('Por favor, preencha a Atividade, Responsável e a Data Prevista.');
      return;
    }

    if (!proj.planoTrabalho) {
      proj.planoTrabalho = [];
    }

    if (this.workPlanForm.status === 'Concluído' && !this.workPlanForm.dataRealizada) {
      this.workPlanForm.dataRealizada = new Date().toISOString().split('T')[0];
    }

    if (this.editingWorkPlanItem) {
      // Edit mode
      const idx = proj.planoTrabalho.findIndex(item => item.id === this.editingWorkPlanItem!.id);
      if (idx !== -1) {
        proj.planoTrabalho[idx] = {
          ...this.workPlanForm,
          id: this.editingWorkPlanItem.id
        } as WorkPlanItem;
      }
    } else {
      // Add mode
      const newItem: WorkPlanItem = {
        ...this.workPlanForm,
        id: `wp-${Date.now()}`
      } as WorkPlanItem;
      proj.planoTrabalho.push(newItem);
    }

    // Sort work plan items by dataPrevista
    proj.planoTrabalho.sort((a, b) => new Date(a.dataPrevista).getTime() - new Date(b.dataPrevista).getTime());

    this.showWorkPlanForm = false;
    this.editingWorkPlanItem = null;
    this.workPlanForm = {};
  }

  public deleteWorkPlanItem(proj: Projeto, itemId: string): void {
    if (confirm('Deseja excluir esta atividade do plano de trabalho?')) {
      proj.planoTrabalho = proj.planoTrabalho.filter(item => item.id !== itemId);
      // Update selected project reference to refresh UI
      if (this.selectedProject && this.selectedProject.id === proj.id) {
        this.selectedProject.planoTrabalho = proj.planoTrabalho;
      }
    }
  }

  public changeWorkPlanItemStatus(item: WorkPlanItem, newStatus: string): void {
    if (newStatus === 'Pendente' || newStatus === 'Em Andamento' || newStatus === 'Concluído' || newStatus === 'Atrasado') {
      item.status = newStatus;
      if (newStatus === 'Concluído') {
        if (!item.dataRealizada) {
          item.dataRealizada = new Date().toISOString().split('T')[0];
        }
      } else {
        item.dataRealizada = '';
      }
    }
  }

  public getWorkPlanItemsByStatus(proj: Projeto, status: string): WorkPlanItem[] {
    if (!proj || !proj.planoTrabalho) return [];
    return proj.planoTrabalho.filter(item => item.status === status);
  }

  public getWorkPlanBudgetTotals(proj: Projeto): { previsto: number, executado: number } {
    if (!proj.planoTrabalho || proj.planoTrabalho.length === 0) {
      return { previsto: 0, executado: 0 };
    }
    return proj.planoTrabalho.reduce((acc, curr) => {
      acc.previsto += curr.orcamentoPrevisto || 0;
      acc.executado += curr.orcamentoExecutado || 0;
      return acc;
    }, { previsto: 0, executado: 0 });
  }

  // Check if an item is visually delayed
  public isItemDelayed(item: WorkPlanItem): boolean {
    if (item.status === 'Concluído') return false;
    if (item.status === 'Atrasado') return true;
    
    const todayStr = new Date().toISOString().split('T')[0];
    return item.dataPrevista < todayStr;
  }

  // Visual/Formatting Helpers
  public formatCurrency(val: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(val);
  }

  public getExecutionProgress(proj: Projeto): number {
    if (!proj.valorCaptado) return 0;
    const progress = (proj.valorExecutado / proj.valorCaptado) * 100;
    return Math.min(Math.round(progress), 100);
  }

  public getCaptureProgress(proj: Projeto): number {
    if (!proj.valorAprovado) return 0;
    const progress = (proj.valorCaptado / proj.valorAprovado) * 100;
    return Math.min(Math.round(progress), 100);
  }

  public getChecklistCompletion(proj: Projeto): number {
    if (!proj.checklist || proj.checklist.length === 0) return 0;
    const total = proj.checklist.length;
    const done = proj.checklist.filter(c => c.concluida).length;
    return Math.round((done / total) * 100);
  }
}
