import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getUsuarioLogado() {
  const session = await auth();

  if (!session?.user?.email) return null;

  const usuario = await prisma.usuario.upsert({
    where: { email: session.user.email },
    update: {
      nome: session.user.name ?? undefined,
      imagem: session.user.image ?? undefined,
    },
    create: {
      email: session.user.email,
      nome: session.user.name ?? undefined,
      imagem: session.user.image ?? undefined,
    },
  });

  return usuario;
}