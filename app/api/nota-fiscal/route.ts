import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getUsuarioLogado } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const usuario = await getUsuarioLogado();
    if (!usuario) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { nome, valorTotal, dataEmissao } = await request.json();

    if (!nome?.trim() || !valorTotal || !dataEmissao) {
      return NextResponse.json(
        { error: "Dados incompletos" },
        { status: 400 }
      );
    }

    const data = new Date(dataEmissao);

    const sessao = await prisma.sessao.create({
      data: {
        nome: nome.trim(),
        total: valorTotal,
        finalizada: true,
        criadaEm: data,
        finalizadaEm: data,
        usuarioId: usuario.id,
      },
      include: { itens: true },
    });

    return NextResponse.json(sessao, { status: 201 });
  } catch (err) {
    console.error("ERRO AO SALVAR NOTA:", err);
    return NextResponse.json(
      { error: "Erro ao salvar nota fiscal" },
      { status: 500 }
    );
  }
}