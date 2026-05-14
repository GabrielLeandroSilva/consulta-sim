"use client";

import { useEffect, useState } from "react";
import { useListaStore } from "@/store/useListaStore";
import { useCompraStore } from "@/store/useCompraStore";
import { ListaForm } from "@/components/ListaForm";
import { ListaItemCard } from "@/components/ListaItemCard";
import { ModalConfirmacao } from "@/components/ModalConfirmacao";
import { ListChecks, RotateCcw, Loader2 } from "lucide-react";
import { Categoria, ListaItem } from "@/types";

export default function ListaPage() {
    const {
        itens,
        carregando,
        sincronizando,
        carregarLista,
        adicionarItem,
        editarItem,
        removerItem,
        togglePego,
        resetarPegos,
    } = useListaStore();

    const { sessaoAtiva, adicionarItem: adicionarNaCompra } = useCompraStore();

    const [modalResetar, setModalResetar] = useState(false);

    useEffect(() => {
        carregarLista();
    }, []);

    async function handleImportar(item: ListaItem, precoUnitario: number) {
        await adicionarNaCompra({
            nome: item.nome,
            quantidade: item.quantidade,
            precoUnitario,
            categoria: item.categoria as Categoria,
        });
        await togglePego(item.id);
    }

    const itensPegos = itens.filter((i) => i.pego).length;
    const itensPendentes = itens.filter((i) => !i.pego).length;

    return (
        <main className="min-h-screen bg-gray-50 pb-24">
            <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
                <div className="max-w-lg mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ListChecks size={20} className="text-indigo-600" />
                        <h1 className="font-medium text-gray-800">Lista de compras</h1>
                        {sincronizando && (
                            <Loader2 size={13} className="animate-spin text-gray-400" />
                        )}
                    </div>

                    {itensPegos > 0 && (
                        <button
                            onClick={() => setModalResetar(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <RotateCcw size={14} />
                            Resetar
                        </button>
                    )}
                </div>

                {/* Progresso */}
                {itens.length > 0 && (
                    <div className="max-w-lg mx-auto mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                            <span>{itensPegos} de {itens.length} itens pegos</span>
                            <span>{Math.round((itensPegos / itens.length) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full transition-all duration-300"
                                style={{ width: `${(itensPegos / itens.length) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Aviso de sessão ativa */}
                {sessaoAtiva && (
                    <div className="max-w-lg mx-auto mt-3 px-3 py-2 bg-indigo-50 rounded-lg flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                        <p className="text-xs text-indigo-600">
                            Compra ativa: <span className="font-medium">{sessaoAtiva.nome}</span> — clique em 🛒 para importar um item
                        </p>
                    </div>
                )}
            </header>

            <div className="max-w-lg mx-auto px-4 pt-4">
                <ListaForm onAdicionar={adicionarItem} />

                <div className="mt-4">
                    {carregando ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 size={24} className="animate-spin text-gray-300" />
                        </div>
                    ) : itens.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                            <ListChecks size={40} className="mb-3 opacity-40" />
                            <p className="text-sm">Nenhum item na lista ainda</p>
                            <p className="text-xs mt-1">Adicione itens para sua próxima compra</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {itensPendentes > 0 && (
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                                        Pendentes ({itensPendentes})
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {itens
                                            .filter((i) => !i.pego)
                                            .map((item) => (
                                                <ListaItemCard
                                                    key={item.id}
                                                    item={item}
                                                    temSessaoAtiva={!!sessaoAtiva}
                                                    onEditar={(id, dados) =>
                                                        editarItem(id, dados as Partial<{
                                                            nome: string;
                                                            quantidade: number;
                                                            categoria: Categoria;
                                                            pego: boolean;
                                                        }>)
                                                    }
                                                    onRemover={removerItem}
                                                    onTogglePego={togglePego}
                                                    onImportar={handleImportar}
                                                />
                                            ))}
                                    </div>
                                </div>
                            )}

                            {itensPegos > 0 && (
                                <div className="mt-2">
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                                        Pegos ({itensPegos})
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        {itens
                                            .filter((i) => i.pego)
                                            .map((item) => (
                                                <ListaItemCard
                                                    key={item.id}
                                                    item={item}
                                                    temSessaoAtiva={!!sessaoAtiva}
                                                    onEditar={(id, dados) =>
                                                        editarItem(id, dados as Partial<{
                                                            nome: string;
                                                            quantidade: number;
                                                            categoria: Categoria;
                                                            pego: boolean;
                                                        }>)
                                                    }
                                                    onRemover={removerItem}
                                                    onTogglePego={togglePego}
                                                    onImportar={handleImportar}
                                                />
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {modalResetar && (
                <ModalConfirmacao
                    titulo="Resetar lista?"
                    descricao="Todos os itens marcados como pegos voltarão para pendentes."
                    labelConfirmar="Resetar"
                    onConfirmar={() => {
                        resetarPegos();
                        setModalResetar(false);
                    }}
                    onCancelar={() => setModalResetar(false)}
                />
            )}
        </main>
    );
}