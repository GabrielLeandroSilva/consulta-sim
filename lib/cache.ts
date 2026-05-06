import { Item, Sessao } from "@/types";

const CHAVE_SESSAO_ATIVA = "consultasim-sessao-ativa";

export const cache = {
  salvarSessao(sessao: Sessao) {
    localStorage.setItem(CHAVE_SESSAO_ATIVA, JSON.stringify(sessao));
  },

  carregarSessao(): Sessao | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(CHAVE_SESSAO_ATIVA);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as Sessao;
    } catch {
      return null;
    }
  },

  limparSessao() {
    localStorage.removeItem(CHAVE_SESSAO_ATIVA);
  },

  adicionarItem(item: Item) {
    const sessao = this.carregarSessao();
    if (!sessao) return;

    const itensAtualizados = [...sessao.itens, item];
    const total = itensAtualizados.reduce((acc, i) => acc + i.subtotal, 0);

    this.salvarSessao({
      ...sessao,
      itens: itensAtualizados,
      total,
    });
  },

  atualizarItem(id: string, dados: {
    nome?: string;
    quantidade?: number;
    precoUnitario?: number;
    categoria?: string;
  }) {
    const sessao = this.carregarSessao();
    if (!sessao) return;
  
    const itensAtualizados = sessao.itens.map((item) => {
      if (item.id !== id) return item;
      const atualizado = { ...item, ...dados, categoria: (dados.categoria ?? item.categoria) as import("@/types").Categoria };
      return {
        ...atualizado,
        subtotal: atualizado.quantidade * atualizado.precoUnitario,
      };
    });
  
    const total = itensAtualizados.reduce((acc, i) => acc + i.subtotal, 0);
  
    this.salvarSessao({
      ...sessao,
      itens: itensAtualizados,
      total,
    });
  },

  removerItem(id: string) {
    const sessao = this.carregarSessao();
    if (!sessao) return;

    const itensAtualizados = sessao.itens.filter((item) => item.id !== id);
    const total = itensAtualizados.reduce((acc, i) => acc + i.subtotal, 0);

    this.salvarSessao({
      ...sessao,
      itens: itensAtualizados,
      total,
    });
  },

  substituirIdTemporario(idTemp: string, idReal: string) {
    const sessao = this.carregarSessao();
    if (!sessao) return;

    const itensAtualizados = sessao.itens.map((item) =>
      item.id === idTemp ? { ...item, id: idReal } : item
    );

    this.salvarSessao({ ...sessao, itens: itensAtualizados });
  },
};