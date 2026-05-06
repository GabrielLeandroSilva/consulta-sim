import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUsuarioLogado } from "@/lib/session";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const sessao = await prisma.sessao.findFirst({
      where: { id, usuarioId: usuario.id },
      include: { itens: true },
    });

    if (!sessao) {
      return NextResponse.json(
        { error: "Sessão não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(sessao);
  } catch (err) {
    console.error("ERRO AO BUSCAR SESSÃO:", err);
    return NextResponse.json(
      { error: "Erro ao buscar sessão" },
      { status: 500 }
    );
  }
}

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
    const dados = await request.json();

    const sessao = await prisma.sessao.updateMany({
      where: { id, usuarioId: usuario.id },
      data: {
        ...(dados.nome && { nome: dados.nome }),
        ...(dados.total !== undefined && { total: dados.total }),
        ...(dados.finalizada !== undefined && { finalizada: dados.finalizada }),
        ...(dados.finalizadaEm !== undefined && {
          finalizadaEm: dados.finalizadaEm ? new Date(dados.finalizadaEm) : null,
        }),
      },
    });

    if (sessao.count === 0) {
      return NextResponse.json(
        { error: "Sessão não encontrada" },
        { status: 404 }
      );
    }

    const sessaoAtualizada = await prisma.sessao.findFirst({
      where: { id, usuarioId: usuario.id },
      include: { itens: true },
    });

    return NextResponse.json(sessaoAtualizada);
  } catch (err) {
    console.error("ERRO AO ATUALIZAR SESSÃO:", err);
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
    const usuario = await getUsuarioLogado();
    if (!usuario) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.sessao.deleteMany({
      where: { id, usuarioId: usuario.id },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("ERRO AO DELETAR SESSÃO:", err);
    return NextResponse.json(
      { error: "Erro ao deletar sessão" },
      { status: 500 }
    );
  }
}