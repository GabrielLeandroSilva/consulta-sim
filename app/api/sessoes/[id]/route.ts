import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const sessao = await prisma.sessao.findUnique({
            where: { id },
            include: { itens: true },
        });

        if (!sessao) {
            return NextResponse.json(
                { error: "Sessão não encontrada" },
                { status: 404 }
            );
        }

        return NextResponse.json(sessao);
    } catch {
        return NextResponse.json(
            { error: "Erro ao buscar sessão" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: {params: Promise<{id: string}> } 
) {
    try {
        const { id } = await params;
        const dados = await request.json();

        const sessao = await prisma.sessao.update({
            where: { id },
            data: {
                ...(dados.nome && { nome: dados.nome }),
                ...(dados.total !== undefined && { total: dados.total }),
                ...(dados.finalizada !== undefined && { finalizada: dados.finalizada }),
                ...(dados.finalizadaEm !== undefined && {
                    finalizadaEm: dados.finalizadaEm ? new Date(dados.finalizadaEm) : null,
                }),
            },
            include: { itens: true },
        });

        return NextResponse.json(sessao);
    } catch {
        return NextResponse.json(
            { error: "Erro ao atualizar sessão" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.sessao.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json(
            { error: "Erro ao excluir sessão" },
            { status: 500 }
        );
    }
}