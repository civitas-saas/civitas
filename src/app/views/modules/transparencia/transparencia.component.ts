import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transparencia',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto py-10 animate-fade-in font-sans">
      <div class="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        <!-- Glow design -->
        <div class="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-accent-500/5 blur-xl"></div>
        
        <div class="w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-accent-400 flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        </div>
        
        <h1 class="text-2xl font-bold text-white mb-2">Portal de Transparência Publico</h1>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-6">
          Estrutura Preparada
        </span>
        
        <p class="text-slate-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
          Configure a página pública de prestação de contas da sua organização. Disponibilize de forma organizada e visual o andamento de seus projetos, editais vinculados, valores recebidos e relatórios de auditoria, atendendo à Lei de Acesso à Informação.
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
export class TransparenciaComponent {}
