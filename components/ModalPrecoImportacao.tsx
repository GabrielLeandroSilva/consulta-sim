"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart, Loader2 } from "lucide-react";

interface ModalPrecoImportacaoProps {
  nomeItem: string;
  quantidade: number;
  onImportar: (precoUnitario: number) => Promise<void>;
  onCancelar: () => void;
}

export function ModalPrecoImportacao({
  nomeItem,
  quantidade,
  onImportar,
  onCancelar,
}: ModalPrecoImportacaoProps) {
  const [preco, setPreco] = useState("");
  const [salvando, setSalvando] = useState(false);

  const subtotalPreview = Number(preco) * quantidade || 0;

  async function handleImportar() {
    if (!preco || Number(preco) <= 0) return;
    setSalvando(true);
    try {
      await onImportar(Number(preco));
    } finally {
      setSalvando(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center px-4 pb-8"
      onClick={onCancelar}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <ShoppingCart size={17} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="font-medium text-gray-800">Importar item</h2>
            <p className="text-xs text-gray-400 mt-0.5">Informe o preço na prateleira</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-4">
          <p className="text-sm font-medium text-gray-800">{nomeItem}</p>
          <p className="text-xs text-gray-400 mt-0.5">Quantidade: {quantidade}×</p>
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-1.5 block">
            Preço unitário (R$)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            autoFocus
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {subtotalPreview > 0 && (
          <div className="flex items-center justify-between bg-indigo-50 rounded-xl px-3 py-2.5 mb-4">
            <span className="text-xs text-indigo-600">Subtotal</span>
            <span className="text-sm font-semibold text-indigo-600">
              {subtotalPreview.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onCancelar}
            disabled={salvando}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleImportar}
            disabled={!preco || Number(preco) <= 0 || salvando}
            className="flex-1 py-2.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {salvando ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Importando...
              </>
            ) : (
              "Importar"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}