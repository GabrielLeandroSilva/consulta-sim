import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Categoria, Item, Sessao } from "@/types";

interface CompraStore {
    sessaoAtiva: Sessao | null;
    historico: Sessao[];

    iniciarSessao: (nome: string) => void;
    adicionarItem: (item: Omit<Item, "id" | "subtotal" | "criadoEm">) => void;
    editarItem: (id: string, dados: Partial<Omit<Item, "id" | "criadoEm">>) => void;
    removerItem: (id: string) => void;
    finalizarSessao: () => void;
    descartarSessao: () => void;
    removerSessaoHistorico: (id: string) => void;
}

function calcularTotal(itens: Item[]): number {
    return itens.reduce((acc, item) => acc + item.subtotal, 0);
}

function gerarId(): string {
    return crypto.randomUUID();
}

export const useCompraStore = create<CompraStore>()(
    persist(
        (set) => ({
            sessaoAtiva: null,
            historico: [],

            iniciarSessao: (nome) =>
                set({
                    sessaoAtiva: {
                        id: gerarId(),
                        nome,
                        itens: [],
                        total: 0,
                        criadaEm: new Date().toISOString(),
                        finalizada: false,
                    },
                }),
            
            adicionarItem: (dadosItem) =>
                set((state) => {
                    if (!state.sessaoAtiva) return state;

                    const novoItem: Item = {
                        ...dadosItem,
                        id: gerarId(),
                        subtotal: dadosItem.quantidade * dadosItem.precoUnitario,
                        criadoEm: new Date().toISOString(),
                    };

                    const itensAtualizados = [...state.sessaoAtiva.itens, novoItem];

                    return {
                        sessaoAtiva: {
                            ...state.sessaoAtiva,
                            itens: itensAtualizados,
                            total: calcularTotal(itensAtualizados),
                        },
                    };
                }),
            
            editarItem: (id, dados) =>
                set((state) => {
                    if (!state.sessaoAtiva) return state;

                    const itensAtualizados = state.sessaoAtiva.itens.map((item) => {
                        if (item.id !== id) return item;

                        const atualizado = { ...item, ...dados };
                        return {
                            ...atualizado,
                            subtotal: atualizado.quantidade * atualizado.precoUnitario,
                        };
                    });

                    return {
                        sessaoAtiva: {
                            ...state.sessaoAtiva,
                            itens: itensAtualizados,
                            total: calcularTotal(itensAtualizados),
                        },
                    };
                }),
            
            removerItem: (id) =>
                set((state) => {
                    if (!state.sessaoAtiva) return state;

                    const itensAtualizados = state.sessaoAtiva.itens.filter((item) => item.id !== id);

                    return {
                        sessaoAtiva: {
                            ...state.sessaoAtiva,
                            itens: itensAtualizados,
                            total: calcularTotal(itensAtualizados),
                        },
                    };
                }),
            
            finalizarSessao: () =>
                set((state) => {
                    if (!state.sessaoAtiva) return state;

                    const sessaoFinalizada: Sessao = {
                        ...state.sessaoAtiva,
                        finalizada: true,
                        finalizadaEm: new Date().toISOString(),
                    }

                    return {
                        sessaoAtiva: null,
                        historico: [sessaoFinalizada, ...state.historico],
                    };
                }),
            
            descartarSessao: () => set({ sessaoAtiva: null }),
            
            removerSessaoHistorico: (id) =>
                set((state) => ({
                    historico: state.historico.filter((s) => s.id !== id),
                })),
        }),
        {
            name: "consultasim-storage",
        }
    )
);