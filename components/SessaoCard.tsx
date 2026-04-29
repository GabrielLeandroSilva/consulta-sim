"use client"

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2, Calendar } from "lucide-react";
import { Sessao } from "@/types";
import { formatarData } from "@/lib/historico";
import { ModalConfirmacao } from "./ModalConfirmacao";

interface SessaoCardProps {
    sessao: Sessao;
    onRemover: (id: string) => void;
}

const coresCategorias: Record<string, string> = {
    mercearia: "bg-amber-100 text-amber-700",
    hortifruti: "bg-green-100 text-green-700",
    frios: "bg-blue-100 text-blue-700",
    limpeza: "bg-purple-100 text-purple-700",
    bebidas: "bg-cyan-100 text-cyan-700",
    higiene: "bg-pink-100 text-pink-700",
    outros: "bg-gray-100 text-gray-600",
}

export function SessaoCard({ sessao, onRemover }: SessaoCardProps) {
    const [expandido, setExpandido] = useState(false);
    const [modalExcluir, setModalExcluir] = useState(false);

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-800 truncate">{sessao.nome}</h3>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                <Calendar size={11} />
                                <span>{formatarData(sessao.finalizadaEm ?? sessao.criadaEm)}</span>
                                <span className="mx-1">·</span>
                                <span>{sessao.itens.length} itens</span>
                            </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                            <p className="font-semibold text-gray-800">
                                {sessao.total.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <button
                            onClick={() => setModalExcluir(true)}
                            className="flex cursor-pointer items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={13} />
                            Excluir
                        </button>

                        <button
                            onClick={() => setExpandido(!expandido)}
                            className="flex cursor-pointer items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            {expandido ? (
                                <>
                                    <ChevronUp size={13} />
                                    Ocultar itens
                                </>
                            ) : (
                                <>
                                    <ChevronDown size={13} />
                                    Ver itens
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {expandido && (
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                        <div className="flex flex-col gap-2">
                            {sessao.itens.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${coresCategorias[item.categoria]}`}
                                        >
                                            {item.categoria}
                                        </span>
                                        <span className="text-gray-700 truncate">{item.nome}</span>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <span className="text-gray-500 text-xs">
                                            {item.quantidade}×{" "}
                                            {item.precoUnitario.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </span>
                                        <span className="ml-2 font-medium text-gray-700">
                                            {item.subtotal.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {modalExcluir && (
                <ModalConfirmacao
                    titulo="Excluir compra?"
                    descricao={`"${sessao.nome}" será removida do histórico permanentemente.`}
                    labelConfirmar="Excluir"
                    onConfirmar={() => {
                        onRemover(sessao.id);
                        setModalExcluir(false);
                    }}
                    onCancelar={() => setModalExcluir(false)}
                />
            )}
        
        </>
    );
}