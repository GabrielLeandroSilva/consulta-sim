-- CreateTable
CREATE TABLE "ListaItem" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 1,
    "categoria" TEXT NOT NULL,
    "pego" BOOLEAN NOT NULL DEFAULT false,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "ListaItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ListaItem" ADD CONSTRAINT "ListaItem_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
