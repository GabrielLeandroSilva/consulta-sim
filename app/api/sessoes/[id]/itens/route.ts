import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: sessaoId } = await params;
        const { nome, quantidade, precoUnitario, categoria } = await request.json();

        if (!nome?.trim() || !quantidade || !precoUnitario || !categoria) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios" },
                { status: 400 }
            );
        }

        const subtotal = quantidade * precoUnitario;

        const item = await prisma.item.create({
            data: {
                nome: nome.trim(),
                quantidade,
                precoUnitario,
                subtotal,
                categoria,
                sessaoId,
            },
        });

        const itens = await prisma.item.findMany({ where: { sessaoId } });
        const novoTotal = itens.reduce((acc: number, i: { subtotal: number; }) => acc + i.subtotal, 0);
        await prisma.sessao.update({
            where: { id: sessaoId },
            data: { total: novoTotal },
        });

        return NextResponse.json(item, { status: 201 });

    } catch {
        return NextResponse.json(
            { error: "Erro ao adicionar item" },
            { status: 500 }
        );
    }
}