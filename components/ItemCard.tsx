"use client"

import { useState } from "react";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Categoria, Item } from "@/types";
import { ModalConfirmacao } from "./ModalConfirmacao";

interface ItemCardProps {
    item: Item;
    onEditar: (id: string, dados: {
        nome: string;
        quantidade: number;
        precoUnitario: number;
        categoria: string;
    }) => void;
    onRemover: (id: string) => void;
}

const coresCategorias: Record<Categoria, string> = {
    mercearia: "bg-amber-100 text-amber-700",
    hortifruti: "bg-green-100 text-green-700",
    frios: "bg-blue-100 text-blue-700",
    limpeza: "bg-purple-100 text-purple-700",
    bebidas: "bg-cyan-100 text-cyan-700",
    higiene: "bg-pink-100 text-pink-700",
    outros: "bg-gray-100 text-gray-600"
};

const labelsCategorias: Record<Categoria, string> = {
    mercearia: "Mercearia",
    hortifruti: "Hortifruti",
    frios: "Frios",
    limpeza: "Limpeza",
    bebidas: "Bebidas",
    higiene: "Higiene",
    outros: "Outros",
};

const categorias: { value: Categoria; label: string }[] = [
    { value: "mercearia", label: "Mercearia" },
    { value: "hortifruti", label: "Hortifruti" },
    { value: "frios", label: "Frios" },
    { value: "limpeza", label: "Limpeza" },
    { value: "bebidas", label: "Bebidas" },
    { value: "higiene", label: "Higiene" },
    { value: "outros", label: "Outros" },
];

export function ItemCard({ item, onEditar, onRemover }: ItemCardProps) {
    const [editando, setEditando] = useState(false);
    const [nome, setNome] = useState(item.nome);
    const [quantidade, setQuantidade] = useState(String(item.quantidade));
    const [preco, setPreco] = useState(String(item.precoUnitario));
    const [categoria, setCategoria] = useState(item.categoria);
    const [modalExcluir, setModalExcluir] = useState(false);

    function salvarEdicao() {
        if (!nome.trim()) return;
        onEditar(item.id, {
            nome: nome.trim(),
            quantidade: Number(quantidade),
            precoUnitario: Number(preco),
            categoria,
        });
        setEditando(false);
    }

    function cancelarEdicao() {
        setNome(item.nome);
        setQuantidade(String(item.quantidade));
        setPreco(String(item.precoUnitario));
        setCategoria(item.categoria);
        setEditando(false);
    }

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-xl p-3.5">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">

                        {editando ? (
                            <div className="flex flex-col gap-2">
                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Nome</label>
                                    <input
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-gray-400 mb-1 block">Categoria</label>
                                    <select
                                        value={categoria}
                                        onChange={(e) => setCategoria(e.target.value as Categoria)}
                                        className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                    >
                                        {categorias.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">Qtd</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={quantidade}
                                            onChange={(e) => setQuantidade(e.target.value)}
                                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 mb-1 block">Preço</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={preco}
                                            onChange={(e) => setPreco(e.target.value)}
                                            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-800 truncate">
                                        {item.nome}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${coresCategorias[item.categoria]}`}
                                    >
                                        {labelsCategorias[item.categoria]}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                    {item.quantidade}×{" "}
                                    {item.precoUnitario.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex-shrink-0 text-right">
                        {!editando && (
                            <p className="font-semibold text-gray-800">
                                {item.subtotal.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </p>
                        )}

                        <div className="flex items-center gap-3 mt-1 justify-end">
                            {editando ? (
                                <>
                                    <button
                                        onClick={salvarEdicao}
                                        className="p-1 text-green-600 hover:text-green-700"
                                    >
                                        <Check size={15} />
                                    </button>
                                    <button
                                        onClick={cancelarEdicao}
                                        className="p-1 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={15} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setEditando(true)}
                                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        onClick={() => setModalExcluir(true)}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {modalExcluir && (
                <ModalConfirmacao
                    titulo="Excluir item?"
                    descricao={`"${item.nome}" será removido da compra.`}
                    labelConfirmar="Excluir"
                    onConfirmar={() => {
                        onRemover(item.id);
                        setModalExcluir(false);
                    }}
                    onCancelar={() => setModalExcluir(false)}
                />
            )}

        </>
    );
}