import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface CertidaoFornecedor {
  id: string;
  nome: string;
  emissor: string;
  dataEmissao: string;
  dataValidade: string;
  arquivoUrl: string;
}

export interface DadosBancarios {
  banco: string;
  agencia: string;
  conta: string;
  tipoConta: string;
  chavePix?: string;
}

export interface Fornecedor {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  cnae: string;
  telefone: string;
  email: string;
  endereco: string;
  dadosBancarios: DadosBancarios;
  certidoes: CertidaoFornecedor[];
  statusCompliance: 'Regular' | 'Irregular' | 'Em Análise' | 'Bloqueado';
}

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './fornecedores.component.html',
  styleUrl: './fornecedores.component.css'
})
export class FornecedoresComponent {
  // Navigation views
  public currentView: 'list' | 'create' | 'edit' | 'detail' = 'list';
  public selectedSupplier: Fornecedor | null = null;

  // Search and Filters
  public searchQuery: string = '';
  public filterCompliance: string = 'all';

  // Forms Management
  public supplierForm: Partial<Fornecedor> = {};
  public uploadCertType: string = '';
  public mockFileName: string = '';

  // Options
  public complianceOptions = ['Regular', 'Irregular', 'Em Análise', 'Bloqueado'];
  public commonCerts = [
    'FGTS (Regularidade Fundo Garantia)',
    'CND Federal (Tributos e Dívida Ativa da União)',
    'CNDT (Inexistência de Débitos Trabalhistas)',
    'CND Estadual (Secretaria da Fazenda)',
    'CND Municipal (Tributos Mobiliários)'
  ];

  // Mock initial data
  public fornecedores: Fornecedor[] = [
    {
      id: 'forn-1',
      razaoSocial: 'Foco Tech Soluções de TI Ltda',
      nomeFantasia: 'Foco Tech',
      cnpj: '12.345.678/0001-90',
      cnae: '62.01-5-01 - Desenvolvimento de programas de computador sob encomenda',
      telefone: '(11) 98765-4321',
      email: 'contato@focotech.com.br',
      endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01311-100',
      dadosBancarios: {
        banco: 'Itaú Unibanco',
        agencia: '0300',
        conta: '12345-6',
        tipoConta: 'Conta Corrente',
        chavePix: '12.345.678/0001-90'
      },
      certidoes: [
        { id: 'c-1-1', nome: 'FGTS (Regularidade Fundo Garantia)', emissor: 'Caixa Econômica Federal', dataEmissao: '2026-04-10', dataValidade: '2026-07-10', arquivoUrl: 'certidao_fgts_focotech.pdf' },
        { id: 'c-1-2', nome: 'CND Federal (Tributos e Dívida Ativa da União)', emissor: 'Receita Federal do Brasil', dataEmissao: '2026-01-15', dataValidade: '2026-07-15', arquivoUrl: 'cnd_receita_federal.pdf' },
        { id: 'c-1-3', nome: 'CNDT (Inexistência de Débitos Trabalhistas)', emissor: 'Tribunal Superior do Trabalho', dataEmissao: '2026-02-10', dataValidade: '2026-08-10', arquivoUrl: 'cndt_tst.pdf' }
      ],
      statusCompliance: 'Regular'
    },
    {
      id: 'forn-2',
      razaoSocial: 'Construtora e Incorporadora Fortes S/A',
      nomeFantasia: 'Construtora Fortes',
      cnpj: '98.765.432/0001-10',
      cnae: '41.20-4-00 - Construção de edifícios',
      telefone: '(11) 4567-8900',
      email: 'comercial@fortesconstrutora.com.br',
      endereco: 'Rua das Laranjeiras, 450 - Centro, Rio de Janeiro - RJ, 22240-002',
      dadosBancarios: {
        banco: 'Banco do Brasil',
        agencia: '1234',
        conta: '98765-4',
        tipoConta: 'Conta Corrente',
        chavePix: 'financeiro@fortesconstrutora.com.br'
      },
      certidoes: [
        { id: 'c-2-1', nome: 'FGTS (Regularidade Fundo Garantia)', emissor: 'Caixa Econômica Federal', dataEmissao: '2026-01-05', dataValidade: '2026-04-05', arquivoUrl: 'certidao_fgts_vencida.pdf' },
        { id: 'c-2-2', nome: 'CND Federal (Tributos e Dívida Ativa da União)', emissor: 'Receita Federal do Brasil', dataEmissao: '2025-11-20', dataValidade: '2026-05-20', arquivoUrl: 'receita_federal_vencida.pdf' }
      ],
      statusCompliance: 'Irregular'
    },
    {
      id: 'forn-3',
      razaoSocial: 'Editora Grafia e Embalagens Eireli',
      nomeFantasia: 'Gráfica Grafia',
      cnpj: '55.444.333/0001-22',
      cnae: '18.11-3-02 - Impressão de publicações',
      telefone: '(31) 3456-1122',
      email: 'orcamentos@grafiagrafica.com.br',
      endereco: 'Av. do Contorno, 8000 - Lourdes, Belo Horizonte - MG, 30110-060',
      dadosBancarios: {
        banco: 'Banco Santander',
        agencia: '3456',
        conta: '44556-7',
        tipoConta: 'Conta Corrente',
        chavePix: '55.444.333/0001-22'
      },
      certidoes: [
        { id: 'c-3-1', nome: 'FGTS (Regularidade Fundo Garantia)', emissor: 'Caixa Econômica Federal', dataEmissao: '2026-05-15', dataValidade: '2026-08-15', arquivoUrl: 'fgts_grafia.pdf' },
        { id: 'c-3-2', nome: 'CND Municipal (Tributos Mobiliários)', emissor: 'Prefeitura de Belo Horizonte', dataEmissao: '2026-03-01', dataValidade: '2026-06-01', arquivoUrl: 'municipal_bh_vencida.pdf' }
      ],
      statusCompliance: 'Em Análise'
    },
    {
      id: 'forn-4',
      razaoSocial: 'Transportes Rápidos Express Ltda',
      nomeFantasia: 'Rápidos Express',
      cnpj: '33.222.111/0001-44',
      cnae: '49.30-2-02 - Transporte rodoviário de carga',
      telefone: '(81) 3224-5566',
      email: 'financeiro@rapidos.com.br',
      endereco: 'Av. Caxangá, 2500 - Cordeiro, Recife - PE, 50711-000',
      dadosBancarios: {
        banco: 'Caixa Econômica Federal',
        agencia: '0600',
        conta: '8877-6',
        tipoConta: 'Conta Corrente',
        chavePix: 'financeiro@rapidos.com.br'
      },
      certidoes: [
        { id: 'c-4-1', nome: 'CND Federal (Tributos e Dívida Ativa da União)', emissor: 'Receita Federal do Brasil', dataEmissao: '2025-05-10', dataValidade: '2025-11-10', arquivoUrl: 'receita_federal_bloqueada.pdf' }
      ],
      statusCompliance: 'Bloqueado'
    }
  ];

