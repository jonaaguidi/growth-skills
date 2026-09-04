// ── Contract types: used by generate-contract tool ──

/** Bloque de contenido dentro de una sección */
export type ContractBlock =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "includes"; items: string[] }
  | { type: "excludes"; items: string[] }
  | {
      type: "paymentTable";
      rows: { concept: string; amount: string }[];
      total?: { concept: string; amount: string };
    }
  | { type: "note"; text: string };

/** Sección numerada del contrato */
export interface ContractSection {
  number: number;
  title: string;
  blocks: ContractBlock[];
}

/** Header del contrato */
export interface ContractHeader {
  serviceTitle: string;
  clientName: string;
  clientResponsible: string;
  date: string;
  author?: string;
}

/** Data completa del contrato */
export interface ContractData {
  header: ContractHeader;
  sections: ContractSection[];
  totalValue: string;
  footerValue?: string;
}
