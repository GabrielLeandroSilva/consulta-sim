import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUsuarioLogado } from "@/lib/session";

export async function GET() {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const itens = await prisma.listaItem.findMany({
      where: { usuarioId: usuario.id },
      orderBy: { criadoEm: "asc" },
    });

    return NextResponse.json(itens);
  } catch (err) {
    console.error("ERRO AO LISTAR ITENS:", err);
    return NextResponse.json(
      { error: "Erro ao buscar itens" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { nome, quantidade, categoria } = await request.json();

    if (!nome?.trim() || !categoria) {
      return NextResponse.json(
        { error: "Nome e categoria são obrigatórios" },
        { status: 400 }
      );
    }

    const item = await prisma.listaItem.create({
      data: {
        nome: nome.trim(),
        quantidade: quantidade ?? 1,
        categoria,
        usuarioId: usuario.id,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error("ERRO AO CRIAR ITEM:", err);
    return NextResponse.json(
      { error: "Erro ao criar item" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    await prisma.listaItem.updateMany({
      where: { usuarioId: usuario.id, pego: true },
      data: { pego: false },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ERRO AO RESETAR LISTA:", err);
    return NextResponse.json(
      { error: "Erro ao resetar lista" },
      { status: 500 }
    );
  }
}