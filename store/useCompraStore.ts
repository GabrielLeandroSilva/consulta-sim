import { create } from "zustand";
import { Item, Sessao } from "@/types";
import { api } from "@/lib/api";
import { cache } from "@/lib/cache";

interface CompraStore {
  sessaoAtiva: Sessao | null;
  historico: Sessao[];
  carregando: boolean;
  sincronizando: boolean;

  carregarHistorico: () => Promise<void>;
  iniciarSessao: (nome: string) => Promise<void>;
  adicionarItem: (item: Omit<Item, "id" | "subtotal" | "criadoEm">) => Promise<void>;
  editarItem: (id: string, dados: {
    nome: string;
    quantidade: number;
    precoUnitario: number;
    categoria: string;
  }) => Promise<void>;
  removerItem: (id: string) => Promise<void>;
  finalizarSessao: () => Promise<void>;
  descartarSessao: () => Promise<void>;
  removerSessaoHistorico: (id: string) => Promise<void>;
}

function gerarIdTemp(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export const useCompraStore = create<CompraStore>((set, get) => ({
  sessaoAtiva: null,
  historico: [],
  carregando: false,
  sincronizando: false,

  carregarHistorico: async () => {
    set({ carregando: true });
    try {
      // Carrega do cache local primeiro para UI instantânea
      const sessaoCache = cache.carregarSessao();
      if (sessaoCache) {
        set({ sessaoAtiva: sessaoCache });
      }

      // Depois sincroniza com o banco
      const sessoes = await api.sessoes.listar();
      const finalizadas = sessoes.filter((s) => s.finalizada);
      const ativa = sessoes.find((s) => !s.finalizada) ?? null;

      if (ativa) {
        cache.salvarSessao(ativa);
        set({ historico: finalizadas, sessaoAtiva: ativa });
      } else {
        set({ historico: finalizadas, sessaoAtiva: sessaoCache });
      }
    } catch {
      // Se a API falhar, mantém o cache local
      const sessaoCache = cache.carregarSessao();
      set({ sessaoAtiva: sessaoCache });
    } finally {
      set({ carregando: false });
    }
  },

  iniciarSessao: async (nome) => {
    set({ carregando: true });
    try {
      const sessao = await api.sessoes.criar(nome);
      cache.salvarSessao(sessao);
      set({ sessaoAtiva: sessao });
    } finally {
      set({ carregando: false });
    }
  },

  adicionarItem: async (dadosItem) => {
    const { sessaoAtiva } = get();
    if (!sessaoAtiva) return;

    // 1. Cria item temporário com ID local
    const idTemp = gerarIdTemp();
    const itemTemp: Item = {
      ...dadosItem,
      id: idTemp,
      subtotal: dadosItem.quantidade * dadosItem.precoUnitario,
      criadoEm: new Date().toISOString(),
    };

    // 2. Atualiza UI e cache imediatamente
    cache.adicionarItem(itemTemp);
    const sessaoAtualizada = cache.carregarSessao()!;
    set({ sessaoAtiva: sessaoAtualizada });

    // 3. Sincroniza com a API em segundo plano
    set({ sincronizando: true });
    try {
      const itemReal = await api.itens.adicionar(sessaoAtiva.id, dadosItem);

      // 4. Substitui o ID temporário pelo ID real
      cache.substituirIdTemporario(idTemp, itemReal.id);
      const sessaoFinal = cache.carregarSessao()!;
      set({ sessaoAtiva: sessaoFinal });
    } catch {
      // Se falhar, remove o item temporário
      cache.removerItem(idTemp);
      const sessaoRevertida = cache.carregarSessao()!;
      set({ sessaoAtiva: sessaoRevertida });
    } finally {
      set({ sincronizando: false });
    }
  },

  editarItem: async (id, dados) => {
    const { sessaoAtiva } = get();
    if (!sessaoAtiva) return;

    // 1. Atualiza UI e cache imediatamente
    cache.atualizarItem(id, dados);
    const sessaoAtualizada = cache.carregarSessao()!;
    set({ sessaoAtiva: sessaoAtualizada });

    // 2. Sincroniza com a API em segundo plano
    set({ sincronizando: true });
    try {
      await api.itens.editar(id, dados);
    } catch {
      // Se falhar, recarrega do banco
      const sessaoReal = await api.sessoes.buscar(sessaoAtiva.id);
      cache.salvarSessao(sessaoReal);
      set({ sessaoAtiva: sessaoReal });
    } finally {
      set({ sincronizando: false });
    }
  },

  removerItem: async (id) => {
    const { sessaoAtiva } = get();
    if (!sessaoAtiva) return;

    // 1. Remove da UI e cache imediatamente
    cache.removerItem(id);
    const sessaoAtualizada = cache.carregarSessao()!;
    set({ sessaoAtiva: sessaoAtualizada });

    // 2. Sincroniza com a API em segundo plano
    set({ sincronizando: true });
    try {
      await api.itens.deletar(id);
    } catch {
      // Se falhar, recarrega do banco
      const sessaoReal = await api.sessoes.buscar(sessaoAtiva.id);
      cache.salvarSessao(sessaoReal);
      set({ sessaoAtiva: sessaoReal });
    } finally {
      set({ sincronizando: false });
    }
  },

  finalizarSessao: async () => {
    const { sessaoAtiva } = get();
    if (!sessaoAtiva) return;

    set({ carregando: true });
    try {
      // Busca a sessão atualizada do banco antes de finalizar
      const sessaoReal = await api.sessoes.buscar(sessaoAtiva.id);

      const sessaoFinalizada = await api.sessoes.atualizar(sessaoReal.id, {
        finalizada: true,
        finalizadaEm: new Date().toISOString(),
      });

      cache.limparSessao();

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
      cache.limparSessao();
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