import { Item, Sessao } from "@/types";

const BASE = "/api";

export const api = {
    sessoes: {
        async listar(): Promise<Sessao[]> {
            const res = await fetch(`${BASE}/sessoes`);
            if (!res.ok) throw new Error("Erro ao listar sessões");
            return res.json();
        },

        async criar(nome: string): Promise<Sessao> {
            const res = await fetch(`${BASE}/sessoes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome }),
            });
            if (!res.ok) throw new Error("Erro ao criar sessão");
            return res.json();
        },

        async buscar(id: string): Promise<Sessao> {
            const res = await fetch(`${BASE}/sessoes/${id}`);
            if (!res.ok) throw new Error("Erro ao buscar sessão");
            return res.json();
        },

        async atualizar(id: string, dados: Partial<Sessao>): Promise<Sessao> {
            const res = await fetch(`${BASE}/sessoes/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });
            if (!res.ok) throw new Error("Erro ao atualizar sessão");
            return res.json();
        },

        async deletar(id: string): Promise<void> {
            const res = await fetch(`${BASE}/sessoes/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Erro ao deletar sessão");
        },
    },

    itens: {
        async adicionar(
            sessaoId: string,
            item: Omit<Item, "id" | "subtotal" | "criadoEm">
        ): Promise<Item> {
            const res = await fetch(`${BASE}/sessoes/${sessaoId}/itens`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });

            if (!res.ok) throw new Error("Erro ao adicionar item");
            return res.json();
        },

        async editar(
            id: string,
            dados: { quantidade: number; precoUnitario: number }
        ): Promise<Item> {
            const res = await fetch(`${BASE}/itens/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });
            if (!res.ok) throw new Error("Erro ao editar item");
            return res.json();
        },

        async deletar(id: string): Promise<void> {
            const res = await fetch(`${BASE}/itens/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Erro ao deletar item");
        },
    },
};