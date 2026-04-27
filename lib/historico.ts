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