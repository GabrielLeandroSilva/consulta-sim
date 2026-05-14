import { create } from "zustand";
import { ListaItem, Categoria } from "@/types";
import { api } from "@/lib/api";
import { cacheLista } from "@/lib/cache";

interface ListaStore {
  itens: ListaItem[];
  carregando: boolean;
  sincronizando: boolean;

  carregarLista: () => Promise<void>;
  adicionarItem: (item: {
    nome: string;
    quantidade: number;
    categoria: Categoria;
  }) => Promise<void>;
  editarItem: (
    id: string,
    dados: Partial<{
      nome: string;
      quantidade: number;
      categoria: Categoria;
      pego: boolean;
    }>
  ) => Promise<void>;
  removerItem: (id: string) => Promise<void>;
  togglePego: (id: string) => Promise<void>;
  resetarPegos: () => Promise<void>;
}

function gerarIdTemp(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export const useListaStore = create<ListaStore>((set, get) => ({
  itens: [],
  carregando: false,
  sincronizando: false,

  carregarLista: async () => {
    set({ carregando: true });
    try {
      const cache = cacheLista.carregar();
      if (cache.length > 0) set({ itens: cache });

      const itens = await api.lista.listar();
      cacheLista.salvar(itens);
      set({ itens });
    } catch {
      set({ itens: cacheLista.carregar() });
    } finally {
      set({ carregando: false });
    }
  },

  adicionarItem: async (dadosItem) => {
    const idTemp = gerarIdTemp();
    const itemTemp: ListaItem = {
      ...dadosItem,
      id: idTemp,
      pego: false,
      criadoEm: new Date().toISOString(),
      usuarioId: "",
    };

    cacheLista.adicionar(itemTemp);
    set({ itens: cacheLista.carregar() });

    set({ sincronizando: true });
    try {
      const itemReal = await api.lista.adicionar(dadosItem);
      cacheLista.substituirIdTemporario(idTemp, itemReal.id);
      set({ itens: cacheLista.carregar() });
    } catch {
      cacheLista.remover(idTemp);
      set({ itens: cacheLista.carregar() });
    } finally {
      set({ sincronizando: false });
    }
  },

  editarItem: async (id, dados) => {
    cacheLista.atualizar(id, dados);
    set({ itens: cacheLista.carregar() });

    set({ sincronizando: true });
    try {
      await api.lista.editar(id, dados);
    } catch {
      const itens = await api.lista.listar();
      cacheLista.salvar(itens);
      set({ itens });
    } finally {
      set({ sincronizando: false });
    }
  },

  removerItem: async (id) => {
    cacheLista.remover(id);
    set({ itens: cacheLista.carregar() });

    set({ sincronizando: true });
    try {
      await api.lista.deletar(id);
    } catch {
      const itens = await api.lista.listar();
      cacheLista.salvar(itens);
      set({ itens });
    } finally {
      set({ sincronizando: false });
    }
  },

  togglePego: async (id) => {
    const { itens } = get();
    const item = itens.find((i) => i.id === id);
    if (!item) return;

    const novoPego = !item.pego;
    cacheLista.atualizar(id, { pego: novoPego });
    set({ itens: cacheLista.carregar() });

    set({ sincronizando: true });
    try {
      await api.lista.editar(id, { pego: novoPego });
    } catch {
      cacheLista.atualizar(id, { pego: item.pego });
      set({ itens: cacheLista.carregar() });
    } finally {
      set({ sincronizando: false });
    }
  },

  resetarPegos: async () => {
    cacheLista.resetarPegos();
    set({ itens: cacheLista.carregar() });

    set({ sincronizando: true });
    try {
      await api.lista.resetarPegos();
    } catch {
      const itens = await api.lista.listar();
      cacheLista.salvar(itens);
      set({ itens });
    } finally {
      set({ sincronizando: false });
    }
  },
}));