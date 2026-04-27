import { Sessao } from "@/types";

export interface GrupoMes {
    chave: string;
    label: string;
    sessoes: Sessao[];
    totalMes: number;
}

export function agruparPorMes(sessoes: Sessao[]): GrupoMes[] {
    const mapa = new Map<string, Sessao[]>();

    for (const sessao of sessoes) {
        const data = new Date(sessao.finalizadaEm ?? sessao.criadaEm);
        const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`;

        if (!mapa.has(chave)) mapa.set(chave, []);
        mapa.get(chave)!.push(sessao)
    }

    return Array.from(mapa.entries())
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([chave, sessoes]) => {
            const data = new Date(`${chave}-01T12:00:00`);
            const label = data.toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
            });
            return {
                chave,
                label: label.charAt(0).toUpperCase() + label.slice(1),
                sessoes,
                totalMes: sessoes.reduce((acc, s) => acc + s.total, 0)
            };
        });
}

export function formatarData(iso: string): string {
    return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export interface MetricasHistorico {
    maiorGasto: { valor: number; label: string } | null;
    menorGasto: { valor: number; label: string } | null;
    mediamensal: number;
    totalAcumulado: number;
    variacaoUltimoMes: number | null;
}

export function calcularMetricas(grupos: GrupoMes[]): MetricasHistorico {
    if (grupos.length === 0) {
        return {
            maiorGasto: null,
            menorGasto: null,
            mediamensal: 0,
            totalAcumulado: 0,
            variacaoUltimoMes: null,
        };
    }

    const totais = grupos.map((g) => ({ valor: g.totalMes, label: g.label }));
    const totalAcumulado = totais.reduce((acc, g) => acc + g.valor, 0);
    const mediamensal = totalAcumulado / totais.length;

    const maiorGasto = totais.reduce((a, b) => (a.valor >= b.valor ? a : b));
    const menorGasto = totais.reduce((a, b) => (a.valor <= b.valor ? a : b));

    let variacaoUltimoMes: number | null = null;
    if (grupos.length >= 2) {
        const atual = grupos[0].totalMes;
        const anterior = grupos[1].totalMes;
        variacaoUltimoMes = ((atual - anterior) / anterior) * 100;
    }

    return { maiorGasto, menorGasto, mediamensal, totalAcumulado, variacaoUltimoMes };
}

export interface DadoGraficoLinha {
    mes: string;
    total: number;
}

export function dadosGraficoLinha(grupos: GrupoMes[]): DadoGraficoLinha[] {
    return [...grupos].reverse().map((g) => ({
        mes: g.label.split(" ")[0],
        total: g.totalMes,
    }))
}

export interface DadoGraficoPizza {
    categoria: string;
    valor: number;
}

export function dadosGraficoPizza(sessoes: import("@/types").Sessao[]): DadoGraficoPizza[] {
    const mapa = new Map<string, number>();

    for (const sessao of sessoes) {
        for (const item of sessao.itens) {
            const atual = mapa.get(item.categoria) ?? 0;
            mapa.set(item.categoria, atual + item.subtotal);
        }
    }

    return Array.from(mapa.entries())
        .map(([categoria, valor]) => ({ categoria, valor }))
        .sort((a, b) => b.valor - a.valor);
}

export interface DadoGraficoBarras {
    nome: string;
    quantidade: number;
    total: number;
}

export function itensMaisComprados(
    sessoes: import("@/types").Sessao[],
    limite = 5
): DadoGraficoBarras[] {
    const mapa = new Map<string, { quantidade: number, total: number }>();

    for (const sessao of sessoes) {
        for (const item of sessao.itens) {
            const chave = item.nome.toLocaleLowerCase().trim();
            const atual = mapa.get(chave) ?? { quantidade: 0, total: 0 };
            mapa.set(chave, {
                quantidade: atual.quantidade + item.quantidade,
                total: atual.total + item.subtotal,
            });
        }
    }

    return Array.from(mapa.entries())
        .map(([nome, dados]) => ({ nome, ...dados }))
        .sort((a, b) => b.quantidade - a.quantidade)
        .slice(0, limite);
}