"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X } from "lucide-react";

interface LeitorQRCodeProps {
  onLeitura: (url: string) => void;
  onFechar: () => void;
}

export function LeitorQRCode({ onLeitura, onFechar }: LeitorQRCodeProps) {
  const [erro, setErro] = useState<string | null>(null);
  const [iniciando, setIniciando] = useState(true);
  const readerRef = useRef<Html5Qrcode | null>(null);
  const leuRef = useRef(false);

  useEffect(() => {
    const elementId = "qr-reader";

    async function iniciar() {
      try {
        const html5Qrcode = new Html5Qrcode(elementId);
        readerRef.current = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            if (leuRef.current) return;
            leuRef.current = true;
            onLeitura(decodedText);
          },
          () => {}
        );

        setIniciando(false);
      } catch {
        setErro("Não foi possível acessar a câmera. Verifique as permissões.");
        setIniciando(false);
      }
    }

    iniciar();

    return () => {
      readerRef.current
        ?.stop()
        .catch(() => {})
        .finally(() => readerRef.current?.clear());
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-black">
        <p className="text-white text-sm font-medium">
          Aponte para o QR Code da nota
        </p>
        <button onClick={onFechar} className="p-2 text-white">
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        {iniciando && (
          <div className="flex flex-col items-center gap-3 mb-6">
            <Camera size={32} className="text-white opacity-60" />
            <p className="text-white text-sm opacity-60">
              Iniciando câmera...
            </p>
          </div>
        )}

        {erro ? (
          <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 text-center">
            <p className="text-red-300 text-sm">{erro}</p>
            <button
              onClick={onFechar}
              className="mt-3 px-4 py-2 bg-white text-gray-800 text-sm rounded-lg"
            >
              Fechar
            </button>
          </div>
        ) : (
          <div
            id="qr-reader"
            className="w-full max-w-sm rounded-2xl overflow-hidden"
          />
        )}

        {!iniciando && !erro && (
          <p className="text-white/50 text-xs mt-6 text-center">
            Centralize o QR Code da nota fiscal na área marcada
          </p>
        )}
      </div>
    </div>
  );
}