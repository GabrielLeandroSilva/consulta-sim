"use client"

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

interface ModalConfirmacaoProps {
    titulo: string;
    descricao: string;
    labelConfirmar?: string;
    onConfirmar: () => void;
    onCancelar: () => void;
}

export function ModalConfirmacao({
    titulo,
    descricao,
    labelConfirmar = "Confirmar",
    onCancelar,
    onConfirmar,
}: ModalConfirmacaoProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    
    if (!mounted) return null;



    return createPortal(
        <div
            className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center px-4 pb-8"
            onClick={onCancelar}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-sm p-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={17} className="text-red-500" />
                    </div>
                    <h2 className="font-medium text-gray-800">{titulo}</h2>
                </div>

                <p className="text-sm text-gray-500 mb-5 pl-12">{descricao}</p>

                <div className="flex gap-2">
                    <button
                        onClick={onCancelar}
                        className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirmar}
                        className="flex-1 py-2.5 bg-red-500 text-white text-sm rounded-xl hover:bg-red-600 transition-colors"
                    >
                        {labelConfirmar}
                    </button>
                </div>

            </div>
        </div>,
        document.body
    );
}