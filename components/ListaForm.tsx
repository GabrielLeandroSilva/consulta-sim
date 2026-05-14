"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Categoria } from "@/types";

interface ListaFormProps {
  onAdicionar: (item: {
    nome: string;
    quantidade: number;
    categoria: Categoria;
  }) => Promise<void>;
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
  categoria: "mercearia" as Categoria,
};

export function ListaForm({ onAdicionar }: ListaFormProps) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [salvando, setSalvando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) return;

    setSalvando(true);
    try {
      await onAdicionar({
        nome: form.nome.trim(),
        quantidade: Number(form.quantidade),
        categoria: form.categoria,
      });
      setForm(FORM_INICIAL);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Nome do item"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          disabled={salvando}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Quantidade</label>
          <input
            type="number"
            min="1"
            value={form.quantidade}
            onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
            disabled={salvando}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Categoria</label>
          <select
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value as Categoria })}
            disabled={salvando}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:opacity-50"
          >
            {categorias.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={salvando || !form.nome.trim()}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {salvando ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Plus size={15} />
            Adicionar à lista
          </>
        )}
      </button>
    </form>
  );
}