  // Filtering suppliers
  public get filteredFornecedores(): Fornecedor[] {
    return this.fornecedores.filter(forn => {
      const matchesText = 
        forn.razaoSocial.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        forn.nomeFantasia.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        forn.cnpj.replace(/\D/g, '').includes(this.searchQuery.replace(/\D/g, ''));
      
      const matchesCompliance = this.filterCompliance === 'all' || forn.statusCompliance === this.filterCompliance;
      
      // Filter for showing only expired suppliers
      if (this.filterCompliance === 'expired') {
        return matchesText && this.hasExpiredCerts(forn);
      }

      return matchesText && matchesCompliance;
    });
  }

  // Views Controls
  public viewList(): void {
    this.currentView = 'list';
    this.selectedSupplier = null;
    this.supplierForm = {};
  }

  public viewDetail(supplier: Fornecedor): void {
    this.selectedSupplier = supplier;
    this.currentView = 'detail';
    this.uploadCertType = supplier.certidoes.length > 0 ? supplier.certidoes[0].nome : '';
    this.mockFileName = '';
  }

  public viewCreate(): void {
    this.supplierForm = {
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      cnae: '',
      telefone: '',
      email: '',
      endereco: '',
      dadosBancarios: {
        banco: '',
        agencia: '',
        conta: '',
        tipoConta: 'Conta Corrente',
        chavePix: ''
      },
      certidoes: this.commonCerts.map((name, i) => ({
        id: `new-c-${i}-${Date.now()}`,
        nome: name,
        emissor: name.includes('FGTS') ? 'Caixa Econômica Federal' : name.includes('Federal') ? 'Receita Federal' : name.includes('Trabalhistas') ? 'Tribunal Superior do Trabalho' : name.includes('Estadual') ? 'Secretaria da Fazenda' : 'Prefeitura Municipal',
        dataEmissao: '',
        dataValidade: '',
        arquivoUrl: ''
      })),
      statusCompliance: 'Em Análise'
    };
    this.currentView = 'create';
  }

  public viewEdit(supplier: Fornecedor): void {
    this.selectedSupplier = supplier;
    this.supplierForm = JSON.parse(JSON.stringify(supplier)); // deep clone
    this.currentView = 'edit';
  }

