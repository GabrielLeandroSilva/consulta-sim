"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { FileText, Calendar, DollarSign, Loader2 } from "lucide-react";
import { DadosNFCe, formatarChave } from "@/lib/nfce";

interface ModalConfirmacaoNotaProps {
  dados: DadosNFCe;
  onConfirmar: (nome: string) => Promise<void>;
  onCancelar: () => void;
}

export function ModalConfirmacaoNota({
  dados,
  onConfirmar,
  onCancelar,
}: ModalConfirmacaoNotaProps) {
  const dataFormatada = dados.dataEmissao.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const nomeSugerido = `Compra ${dados.dataEmissao.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  })}${dados.estado ? ` - ${dados.estado}` : ""}`;

  const [nome, setNome] = useState(nomeSugerido);
  const [salvando, setSalvando] = useState(false);

  async function handleConfirmar() {
    if (!nome.trim()) return;
    setSalvando(true);
    try {
      await onConfirmar(nome.trim());
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
          <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
            <FileText size={17} className="text-green-600" />
          </div>
          <div>
            <h2 className="font-medium text-gray-800">Nota fiscal lida!</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Confirme os dados antes de salvar
            </p>
          </div>
        </div>

        {/* Resumo da nota */}
        <div className="bg-gray-50 rounded-xl p-3.5 mb-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <Calendar size={15} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Data da compra</p>
              <p className="text-sm font-medium text-gray-800">{dataFormatada}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <DollarSign size={15} className="text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Valor total</p>
              <p className="text-sm font-semibold text-gray-800">
                {dados.valorTotal > 0
                  ? dados.valorTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })
                  : "Não identificado"}
              </p>
            </div>
          </div>

          {dados.estado && (
            <div className="flex items-center gap-2.5">
              <FileText size={15} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Estado</p>
                <p className="text-sm font-medium text-gray-800">{dados.estado}</p>
              </div>
            </div>
          )}

          <div className="pt-1 border-t border-gray-200">
            <p className="text-xs text-gray-400 mb-0.5">Chave da nota</p>
            <p className="text-xs font-mono text-gray-500 break-all leading-relaxed">
              {formatarChave(dados.chave)}
            </p>
          </div>
        </div>

        {/* Nome editável */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-1.5 block">
            Nome da compra
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancelar}
            disabled={salvando}
            className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={!nome.trim() || salvando}
            className="flex-1 py-2.5 bg-indigo-600 text-white text-sm rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-1.5"
          >
            {salvando ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar compra"
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}