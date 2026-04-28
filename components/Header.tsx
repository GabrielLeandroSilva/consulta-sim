"use client"

import { ShoppingCart, CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { ModalConfirmacao } from "./ModalConfirmacao";

interface HeaderProps {
    nomeSessao: string;
    onFinalizar: () => void;
    onDescartar: () => void;
    temItens: boolean;
}

export function Header({
    nomeSessao,
    onFinalizar,
    onDescartar,
    temItens,
}: HeaderProps) {
    const [modalDescartar, setModalDescartar] = useState(false);
    const [modalFinalizar, setModalFinalizar] = useState(false);

    return (
        <>
            <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
                <div className="max-w-lg mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShoppingCart size={20} className="text-indigo-600" />
                        <h1 className="font-medium text-gray-800 truncate max-w-[180px]">
                            {nomeSessao}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setModalDescartar(true)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Descartar compra"
                        >
                            <Trash2 size={18} />
                        </button>
                        <button
                            onClick={() => setModalFinalizar(true)}
                            disabled={!temItens}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors"
                        >
                            <CheckCircle size={15} />
                            Finalizar
                        </button>
                    </div>
                </div>
            </header>

            {modalDescartar && (
                <ModalConfirmacao
                    titulo="Descartar compra?"
                    descricao="Todos os itens adicionados serão perdidos. Essa ação não pode ser desfeita."
                    labelConfirmar="Descartar"
                    onConfirmar={() => {
                        onDescartar();
                        setModalDescartar(false);
                    }}
                    onCancelar={() => setModalDescartar(false)}
                />
            )}

            {modalFinalizar && (
                <ModalConfirmacao
                    titulo="Finalizar compra?"
                    descricao="A comnpra será salva no histórico e você não poderá mais editar os itens."
                    labelConfirmar="Finalizar"
                    onConfirmar={() => {
                        onFinalizar();
                        setModalFinalizar(false);
                    }}
                    onCancelar={() => setModalFinalizar(false)}
                />
            )}
        </>
    );
}