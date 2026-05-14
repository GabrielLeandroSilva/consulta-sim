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
    const { nome, quantidade, categoria, pego } = await request.json();

    const item = await prisma.listaItem.updateMany({
      where: { id, usuarioId: usuario.id },
      data: {
        ...(nome && { nome: nome.trim() }),
        ...(quantidade !== undefined && { quantidade }),
        ...(categoria && { categoria }),
        ...(pego !== undefined && { pego }),
      },
    });

    if (item.count === 0) {
      return NextResponse.json(
        { error: "Item não encontrado" },
        { status: 404 }
      );
    }

    const itemAtualizado = await prisma.listaItem.findFirst({
      where: { id, usuarioId: usuario.id },
    });

    return NextResponse.json(itemAtualizado);
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

    await prisma.listaItem.deleteMany({
      where: { id, usuarioId: usuario.id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ERRO AO DELETAR ITEM:", err);
    return NextResponse.json(
      { error: "Erro ao deletar item" },
      { status: 500 }
    );
  }
}