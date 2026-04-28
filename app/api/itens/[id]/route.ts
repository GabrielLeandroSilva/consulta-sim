import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { quantidade, precoUnitario } = await request.json();

    const subtotal = quantidade * precoUnitario;

    const item = await prisma.item.update({
      where: { id },
      data: { quantidade, precoUnitario, subtotal },
    });

    const itens = await prisma.item.findMany({
      where: { sessaoId: item.sessaoId },
    });
    const novoTotal = itens.reduce((acc: number, i: { subtotal: number; }) => acc + i.subtotal, 0);
    await prisma.sessao.update({
      where: { id: item.sessaoId },
      data: { total: novoTotal },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json(
      { error: "Erro ao editar item" },
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

    const item = await prisma.item.delete({ where: { id } });

    const itens = await prisma.item.findMany({
      where: { sessaoId: item.sessaoId },
    });
    const novoTotal = itens.reduce((acc: number, i: { subtotal: number; }) => acc + i.subtotal, 0);
    await prisma.sessao.update({
      where: { id: item.sessaoId },
      data: { total: novoTotal },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao remover item" },
      { status: 500 }
    );
  }
}