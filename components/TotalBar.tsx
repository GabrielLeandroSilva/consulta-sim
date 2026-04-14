interface TotalBarProps {
    total: number;
    quantidadeItens: number;
}

export function TotalBar({ total, quantidadeItens }: TotalBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-10">
            <div className="max-w-lg mx-auto flex items-center justify-between">
                <span className="text-sm text-gray-500">
                    {quantidadeItens} {quantidadeItens === 1 ? "item" : "itens"}
                </span>
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
    )
}