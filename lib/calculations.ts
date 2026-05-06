import { CalculatorInputs, CalculationResult, CostBreakdown } from "./types";
import { MARKETPLACES, TAX_REGIMES } from "./data";

export function calculate(inputs: CalculatorInputs): CalculationResult {
  const marketplace = MARKETPLACES.find((m) => m.id === inputs.marketplaceId);
  const taxRegime = TAX_REGIMES.find((t) => t.id === inputs.taxRegimeId);

  const marketplaceFeePercent =
    inputs.marketplaceId === "custom"
      ? inputs.customMarketplaceFee / 100
      : (marketplace?.fee ?? 0) / 100;

  const taxPercent = (taxRegime?.rate ?? 0) / 100;
  const marketingPercent = inputs.marketingPercent / 100;
  const returnPercent = inputs.returnRate / 100;
  const desiredMarginPercent = inputs.desiredMargin / 100;

  // Fixed costs per unit
  const fixedFeePerUnit = marketplace?.fixedFee ?? 0;
  const packagingPerUnit = inputs.packagingCost;
  const shippingPerUnit = inputs.freeShipping ? inputs.shippingCost : 0;

  // Variable cost percentages (applied to selling price)
  const totalVariablePercent =
    marketplaceFeePercent +
    taxPercent +
    marketingPercent +
    returnPercent;

  // Fixed costs per unit
  const totalFixedCosts = inputs.productCost + fixedFeePerUnit + packagingPerUnit + shippingPerUnit;

  // Break-even: price where profit = 0
  // price = (fixedCosts) / (1 - variablePercent)
  const breakEvenPrice = totalFixedCosts / (1 - totalVariablePercent);

  // Recommended price: include desired margin
  // price = fixedCosts / (1 - variablePercent - desiredMarginPercent)
  const denominator = 1 - totalVariablePercent - desiredMarginPercent;
  const recommendedPrice = denominator > 0 ? totalFixedCosts / denominator : breakEvenPrice * 1.3;

  // Calculate actual costs at recommended price
  const mktFee = recommendedPrice * marketplaceFeePercent + fixedFeePerUnit;
  const tax = recommendedPrice * taxPercent;
  const shipping = shippingPerUnit;
  const packaging = packagingPerUnit;
  const marketing = recommendedPrice * marketingPercent;
  const returnCost = recommendedPrice * returnPercent;

  const totalCosts = inputs.productCost + mktFee + tax + shipping + packaging + marketing + returnCost;
  const profit = recommendedPrice - totalCosts;
  const actualMargin = recommendedPrice > 0 ? (profit / recommendedPrice) * 100 : 0;
  const markup = inputs.productCost > 0 ? recommendedPrice / inputs.productCost : 0;

  const costs: CostBreakdown = {
    productCost: inputs.productCost,
    productCostPercent: (inputs.productCost / recommendedPrice) * 100,
    marketplaceFee: mktFee,
    marketplaceFeePercent: (mktFee / recommendedPrice) * 100,
    tax,
    taxPercent: (tax / recommendedPrice) * 100,
    shipping,
    shippingPercent: (shipping / recommendedPrice) * 100,
    packaging,
    packagingPercent: (packaging / recommendedPrice) * 100,
    marketing,
    marketingPercent: (marketing / recommendedPrice) * 100,
    returnCost,
    returnCostPercent: (returnCost / recommendedPrice) * 100,
    profit,
    profitPercent: actualMargin,
  };

  return {
    breakEvenPrice,
    recommendedPrice,
    netProfit: profit,
    actualMargin,
    markup,
    costs,
    totalCostPercent: 100 - actualMargin,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}
