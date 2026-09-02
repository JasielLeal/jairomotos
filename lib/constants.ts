export const PRODUCT_CATEGORIES = [
  "Óleo e Lubrificantes",
  "Peças de Motor",
  "Freios",
  "Suspensão",
  "Elétrica",
  "Transmissão e Corrente",
  "Pneus e Câmaras",
  "Filtros",
  "Acessórios",
  "Outros",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
