import { Loader2 } from "lucide-react";
import { useCompraStore } from "@/store/useCompraStore";

interface TotalBarProps {
    total: number;
    quantidadeItens: number;
}

export function TotalBar({ total, quantidadeItens }: TotalBarProps) {
    const { sincronizando } = useCompraStore();
  
    return (
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-10">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {quantidadeItens} {quantidadeItens === 1 ? "item" : "itens"}
            </span>
            {sincronizando && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Loader2 size={11} className="animate-spin" />
                <span>Salvando...</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 leading-none mb-0.5">Total</p>
            <p className="text-2xl font-semibold text-indigo-600">
              {total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>
        </div>
      </div>
    );
  }