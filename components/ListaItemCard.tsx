"use client";

import { useState } from "react";
import { Pencil, Trash2, Check, X, ShoppingCart } from "lucide-react";
import { Categoria, ListaItem } from "@/types";
import { ModalConfirmacao } from "./ModalConfirmacao";
import { ModalPrecoImportacao } from "./ModalPrecoImportacao";

interface ListaItemCardProps {
  item: ListaItem;
  temSessaoAtiva: boolean;
  onEditar: (id: string, dados: Partial<{ nome: string; quantidade: number; categoria: Categoria }>) => void;
  onRemover: (id: string) => void;
  onTogglePego: (id: string) => void;
  onImportar: (item: ListaItem, precoUnitario: number) => Promise<void>;
}

const coresCategorias: Record<Categoria, string> = {
  mercearia: "bg-amber-100 text-amber-700",
  hortifruti: "bg-green-100 text-green-700",
  frios: "bg-blue-100 text-blue-700",
  limpeza: "bg-purple-100 text-purple-700",
  bebidas: "bg-cyan-100 text-cyan-700",
  higiene: "bg-pink-100 text-pink-700",
  outros: "bg-gray-100 text-gray-600",
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

export function ListaItemCard({
  item,
  temSessaoAtiva,
  onEditar,
  onRemover,
  onTogglePego,
  onImportar,
}: ListaItemCardProps) {
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(item.nome);
  const [quantidade, setQuantidade] = useState(String(item.quantidade));
  const [categoria, setCategoria] = useState<Categoria>(item.categoria);
  const [modalExcluir, setModalExcluir] = useState(false);
  const [modalImportar, setModalImportar] = useState(false);

  function salvarEdicao() {
    if (!nome.trim()) return;
    onEditar(item.id, {
      nome: nome.trim(),
      quantidade: Number(quantidade),
      categoria,
    });
    setEditando(false);
  }

  function cancelarEdicao() {
    setNome(item.nome);
    setQuantidade(String(item.quantidade));
    setCategoria(item.categoria);
    setEditando(false);
  }

  return (
    <>
      <div className={`bg-white border rounded-xl p-3.5 transition-all ${
        item.pego ? "border-green-200 opacity-60" : "border-gray-200"
      }`}>
        <div className="flex items-start gap-3">

          {/* Checkbox de pego */}
          <button
            onClick={() => onTogglePego(item.id)}
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
              item.pego
                ? "bg-green-500 border-green-500"
                : "border-gray-300 hover:border-green-400"
            }`}
          >
            {item.pego && <Check size={11} className="text-white" />}
          </button>

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
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={cancelarEdicao}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <X size={12} />
                    Cancelar
                  </button>
                  <button
                    onClick={salvarEdicao}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    <Check size={12} />
                    Salvar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className={`font-medium text-gray-800 truncate ${
                    item.pego ? "line-through text-gray-400" : ""
                  }`}>
                    {item.nome}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{item.quantidade}×</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${coresCategorias[item.categoria]}`}>
                      {labelsCategorias[item.categoria]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {temSessaoAtiva && !item.pego && (
                    <button
                      onClick={() => setModalImportar(true)}
                      className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Importar para compra"
                    >
                      <ShoppingCart size={15} />
                    </button>
                  )}
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {modalExcluir && (
        <ModalConfirmacao
          titulo="Excluir item?"
          descricao={`"${item.nome}" será removido da lista.`}
          labelConfirmar="Excluir"
          onConfirmar={() => {
            onRemover(item.id);
            setModalExcluir(false);
          }}
          onCancelar={() => setModalExcluir(false)}
        />
      )}

      {modalImportar && (
        <ModalPrecoImportacao
          nomeItem={item.nome}
          quantidade={item.quantidade}
          onImportar={async (preco) => {
            await onImportar(item, preco);
            setModalImportar(false);
          }}
          onCancelar={() => setModalImportar(false)}
        />
      )}
    </>
  );
}