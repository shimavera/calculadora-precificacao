export interface Product {
  id: string;
  name: string;
  cost: number;
  category: string;
}

export interface Marketplace {
  id: string;
  name: string;
  fee: number; // percentage
  fixedFee?: number; // fixed R$ per order
  description: string;
}

export interface TaxRegime {
  id: string;
  name: string;
  rate: number; // percentage
  description: string;
  limit?: string;
}

export interface CalculatorInputs {
  productCost: number;
  quantity: number;
  marketplaceId: string;
  customMarketplaceFee: number;
  taxRegimeId: string;
  shippingCost: number;
  freeShipping: boolean;
  packagingCost: number;
  marketingPercent: number;
  returnRate: number;
  desiredMargin: number;
}

export interface CalculationResult {
  breakEvenPrice: number;
  recommendedPrice: number;
  netProfit: number;
  actualMargin: number;
  markup: number;
  costs: CostBreakdown;
  totalCostPercent: number;
}

export interface CostBreakdown {
  productCost: number;
  productCostPercent: number;
  marketplaceFee: number;
  marketplaceFeePercent: number;
  tax: number;
  taxPercent: number;
  shipping: number;
  shippingPercent: number;
  packaging: number;
  packagingPercent: number;
  marketing: number;
  marketingPercent: number;
  returnCost: number;
  returnCostPercent: number;
  profit: number;
  profitPercent: number;
}
