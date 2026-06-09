import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-evidencias',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto py-10 animate-fade-in font-sans">
      <div class="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        <!-- Glow design -->
        <div class="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-primary-500/5 blur-xl"></div>
        
        <div class="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        </div>
        
        <h1 class="text-2xl font-bold text-white mb-2">Comprovação & Evidências</h1>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20 mb-6">
          Estrutura Preparada
        </span>
        
        <p class="text-slate-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
          Reúna provas materiais da execução do seu projeto para auditar o impacto social. Armazene fotos das atividades, listas de presença assinadas, relatórios de impacto social, publicações na imprensa e depoimentos.
        </p>
        
        <div class="flex justify-center gap-4">
          <a routerLink="/dashboard" class="bg-slate-800 hover:bg-slate-700 text-slate-200 px-5 py-3 rounded-xl font-semibold text-xs transition-colors">
            Voltar ao Dashboard
          </a>
        </div>
      </div>
    </div>
  `
})
export class EvidenciasComponent {}
