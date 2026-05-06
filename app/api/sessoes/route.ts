import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUsuarioLogado } from "@/lib/session";

export async function GET() {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const sessoes = await prisma.sessao.findMany({
      where: { usuarioId: usuario.id },
      include: { itens: true },
      orderBy: { criadaEm: "desc" },
    });
    return NextResponse.json(sessoes);
  } catch (err) {
    console.error("ERRO AO LISTAR SESSÕES:", err);
    return NextResponse.json(
      { error: "Erro ao buscar sessões" },
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

    const { nome } = await request.json();

    if (!nome?.trim()) {
      return NextResponse.json(
        { error: "Nome da sessão é obrigatório" },
        { status: 400 }
      );
    }

    const sessao = await prisma.sessao.create({
      data: {
        nome: nome.trim(),
        usuarioId: usuario.id,
      },
      include: { itens: true },
    });

    return NextResponse.json(sessao, { status: 201 });
  } catch (err) {
    console.error("ERRO AO CRIAR SESSÃO:", err);
    return NextResponse.json(
      { error: "Erro ao criar sessão" },
      { status: 500 }
    );
  }
}