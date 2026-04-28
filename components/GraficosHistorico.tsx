"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
  } from "recharts";
import { DadoGraficoBarras, DadoGraficoPizza, DadoGraficoLinha } from "@/lib/historico";

const CORES_PIZZA = [
    "#4f46e5",
    "#0891b2",
    "#059669",
    "#d97706",
    "#db2777",
    "#7c3aed",
    "#6b7280",
];

function formatarBRL(valor: number) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

interface GraficosHistoricoProps {
    dadosLinha: DadoGraficoLinha[];
    dadosPizza: DadoGraficoPizza[];
    dadosBarras: DadoGraficoBarras[];
}

export function GraficosHistorico({
    dadosLinha,
    dadosPizza,
    dadosBarras
}: GraficosHistoricoProps) {
    return (
        <div className="flex flex-col gap-4">
            {dadosLinha.length >= 2 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-4">
                        Evolução do gasto mensal
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={dadosLinha}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="mes"
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(v) => `R$${v}`}
                                width={48}
                            />
                            <Tooltip
                                formatter={(value: unknown) => [formatarBRL(Number(value)), "Total"]}
                                contentStyle={{
                                    fontSize: 12,
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb"
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#4f46e5"
                                strokeWidth={2}
                                dot={{ r: 4, fill: "#4f46e5" }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {dadosPizza.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-4">
                        Gasto por Categoria
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={dadosPizza}
                                dataKey="valor"
                                nameKey="categoria"
                                cx="50%"
                                cy="50%"
                                outerRadius={70}
                                innerRadius={35}
                                paddingAngle={2}
                            >
                                {dadosPizza.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={CORES_PIZZA[index % CORES_PIZZA.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: unknown) => [formatarBRL(Number(value)), "Total"]}
                                contentStyle={{
                                    fontSize: 12,
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                }}
                            />
                            <Legend
                                formatter={(value) => (
                                    <span style={{ fontSize: 12, color: "#6b7280" }}>{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}

            {dadosBarras.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-600 mb-4">
                        Itens mais comprados
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={dadosBarras} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                            <XAxis
                                type="number"
                                tick={{ fontSize: 11, fill: "#9ca3af" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                type="category"
                                dataKey="nome"
                                tick={{ fontSize: 11, fill: "#6b7280" }}
                                axisLine={false}
                                tickLine={false}
                                width={80}
                            />
                            <Tooltip
                                formatter={(value: unknown, name: unknown) => [
                                    name === "quantidade" ? `${Number(value)}×` : formatarBRL(Number(value)),
                                    name === "quantidade" ? "Qtd comprada" : "Total gasto",
                                  ]}
                                contentStyle={{
                                    fontSize: 12,
                                    borderRadius: 8,
                                    border: "1px solid #e5e7eb",
                                }}
                            />
                            <Bar dataKey="quantidade" fill="#4f46e5" radius={[0,4,4,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

        </div>
    )
}