export type Categoria =
  | "hortifruti"
  | "frios"
  | "limpeza"
  | "bebidas"
  | "higiene"
  | "mercearia"
    | "outros";
  
export interface Item {
    id: string;
    nome: string;
    quantidade: number;
    precoUnitario: number;
    subtotal: number;
    categoria: Categoria;
    criadoEm: string;
}

export interface Sessao {
    id: string;
    nome: string;
    itens: Item[];
    total: number;
    criadaEm: string;
    finalizadaEm?: string;
    finalizada: boolean;
  }