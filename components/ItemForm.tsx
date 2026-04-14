"use client"

import { useState } from "react";
import { Plus } from "lucide-react";
import { Categoria } from "@/types";

interface ItemFormProps {
    onAdicionar: (item: {
        nome: string;
        quantidade: number;
        precoUnitario: number;
        categoria: Categoria;
    }) => void;
}

const categorias: { value: Categoria; label: string }[] = [
    { value: "mercearia", label: "Mercearia" },
    { value: "hortifruti", label: "Hortifruti" },
    { value: "frios", label: "Frios" },
    { value: "limpeza", label: "Limpeza" },
    { value: "bebidas", label: "Bebidas" },
    { value: "higiene", label: "Higiene" },
    { value: "outros", label: "Outros" },
];

const FORM_INICIAL = {
    nome: "",
    quantidade: "1",
    precoUnitario: "",
    categoria: "mercearia" as Categoria,
};

export function ItemForm({ onAdicionar }: ItemFormProps) {
    const [form, setForm] = useState(FORM_INICIAL);

    const subtotalPreview = Number(form.quantidade) * Number(form.precoUnitario) || 0;

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.nome.trim() || !form.precoUnitario) return;

        onAdicionar({
            nome: form.nome.trim(),
            quantidade: Number(form.quantidade),
            precoUnitario: Number(form.precoUnitario),
            categoria: form.categoria,
        });

        setForm(FORM_INICIAL);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-xl p-4"
        >
            <div className="mb-3">
                <input
                    type="text"
                    placeholder="Nome do item"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Quantidade</label>
                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={form.quantidade}
                        onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="text-xs text-gray-400 mb-1 block">Preço Unitário</label>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0,00"
                        value={form.precoUnitario}
                        onChange={(e) => setForm({ ...form, precoUnitario: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="mb-3">
                <label className="text-xs text-gray-400 mb-1 block">Categoria</label>
                <select
                    value={form.categoria}
                    onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                    {categorias.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center justify-between">
                {subtotalPreview > 0 ? (
                    <span className="text-sm text-gray-500">
                        Subtotal:{" "}
                        <span className="font-medium text-gray-700">
                            {subtotalPreview.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </span>
                    </span>
                ) : (
                    <span />
                )}

                <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={15} />
                    Adicionar
                </button>
            </div>
        </form>
    );
}