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
      const hostname = urlObj.hostname;
      const estado = extrairEstado(hostname);
  
      // Formato SP e outros estados: ?p=chave|cAmbiente|...
      const paramP = params.get("p");
      if (paramP) {
        return parsearFormatoP(paramP, url, estado);
      }
  
      // Formato padrão: ?chNFe=...&dhEmi=...&vNF=...
      const chave = params.get("chNFe") ?? params.get("chave");
      if (!chave) return null;
  
      const vNF = params.get("vNF") ?? params.get("valorTotal");
      const valorTotal = vNF ? parseFloat(vNF) : 0;
  
      const dhEmi = params.get("dhEmi") ?? params.get("dataEmissao");
      const dataEmissao = dhEmi ? parsearData(dhEmi) : extrairDataDaChave(chave);
  
      return { chave, dataEmissao, valorTotal, urlOriginal: url, estado };
    } catch {
      return null;
    }
  }
  
  function parsearFormatoP(paramP: string, url: string, estado: string | null): DadosNFCe | null {
    try {
      const partes = paramP.split("|");
      const chave = partes[0];
  
      if (!chave || chave.length !== 44) return null;
  
      // Extrai data da chave NFC-e (posição 2-5: AAMM)
      const dataEmissao = extrairDataDaChave(chave);
  
      // Tenta extrair valor total das partes seguintes se disponível
      let valorTotal = 0;
      for (const parte of partes.slice(1)) {
        const num = parseFloat(parte.replace(",", "."));
        if (!isNaN(num) && num > 1 && num < 99999) {
          valorTotal = num;
          break;
        }
      }
  
      return { chave, dataEmissao, valorTotal, urlOriginal: url, estado };
    } catch {
      return null;
    }
  }
  
  function extrairDataDaChave(chave: string): Date {
    try {
      // Chave NFC-e: posição 3-4 = ano, posição 5-6 = mês
      const ano = `20${chave.slice(2, 4)}`;
      const mes = chave.slice(4, 6);
      const dia = "01";
      return new Date(`${ano}-${mes}-${dia}T12:00:00`);
    } catch {
      return new Date();
    }
  }
  
  function parsearData(dhEmi: string): Date {
    try {
      const limpo = dhEmi.replace(/[-:]/g, "");
      const ano = limpo.slice(0, 4);
      const mes = limpo.slice(4, 6);
      const dia = limpo.slice(6, 8);
      const hora = limpo.slice(9, 11) || "00";
      const min = limpo.slice(11, 13) || "00";
      return new Date(`${ano}-${mes}-${dia}T${hora}:${min}:00`);
    } catch {
      return new Date();
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