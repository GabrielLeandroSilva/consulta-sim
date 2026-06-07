"use client";

import { useEffect, useState } from "react";
import { useCompraStore } from "@/store/useCompraStore";
import { SessaoCard } from "@/components/SessaoCard";
import { MetricasCards } from "@/components/MetricasCards";
import { GraficosHistorico } from "@/components/GraficosHistorico";
import { LeitorQRCode } from "@/components/LeitorQRCode";
import { ModalConfirmacaoNota } from "@/components/ModalConfirmacaoNota";
import {
  agruparPorMes,
  calcularMetricas,
  dadosGraficoLinha,
  dadosGraficoPizza,
  itensMaisComprados,
} from "@/lib/historico";
import { parsearUrlNFCe, DadosNFCe } from "@/lib/nfce";
import { History, BarChart2, List, QrCode } from "lucide-react";

type Aba = "resumo" | "lista" | "nota";

export default function HistoricoPage() {
  const { historico, carregando, removerSessaoHistorico, carregarHistorico } =
    useCompraStore();
  const [aba, setAba] = useState<Aba>("resumo");
  const [leitorAberto, setLeitorAberto] = useState(false);
  const [dadosNota, setDadosNota] = useState<DadosNFCe | null>(null);
  const [erroLeitura, setErroLeitura] = useState<string | null>(null);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const grupos = agruparPorMes(historico);
  const metricas = calcularMetricas(grupos);
  const dadosLinha = dadosGraficoLinha(grupos);
  const dadosPizza = dadosGraficoPizza(historico);
  const dadosBarras = itensMaisComprados(historico);

  function handleLeitura(url: string) {
    setLeitorAberto(false);
    const dados = parsearUrlNFCe(url);

    if (!dados) {
      setErroLeitura(
        "QR Code não reconhecido como nota fiscal. Tente novamente."
      );
      return;
    }

    setDadosNota(dados);
  }

  async function handleSalvarNota(nome: string, valorTotal: number) {
    if (!dadosNota) return;
  
    const res = await fetch("/api/nota-fiscal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        valorTotal,
        dataEmissao: dadosNota.dataEmissao.toISOString(),
      }),
    });
  
    if (res.ok) {
      setDadosNota(null);
      await carregarHistorico();
      setAba("lista");
    }
  }

  if (carregando) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <p className="text-sm text-gray-400">Carregando...</p>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 pb-24">
        <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={20} className="text-indigo-600" />
              <h1 className="font-medium text-gray-800">Histórico</h1>
            </div>

            <button
              onClick={() => {
                setErroLeitura(null);
                setLeitorAberto(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-600 text-indigo-600 text-sm rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <QrCode size={15} />
              Ler nota
            </button>
          </div>

          {/* Abas */}
          <div className="max-w-lg mx-auto flex gap-1 mt-3">
            <button
              onClick={() => setAba("resumo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                aba === "resumo"
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <BarChart2 size={14} />
              Resumo
            </button>
            <button
              onClick={() => setAba("lista")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                aba === "lista"
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List size={14} />
              Compras
            </button>
          </div>

          {/* Erro de leitura */}
          {erroLeitura && (
            <div className="max-w-lg mx-auto mt-3 px-3 py-2 bg-red-50 rounded-lg">
              <p className="text-xs text-red-500">{erroLeitura}</p>
            </div>
          )}
        </header>

        <div className="max-w-lg mx-auto px-4 pt-4">
          {historico.length === 0 && aba !== "nota" ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <History size={40} className="mb-3 opacity-40" />
              <p className="text-sm">Nenhuma compra finalizada ainda</p>
              <p className="text-xs mt-1">
                Finalize uma compra ou leia uma nota fiscal
              </p>
            </div>
          ) : (
            <>
              {aba === "resumo" && (
                <div className="flex flex-col gap-4">
                  <MetricasCards metricas={metricas} />
                  <GraficosHistorico
                    dadosLinha={dadosLinha}
                    dadosPizza={dadosPizza}
                    dadosBarras={dadosBarras}
                  />
                </div>
              )}

              {aba === "lista" && (
                <div>
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
              )}
            </>
          )}
        </div>
      </main>

      {/* Leitor de QR Code */}
      {leitorAberto && (
        <LeitorQRCode
          onLeitura={handleLeitura}
          onFechar={() => setLeitorAberto(false)}
        />
      )}

      {/* Modal de confirmação da nota */}
      {dadosNota && (
        <ModalConfirmacaoNota
          dados={dadosNota}
          onConfirmar={handleSalvarNota}
          onCancelar={() => setDadosNota(null)}
        />
      )}
    </>
  );
}