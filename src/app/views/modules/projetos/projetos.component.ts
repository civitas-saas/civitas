import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 max-w-4xl mx-auto py-10 animate-fade-in font-sans">
      <div class="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        <!-- Glow design -->
        <div class="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-accent-500/5 blur-xl"></div>
        
        <div class="w-16 h-16 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-accent-400 flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
        </div>
        
        <h1 class="text-2xl font-bold text-white mb-2">Gestão de Projetos</h1>
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-6">
          Estrutura Preparada
        </span>
        
        <p class="text-slate-400 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
          Planeje e acompanhe a execução física de seus programas e metas sociais. Aloque equipes, controle cronogramas de atividades, defina beneficiários atendidos e meça o progresso das metas pactuadas.
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
export class ProjetosComponent {}
