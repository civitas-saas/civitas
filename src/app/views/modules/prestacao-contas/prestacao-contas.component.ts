import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-prestacao-contas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto py-10 animate-fade-in font-sans">
      <div class="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        <!-- Glow design -->
        <div class="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-amber-500/5 blur-xl"></div>
        
        <div class="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        
        <h1 class="text-2xl font-bold text-white mb-2">Prestação de Contas</h1>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-6">
          Estrutura Preparada
        </span>
        
        <p class="text-slate-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
          Gere os demonstrativos financeiros e relatórios de conciliação bancária para prestar contas a órgãos públicos, conselhos municipais e patrocinadores privados. Vincule comprovantes, recibos e notas fiscais a cada despesa do projeto.
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
export class PrestacaoContasComponent {}
