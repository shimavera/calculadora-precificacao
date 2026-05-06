import { Product, Marketplace, TaxRegime } from "./types";

export const PRODUCTS: Product[] = [
  { id: "vestido-luna", name: "Vestido Luna", category: "Manga Longa", cost: 75.0 },
  { id: "vestido-lara", name: "Vestido Lara", category: "Manga Curta", cost: 70.0 },
  { id: "body-ml", name: "Body", category: "Manga Longa", cost: 40.0 },
  { id: "body-mc", name: "Body", category: "Manga Curta", cost: 35.0 },
  { id: "calca-jeans", name: "Calça Jeans", category: "Denim", cost: 75.0 },
];

export const MARKETPLACES: Marketplace[] = [
  {
    id: "mercadolivre-classico",
    name: "Mercado Livre Clássico",
    fee: 12,
    description: "Anúncios gratuitos, visibilidade padrão",
  },
  {
    id: "mercadolivre-premium",
    name: "Mercado Livre Premium",
    fee: 16,
    description: "Máxima exposição, frete grátis obrigatório",
  },
  {
    id: "shopee",
    name: "Shopee",
    fee: 14,
    fixedFee: 2,
    description: "14% + R$ 2 por pedido, alto volume",
  },
  {
    id: "amazon",
    name: "Amazon",
    fee: 12,
    description: "Boa reputação, público premium",
  },
  {
    id: "magalu",
    name: "Magazine Luiza",
    fee: 16,
    description: "Grande alcance, forte no interior",
  },
  {
    id: "americanas",
    name: "Americanas / B2W",
    fee: 18,
    description: "Américas, Submarino, Shoptime",
  },
  {
    id: "propria",
    name: "Loja Própria",
    fee: 3,
    description: "Gateway de pagamento, sem intermediário",
  },
  {
    id: "instagram",
    name: "Instagram / WhatsApp",
    fee: 0,
    description: "Venda direta, taxa de gateway apenas",
  },
];

export const TAX_REGIMES: TaxRegime[] = [
  {
    id: "mei",
    name: "MEI",
    rate: 1.5,
    limit: "até R$ 81k/ano",
    description: "Microempreendedor Individual — valor fixo mensal + alíquota baixa sobre faturamento",
  },
  {
    id: "simples-1",
    name: "Simples Nacional — Faixa 1",
    rate: 4,
    limit: "até R$ 180k/ano",
    description: "Comércio (Anexo I), primeira faixa de faturamento",
  },
  {
    id: "simples-2",
    name: "Simples Nacional — Faixa 2",
    rate: 7.3,
    limit: "até R$ 360k/ano",
    description: "Comércio (Anexo I), segunda faixa de faturamento",
  },
  {
    id: "simples-3",
    name: "Simples Nacional — Faixa 3",
    rate: 9.5,
    limit: "até R$ 720k/ano",
    description: "Comércio (Anexo I), terceira faixa de faturamento",
  },
  {
    id: "lucro-presumido",
    name: "Lucro Presumido",
    rate: 11.33,
    limit: "até R$ 78M/ano",
    description: "IRPJ + CSLL + PIS + COFINS + ISS/ICMS — porte médio",
  },
  {
    id: "sem-imposto",
    name: "Sem Imposto (cálculo bruto)",
    rate: 0,
    description: "Calcular sem considerar tributação — para análise inicial",
  },
];

export const COST_COLORS = {
  productCost: "#C9A84C",
  marketplaceFee: "#E85D5D",
  tax: "#9B7FE8",
  shipping: "#5E9BE8",
  packaging: "#5EBF8C",
  marketing: "#E8A45D",
  returnCost: "#E87D9B",
  profit: "#4DB894",
};
