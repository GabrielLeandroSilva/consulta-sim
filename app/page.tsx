"use client";

import { useCompraStore } from "@/store/useCompraStore";

export default function Home() {
  const { sessaoAtiva, iniciarSessao, adicionarItem } = useCompraStore();

  return (
    <main className="p-4">
      <button
        onClick={() => iniciarSessao("Compra de Abril")}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg mr-2"
      >
        Iniciar sessão
      </button>

      <button
        onClick={() =>
          adicionarItem({
            nome: "Arroz 5kg",
            quantidade: 2,
            precoUnitario: 24.9,
            categoria: "mercearia",
          })
        }
        className="px-4 py-2 bg-green-600 text-white rounded-lg"
      >
        Adicionar item
      </button>

      <pre className="mt-4 text-sm bg-gray-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify(sessaoAtiva, null, 2)}
      </pre>
    </main>
  );
}