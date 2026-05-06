"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCompraStore } from "@/store/useCompraStore";
import { Header } from "@/components/Header";
import { ItemForm } from "@/components/ItemForm";
import { ItemList } from "@/components/ItemList";
import { TotalBar } from "@/components/TotalBar";
import { ShoppingCart, LogOut } from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const {
    sessaoAtiva,
    carregando,
    iniciarSessao,
    adicionarItem,
    editarItem,
    removerItem,
    finalizarSessao,
    descartarSessao,
    carregarHistorico,
  } = useCompraStore();

  const [nomeSessao, setNomeSessao] = useState("");

  useEffect(() => {
    carregarHistorico();
  }, []);

  if (carregando && !sessaoAtiva) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Carregando...</p>
      </main>
    );
  }

  if (!sessaoAtiva) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20">
        <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-indigo-600" />
              <h1 className="font-medium text-gray-800">ConsultaSim</h1>
            </div>

            <div className="flex items-center gap-3">
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "Usuário"}
                  className="w-8 h-8 rounded-full border border-gray-200"
                />
              )}
              <div className="hidden sm:block text-right">
                <p className="text-xs font-medium text-gray-700 leading-none">
                  {session?.user?.name}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50 hover:text-red-500 transition-colors"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center px-4 pt-16">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart size={22} className="text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Nova compra
              </h2>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Dê um nome para identificar esta compra:
            </p>

            <input
              type="text"
              placeholder="Ex: Compra de Maio"
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
              disabled={!nomeSessao.trim() || carregando}
              className="w-full py-2.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {carregando ? "Criando..." : "Iniciar compra"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        nomeSessao={sessaoAtiva.nome}
        temItens={sessaoAtiva.itens.length > 0}
        onFinalizar={finalizarSessao}
        onDescartar={descartarSessao}
      />

      <main className="max-w-lg mx-auto px-4 pt-4 pb-36">
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