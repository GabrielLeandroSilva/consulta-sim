import { MetricasHistorico } from "@/lib/historico";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricasCardsProps {
    metricas: MetricasHistorico;
}

function formatarBRL(valor: number) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function MetricasCards({ metricas }: MetricasCardsProps) {
    const { maiorGasto, menorGasto, mediamensal, totalAcumulado, variacaoUltimoMes } = metricas;

    const IconeVariacao =
        variacaoUltimoMes === null || variacaoUltimoMes === 0
            ? Minus
            : variacaoUltimoMes > 0
                ? TrendingUp
                : TrendingDown;

    const corVariacao =
        variacaoUltimoMes === null || variacaoUltimoMes === 0
            ? "text-gray-400"
            : variacaoUltimoMes > 0
                ? "text-red-500"
                : "text-green-600";

    return (
        <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-3.5">
                <p className="text-xs text-gray-400 mb-1">Total acumulado</p>
                <p className="text-lg font-semibold text-gray-800">
                    {formatarBRL(totalAcumulado)}
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-3.5">
                <p className="text-xs text-gray-400 mb-1">Média mensal</p>
                <p className="text-lg font-semibold text-gray-800">
                    {formatarBRL(mediamensal)}
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-3.5">
                <p className="text-xs text-gray-400 mb-1">Maior gasto</p>
                <p className="text-lg font-semibold text-gray-800">
                    {maiorGasto ? formatarBRL(maiorGasto.valor) : "-"}
                </p>
                {maiorGasto && (
                    <p className="text-xs text-gray-400 mt-0.5">{maiorGasto.label}</p>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-3.5">
                <p className="text-xs text-gray-400 mb-1">Menor Gasto</p>
                <p className="text-lg font-semibold text-gray-800">
                    {menorGasto ? formatarBRL(menorGasto.valor) : "-"}
                </p>
                {menorGasto && (
                    <p className="text-xs text-gray-400 mt-0.5">{menorGasto.label}</p>
                )}
            </div>

            {variacaoUltimoMes !== null && (
                <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-3.5 flex items-center justify-between">
                    <p className="text-xs text-gray-400">Variação vs mês anterior</p>
                    <div className={`flex items-center gap-1 font-semibold text-sm ${corVariacao}`}>
                        <IconeVariacao size={15} />
                        {variacaoUltimoMes > 0 ? "+" : ""}
                        {variacaoUltimoMes.toFixed(1)}%
                    </div>
                </div>
            )}
        </div>
    )
}