  // CRUD Operations
  public saveNewSupplier(): void {
    if (!this.supplierForm.razaoSocial || !this.supplierForm.nomeFantasia || !this.supplierForm.cnpj) {
      alert('Por favor, preencha a Razão Social, Nome Fantasia e o CNPJ.');
      return;
    }

    const newSupplier: Fornecedor = {
      id: `forn-${Date.now()}`,
      razaoSocial: this.supplierForm.razaoSocial || '',
      nomeFantasia: this.supplierForm.nomeFantasia || '',
      cnpj: this.supplierForm.cnpj || '',
      cnae: this.supplierForm.cnae || 'Não informado',
      telefone: this.supplierForm.telefone || '',
      email: this.supplierForm.email || '',
      endereco: this.supplierForm.endereco || '',
      dadosBancarios: {
        banco: this.supplierForm.dadosBancarios?.banco || 'Não informado',
        agencia: this.supplierForm.dadosBancarios?.agencia || '',
        conta: this.supplierForm.dadosBancarios?.conta || '',
        tipoConta: this.supplierForm.dadosBancarios?.tipoConta || 'Conta Corrente',
        chavePix: this.supplierForm.dadosBancarios?.chavePix || ''
      },
      certidoes: this.supplierForm.certidoes || [],
      statusCompliance: this.supplierForm.statusCompliance || 'Em Análise'
    };

    // Filter out certs with no details
    newSupplier.certidoes = newSupplier.certidoes.filter(c => c.dataValidade !== '');

    this.recalculateCompliance(newSupplier);
    this.fornecedores.unshift(newSupplier);
    this.viewList();
  }

  public saveEditSupplier(): void {
    if (!this.selectedSupplier || !this.supplierForm.id) return;

    if (!this.supplierForm.razaoSocial || !this.supplierForm.nomeFantasia || !this.supplierForm.cnpj) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    const index = this.fornecedores.findIndex(f => f.id === this.supplierForm.id);
    if (index !== -1) {
      const updated = this.supplierForm as Fornecedor;
      this.recalculateCompliance(updated);
      this.fornecedores[index] = updated;
    }
    
    this.viewList();
  }

  public deleteSupplier(id: string): void {
    if (confirm('Deseja excluir este fornecedor permanentemente?')) {
      this.fornecedores = this.fornecedores.filter(f => f.id !== id);
      if (this.currentView === 'detail') {
        this.viewList();
      }
    }
  }

  // Data helpers
  public isExpired(dateStr: string): boolean {
    if (!dateStr) return false;
    const todayStr = '2026-06-10'; // Local fixed reference time
    return dateStr < todayStr;
  }

  public getExpiredCertsCount(supplier: Fornecedor): number {
    if (!supplier.certidoes) return 0;
    return supplier.certidoes.filter(c => c.dataValidade && this.isExpired(c.dataValidade)).length;
  }

  public hasExpiredCerts(supplier: Fornecedor): boolean {
    return this.getExpiredCertsCount(supplier) > 0;
  }

  public recalculateCompliance(supplier: Fornecedor): void {
    if (supplier.statusCompliance === 'Bloqueado') return;
    const expiredCount = this.getExpiredCertsCount(supplier);
    if (expiredCount > 0) {
      supplier.statusCompliance = 'Irregular';
    } else if (supplier.certidoes.length === 0) {
      supplier.statusCompliance = 'Em Análise';
    } else {
      supplier.statusCompliance = 'Regular';
    }
  }

  // Warning Alerts Helpers
  public get irregularSuppliersCount(): number {
    return this.fornecedores.filter(f => f.statusCompliance === 'Irregular' || this.hasExpiredCerts(f)).length;
  }

  public get suppliersWithExpiredCerts(): Fornecedor[] {
    return this.fornecedores.filter(f => this.hasExpiredCerts(f));
  }

  // Simulation Upload
  public simulateUpload(supplier: Fornecedor): void {
    if (!this.uploadCertType || !this.mockFileName.trim()) {
      alert('Por favor, selecione qual certidão deseja renovar e informe o nome do arquivo.');
      return;
    }

    const cert = supplier.certidoes.find(c => c.nome === this.uploadCertType);
    if (cert) {
      const today = new Date('2026-06-10'); // Simulated today
      const expirationDate = new Date('2026-06-10');
      expirationDate.setDate(today.getDate() + 90); // +90 days validation

      cert.dataEmissao = today.toISOString().split('T')[0];
      cert.dataValidade = expirationDate.toISOString().split('T')[0];
      cert.arquivoUrl = this.mockFileName.trim();

      this.recalculateCompliance(supplier);
      
      const formattedExpiration = expirationDate.toLocaleDateString('pt-BR');
      alert(`Sucesso! Certidão de "${cert.nome}" renovada. Nova validade até: ${formattedExpiration}`);
      
      this.mockFileName = '';
    } else {
      alert('Certidão não localizada.');
    }
  }

  public formatDate(dateStr: string): string {
    if (!dateStr) return 'Pendente';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  }

  public openDocument(fileName: string): void {
    alert(`Simulação: Abrindo/Baixando arquivo "${fileName}"`);
  }
}
