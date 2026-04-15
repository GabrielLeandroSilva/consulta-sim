"use client";

import { useState } from "react";
import { useCompraStore } from "@/store/useCompraStore";
import { Header } from "@/components/Header";
import { ItemForm } from "@/components/ItemForm";
import { ItemList } from "@/components/ItemList";
import { TotalBar } from "@/components/TotalBar";
import { ShoppingCart } from "lucide-react";

export default function Home() {
  const {
    sessaoAtiva,
    iniciarSessao,
    adicionarItem,
    editarItem,
    removerItem,
    finalizarSessao,
    descartarSessao,
  } = useCompraStore();

  const [nomeSessao, setNomeSessao] = useState("");

  if (!sessaoAtiva) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart size={22} className="text-indigo-600" /> 
            <h1 className="text-lg font-semibold text-gray-800">ConsultaSim</h1>
          </div>

          <p className="text-sm text-gray-500 mb-4">
            Dê um nome para identificar esta compra:
          </p>

          <input
            type="text"
            placeholder="Ex: Compra de Abril"
            value={nomeSessao}
            onChange={(e) => setNomeSessao(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && nomeSessao.trim()) {
                iniciarSessao(nomeSessao.trim());
              }
            }}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
          />

          <button
            onClick={() => {
              if (nomeSessao.trim()) iniciarSessao(nomeSessao.trim());
            }}
            disabled={!nomeSessao.trim()}
            className="w-full py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Iniciar compra
          </button>

        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        nomeSessao={sessaoAtiva.nome}
        temItens={sessaoAtiva.itens.length > 0}
        onFinalizar={finalizarSessao}
        onDescartar={descartarSessao}
      />

      <main className="max-w-lg mx-auto px-4 pt-4 pb-28">
        <ItemForm onAdicionar={adicionarItem} />

        <div className="mt-4">
          <ItemList
            itens={sessaoAtiva.itens}
            onEditar={editarItem}
            onRemover={removerItem}
          />
        </div>
      </main>

      <TotalBar
        total={sessaoAtiva.total}
        quantidadeItens={sessaoAtiva.itens.length}
      />
    </div>
  )
}