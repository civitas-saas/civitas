import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-fornecedores',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto py-10 animate-fade-in font-sans">
      <div class="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        <!-- Glow design -->
        <div class="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-slate-500/5 blur-xl"></div>
        
        <div class="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/50 text-slate-300 flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
        </div>
        
        <h1 class="text-2xl font-bold text-white mb-2">Fornecedores & Parceiros</h1>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 mb-6">
          Estrutura Preparada
        </span>
        
        <p class="text-slate-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
          Cadastre prestadores de serviços, consultores, palestrantes, parceiros de co-execução e fornecedores comerciais. Acompanhe certidões negativas, dados bancários e histórico de contratações.
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
export class FornecedoresComponent {}
