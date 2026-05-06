import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUsuarioLogado } from "@/lib/session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const { nome, quantidade, precoUnitario, categoria } = await request.json();
    const subtotal = quantidade * precoUnitario;

    const item = await prisma.item.update({
      where: { id },
      data: {
        ...(nome && { nome: nome.trim() }),
        ...(categoria && { categoria }),
        quantidade,
        precoUnitario,
        subtotal,
      },
    });

    const itens = await prisma.item.findMany({
      where: { sessaoId: item.sessaoId },
    });
    const novoTotal = itens.reduce(
      (acc: number, i: { subtotal: number }) => acc + i.subtotal,
      0
    );
    await prisma.sessao.update({
      where: { id: item.sessaoId },
      data: { total: novoTotal },
    });

    return NextResponse.json(item);
  } catch (err) {
    console.error("ERRO AO EDITAR ITEM:", err);
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
    const usuario = await getUsuarioLogado();
    if (!usuario) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const item = await prisma.item.delete({ where: { id } });

    const itens = await prisma.item.findMany({
      where: { sessaoId: item.sessaoId },
    });
    const novoTotal = itens.reduce((acc: number, i: { subtotal: number }) => acc + i.subtotal, 0);
    await prisma.sessao.update({
      where: { id: item.sessaoId },
      data: { total: novoTotal },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ERRO AO REMOVER ITEM:", err);
    return NextResponse.json(
      { error: "Erro ao remover item" },
      { status: 500 }
    );
  }
}