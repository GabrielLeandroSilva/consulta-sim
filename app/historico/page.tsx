"use client"

import { useCompraStore } from "@/store/useCompraStore";
import { SessaoCard } from "@/components/SessaoCard";
import { agruparPorMes } from "@/lib/historico";
import { History } from "lucide-react";

export default function HistoricoPage() {
    const { historico, removerSessaoHistorico } = useCompraStore();

    const grupos = agruparPorMes(historico);

    if (historico.length === 0) {
        return (
            <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pb-20">
                <History size={40} className="text-gray-300 mb-3" />
                <p className="text-sm text-gray-400">Nenhuma compra finalizada ainda</p>
                <p className="text-xs text-gray-300 mt-1">
                    Finalize uma compra para ela aparecer aqui
                </p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
                <div className="max-w-lg mx-auto flex items-center gap-2">
                    <History size={20} className="text-indigo-600" />
                    <h1 className="font-medium text-gray-800">Histórico</h1>
                </div>
            </header>

            <div className="max-w-lg mx-auto px-4 pt-4">
                {grupos.map((grupo) => (
                    <section key={grupo.chave} className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-medium text-gray-500">
                                {grupo.label}
                            </h2>
                            <span className="text-sm font-semibold text-gray-700">
                                {grupo.totalMes.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            {grupo.sessoes.map((sessao) => (
                                <SessaoCard
                                    key={sessao.id}
                                    sessao={sessao}
                                    onRemover={removerSessaoHistorico}
                                />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    )
}