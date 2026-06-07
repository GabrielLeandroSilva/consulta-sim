export interface DadosNFCe {
    chave: string;
    dataEmissao: Date;
    valorTotal: number;
    urlOriginal: string;
    estado: string | null;
  }
  
  export function parsearUrlNFCe(url: string): DadosNFCe | null {
    try {
      const urlObj = new URL(url);
      const params = urlObj.searchParams;
  
      // Extrai chave da nota
      const chave =
        params.get("chNFe") ??
        params.get("chave") ??
        params.get("p")?.split("|")[0] ??
        null;
  
      if (!chave) return null;
  
      // Extrai valor total
      const vNF =
        params.get("vNF") ??
        params.get("valorTotal") ??
        params.get("p")?.split("|").find((p) => p.includes(".")) ??
        null;
  
      const valorTotal = vNF ? parseFloat(vNF) : 0;
  
      // Extrai data de emissão
      const dhEmi =
        params.get("dhEmi") ??
        params.get("dataEmissao") ??
        params.get("p")?.split("|")[3] ??
        null;
  
      let dataEmissao = new Date();
  
      if (dhEmi) {
        // Formato: 20240412T143022 ou 2024-04-12T14:30:22
        const limpo = dhEmi.replace(/[-:]/g, "");
        const ano = limpo.slice(0, 4);
        const mes = limpo.slice(4, 6);
        const dia = limpo.slice(6, 8);
        const hora = limpo.slice(9, 11) || "00";
        const min = limpo.slice(11, 13) || "00";
        dataEmissao = new Date(`${ano}-${mes}-${dia}T${hora}:${min}:00`);
      }
  
      // Extrai estado pela URL
      const hostname = urlObj.hostname;
      const estado = extrairEstado(hostname);
  
      return {
        chave,
        dataEmissao,
        valorTotal,
        urlOriginal: url,
        estado,
      };
    } catch {
      return null;
    }
  }
  
  function extrairEstado(hostname: string): string | null {
    const mapa: Record<string, string> = {
      "nfce.fazenda.sp.gov.br": "SP",
      "nfce.sefaz.rs.gov.br": "RS",
      "nfce.sefaz.mg.gov.br": "MG",
      "nfce.sefaz.rj.gov.br": "RJ",
      "nfce.sefaz.pr.gov.br": "PR",
      "nfce.sefaz.sc.gov.br": "SC",
      "nfce.sefaz.ba.gov.br": "BA",
      "nfce.sefaz.ce.gov.br": "CE",
      "nfce.sefaz.go.gov.br": "GO",
      "nfce.sefaz.pe.gov.br": "PE",
      "nfce.sefaz.am.gov.br": "AM",
      "nfce.sefaz.ms.gov.br": "MS",
      "nfce.sefaz.mt.gov.br": "MT",
      "nfce.sefaz.pa.gov.br": "PA",
      "nfce.sefaz.pi.gov.br": "PI",
      "nfce.sefaz.rn.gov.br": "RN",
      "nfce.sefaz.se.gov.br": "SE",
      "nfce.sefaz.to.gov.br": "TO",
    };
  
    for (const [host, uf] of Object.entries(mapa)) {
      if (hostname.includes(host)) return uf;
    }
  
    return null;
  }
  
  export function formatarChave(chave: string): string {
    return chave.replace(/(\d{4})/g, "$1 ").trim();
  }