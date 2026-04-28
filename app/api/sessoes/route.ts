import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const sessoes = await prisma.sessao.findMany({
            include: { itens: true },
            orderBy: { criadaEm: "desc" },
        });
        return NextResponse.json(sessoes);
    } catch {
        return NextResponse.json(
            { error: "Erro ao buscar sessões" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
      const { nome } = await request.json();
  
      if (!nome?.trim()) {
        return NextResponse.json(
          { error: "Nome da sessão é obrigatório" },
          { status: 400 }
        );
      }
  
      const sessao = await prisma.sessao.create({
        data: { nome: nome.trim() },
        include: { itens: true },
      });
  
      return NextResponse.json(sessao, { status: 201 });
    } catch (err) {
      console.error("ERRO AO CRIAR SESSÃO:", err);
      return NextResponse.json(
        { error: "Erro ao criar sessão", detalhe: String(err) },
        { status: 500 }
      );
    }
  }