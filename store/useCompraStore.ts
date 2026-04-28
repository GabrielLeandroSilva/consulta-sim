import { create } from "zustand";
import { Item, Sessao } from "@/types";
import { api } from "@/lib/api";

interface CompraStore {
    sessaoAtiva: Sessao | null;
    historico: Sessao[];
    carregando: boolean;

    carregarHistorico: () => Promise<void>;
    iniciarSessao: (nome: string) => Promise<void>;
    adicionarItem: (item: Omit<Item, "id" | "subtotal" | "criadoEm">) => Promise<void>;
    editarItem: (id: string, dados: { quantidade: number; precoUnitario: number }) => Promise<void>;
    removerItem: (id: string) => Promise<void>;
    finalizarSessao: () => Promise<void>;
    descartarSessao: () => Promise<void>;
    removerSessaoHistorico: (id: string) => Promise<void>;
}

export const useCompraStore = create<CompraStore>((set, get) => ({
    sessaoAtiva: null,
    historico: [],
    carregando: false,
  
    carregarHistorico: async () => {
        set({ carregando: true });
        try {
          const sessoes = await api.sessoes.listar();
          const finalizadas = sessoes.filter((s) => s.finalizada);
          const ativa = sessoes.find((s) => !s.finalizada) ?? null;
          set({ historico: finalizadas, sessaoAtiva: ativa });
        } catch (err) {
          console.error("ERRO AO CARREGAR HISTÓRICO:", err);
        } finally {
          set({ carregando: false });
        }
      },
  
    iniciarSessao: async (nome) => {
        set({ carregando: true });
        try {
          const sessao = await api.sessoes.criar(nome);
          set({ sessaoAtiva: sessao });
        } catch (err) {
          console.error("ERRO AO INICIAR SESSÃO:", err);
        } finally {
          set({ carregando: false });
        }
      },
  
    adicionarItem: async (dadosItem) => {
      const { sessaoAtiva } = get();
      if (!sessaoAtiva) return;
  
      set({ carregando: true });
      try {
        await api.itens.adicionar(sessaoAtiva.id, dadosItem);
        const sessaoAtualizada = await api.sessoes.buscar(sessaoAtiva.id);
        set({ sessaoAtiva: sessaoAtualizada });
      } finally {
        set({ carregando: false });
      }
    },
  
    editarItem: async (id, dados) => {
      const { sessaoAtiva } = get();
      if (!sessaoAtiva) return;
  
      set({ carregando: true });
      try {
        await api.itens.editar(id, dados);
        const sessaoAtualizada = await api.sessoes.buscar(sessaoAtiva.id);
        set({ sessaoAtiva: sessaoAtualizada });
      } finally {
        set({ carregando: false });
      }
    },
  
    removerItem: async (id) => {
      const { sessaoAtiva } = get();
      if (!sessaoAtiva) return;
  
      set({ carregando: true });
      try {
        await api.itens.deletar(id);
        const sessaoAtualizada = await api.sessoes.buscar(sessaoAtiva.id);
        set({ sessaoAtiva: sessaoAtualizada });
      } finally {
        set({ carregando: false });
      }
    },
  
    finalizarSessao: async () => {
      const { sessaoAtiva } = get();
      if (!sessaoAtiva) return;
  
      set({ carregando: true });
      try {
        const sessaoFinalizada = await api.sessoes.atualizar(sessaoAtiva.id, {
          finalizada: true,
          finalizadaEm: new Date().toISOString(),
        });
        set((state) => ({
          sessaoAtiva: null,
          historico: [sessaoFinalizada, ...state.historico],
        }));
      } finally {
        set({ carregando: false });
      }
    },
  
    descartarSessao: async () => {
      const { sessaoAtiva } = get();
      if (!sessaoAtiva) return;
  
      set({ carregando: true });
      try {
        await api.sessoes.deletar(sessaoAtiva.id);
        set({ sessaoAtiva: null });
      } finally {
        set({ carregando: false });
      }
    },
  
    removerSessaoHistorico: async (id) => {
      set({ carregando: true });
      try {
        await api.sessoes.deletar(id);
        set((state) => ({
          historico: state.historico.filter((s) => s.id !== id),
        }));
      } finally {
        set({ carregando: false });
      }
    },
  }));