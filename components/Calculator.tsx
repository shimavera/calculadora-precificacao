"use client";

import { useState, useMemo } from "react";
import { PRODUCTS, MARKETPLACES, TAX_REGIMES, COST_COLORS } from "@/lib/data";
import { calculate, formatCurrency, formatPercent } from "@/lib/calculations";
import { CalculatorInputs } from "@/lib/types";
import { Info, ChevronDown, ChevronUp, Package, ShoppingBag, Percent, Truck, Tag, TrendingUp, AlertCircle, BookOpen } from "lucide-react";

const DEFAULT_INPUTS: CalculatorInputs = {
  productCost: 125,
  quantity: 1,
  marketplaceId: "mercadolivre-premium",
  customMarketplaceFee: 15,
  taxRegimeId: "simples-1",
  shippingCost: 18,
  freeShipping: true,
  packagingCost: 4,
  marketingPercent: 5,
  returnRate: 2,
  desiredMargin: 25,
};

interface TooltipProps {
  text: string;
}

function Tooltip({ text }: TooltipProps) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex" style={{ marginLeft: 4 }}>
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        style={{ color: "var(--muted)", lineHeight: 0 }}
        aria-label="Mais informações"
      >
        <Info size={13} />
      </button>
      {show && (
        <span
          className="animate-fade"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--surface-3)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--ivory)",
            width: 220,
            lineHeight: 1.5,
            zIndex: 50,
            boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ color: "var(--gold)", lineHeight: 0 }}>{icon}</span>
        <h3 style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

interface FieldProps {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
}

function Field({ label, tooltip, children }: FieldProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "flex", alignItems: "center", fontSize: 13, color: "var(--muted)", marginBottom: 6, fontWeight: 500 }}>
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      {children}
    </div>
  );
}

function CostBar({ label, value, percent, color, price }: { label: string; value: number; percent: number; color: string; price: number }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0, display: "inline-block" }} />
          <span style={{ fontSize: 12, color: "var(--muted)", fontFamily: "DM Sans, sans-serif" }}>{label}</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--muted-2)", fontFamily: "DM Mono, monospace" }}>{percent.toFixed(1)}%</span>
          <span style={{ fontSize: 13, color: "var(--ivory)", fontFamily: "DM Mono, monospace", minWidth: 72, textAlign: "right" }}>
            {formatCurrency(value)}
          </span>
        </div>
      </div>
      <div style={{ background: "var(--surface-3)", borderRadius: 4, height: 6, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${Math.min(percent, 100)}%`,
            background: color,
            borderRadius: 4,
            transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
    </div>
  );
}

export default function Calculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [eduOpen, setEduOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("vestido-luna");

  const result = useMemo(() => calculate(inputs), [inputs]);

  function set<K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function selectProduct(id: string) {
    setSelectedProductId(id);
    const product = PRODUCTS.find((p) => p.id === id);
    if (product) set("productCost", product.cost);
  }

  const healthColor =
    result.actualMargin >= 20 ? "var(--green)"
    : result.actualMargin >= 10 ? "var(--gold)"
    : "var(--red)";

  const healthLabel =
    result.actualMargin >= 20 ? "Saudável"
    : result.actualMargin >= 10 ? "Atenção"
    : "Crítico";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        borderBottom: "1px solid var(--border)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        background: "rgba(10, 8, 12, 0.9)",
        backdropFilter: "blur(16px)",
        zIndex: 40,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700, color: "var(--ivory)", letterSpacing: "-0.02em" }}>
              Precify
            </h1>
            <span style={{ fontSize: 11, color: "var(--gold)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Moda
            </span>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
            Calculadora de precificação inteligente
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: healthColor, boxShadow: `0 0 8px ${healthColor}` }} />
          <span style={{ fontSize: 12, color: healthColor, fontWeight: 600 }}>{healthLabel}</span>
        </div>
      </header>

      {/* Main layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", flex: 1, gap: 0, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "0 24px" }}>

        {/* LEFT — Inputs */}
        <div style={{ padding: "28px 20px 48px 0", overflowY: "auto" }}>

          {/* Product selector */}
          <Section icon={<Package size={16} />} title="Produto">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectProduct(p.id)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: selectedProductId === p.id ? "1px solid var(--gold)" : "1px solid var(--border)",
                    background: selectedProductId === p.id ? "rgba(201, 168, 76, 0.08)" : "var(--surface-2)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: selectedProductId === p.id ? "var(--gold)" : "var(--ivory)" }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{p.category}</div>
                  <div className="font-mono" style={{ fontSize: 13, color: "var(--gold-light)", marginTop: 4 }}>
                    {formatCurrency(p.cost)}
                  </div>
                </button>
              ))}
            </div>
            <Field label="Custo do produto (R$)" tooltip="Quanto você paga pelo produto — preço de compra ou custo de produção.">
              <input
                type="number"
                className="input-base"
                value={inputs.productCost}
                onChange={(e) => { setSelectedProductId("custom"); set("productCost", parseFloat(e.target.value) || 0); }}
                step="0.01"
                min="0"
                placeholder="0,00"
              />
            </Field>
          </Section>

          {/* Marketplace */}
          <Section icon={<ShoppingBag size={16} />} title="Canal de Venda">
            <Field label="Plataforma" tooltip="Cada marketplace cobra uma comissão sobre o valor da venda.">
              <select
                className="input-base"
                value={inputs.marketplaceId}
                onChange={(e) => set("marketplaceId", e.target.value)}
              >
                {MARKETPLACES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.fee}%{m.fixedFee ? ` + R$${m.fixedFee}` : ""}
                  </option>
                ))}
                <option value="custom">Personalizado</option>
              </select>
            </Field>
            {inputs.marketplaceId === "custom" && (
              <Field label="Taxa personalizada (%)" tooltip="Informe a comissão do canal que você usa.">
                <input
                  type="number"
                  className="input-base"
                  value={inputs.customMarketplaceFee}
                  onChange={(e) => set("customMarketplaceFee", parseFloat(e.target.value) || 0)}
                  step="0.5"
                  min="0"
                  max="50"
                />
              </Field>
            )}
            {inputs.marketplaceId !== "custom" && (
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", marginTop: -4 }}>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                  {MARKETPLACES.find((m) => m.id === inputs.marketplaceId)?.description}
                </p>
              </div>
            )}
          </Section>

          {/* Impostos */}
          <Section icon={<Percent size={16} />} title="Tributação">
            <Field label="Regime tributário" tooltip="Cada regime tem alíquotas diferentes. Consulte seu contador para confirmar o mais adequado.">
              <select
                className="input-base"
                value={inputs.taxRegimeId}
                onChange={(e) => set("taxRegimeId", e.target.value)}
              >
                {TAX_REGIMES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.rate}%
                  </option>
                ))}
              </select>
            </Field>
            {(() => {
              const regime = TAX_REGIMES.find((t) => t.id === inputs.taxRegimeId);
              return regime ? (
                <div style={{ padding: "10px 12px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", marginTop: -4 }}>
                  <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
                    {regime.description}
                    {regime.limit && <span style={{ color: "var(--gold)", fontWeight: 500 }}> ({regime.limit})</span>}
                  </p>
                </div>
              ) : null;
            })()}
          </Section>

          {/* Logística */}
          <Section icon={<Truck size={16} />} title="Logística">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 14px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", cursor: "pointer" }}
              onClick={() => set("freeShipping", !inputs.freeShipping)}>
              <input
                type="checkbox"
                checked={inputs.freeShipping}
                onChange={(e) => set("freeShipping", e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ivory)" }}>Oferecer frete grátis</div>
                <div style={{ fontSize: 11, color: "var(--muted)" }}>Você absorve o custo do envio no preço</div>
              </div>
            </div>
            {inputs.freeShipping && (
              <Field label="Custo médio do frete (R$)" tooltip="Valor médio que você paga para enviar uma peça. Será embutido no preço.">
                <input
                  type="number"
                  className="input-base"
                  value={inputs.shippingCost}
                  onChange={(e) => set("shippingCost", parseFloat(e.target.value) || 0)}
                  step="0.5"
                  min="0"
                  placeholder="0,00"
                />
              </Field>
            )}
            <Field label="Custo de embalagem (R$)" tooltip="Caixa, saquinho, papel de seda, fita, tag. Essas coisas somam!">
              <input
                type="number"
                className="input-base"
                value={inputs.packagingCost}
                onChange={(e) => set("packagingCost", parseFloat(e.target.value) || 0)}
                step="0.5"
                min="0"
                placeholder="0,00"
              />
            </Field>
          </Section>

          {/* Marketing & Perdas */}
          <Section icon={<Tag size={16} />} title="Marketing & Perdas">
            <Field
              label={`Marketing e anúncios — ${inputs.marketingPercent}%`}
              tooltip="% do preço de venda que você investe em anúncios patrocinados dentro da plataforma ou fora."
            >
              <input
                type="range"
                min="0"
                max="30"
                step="0.5"
                value={inputs.marketingPercent}
                onChange={(e) => set("marketingPercent", parseFloat(e.target.value))}
                style={{ accentColor: "var(--gold)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                <span>0%</span><span>15%</span><span>30%</span>
              </div>
            </Field>
            <Field
              label={`Taxa de devolução — ${inputs.returnRate}%`}
              tooltip="% das vendas que resultam em devolução. Moda online: 5-15% é normal. Leva o custo do produto + frete de volta."
            >
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={inputs.returnRate}
                onChange={(e) => set("returnRate", parseFloat(e.target.value))}
                style={{ accentColor: "var(--gold)" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                <span>0%</span><span>10%</span><span>20%</span>
              </div>
            </Field>
          </Section>

          {/* Margem */}
          <Section icon={<TrendingUp size={16} />} title="Margem de Lucro Desejada">
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <span className="font-display" style={{ fontSize: 52, fontWeight: 700, color: "var(--gold)", lineHeight: 1 }}>
                {inputs.desiredMargin}
              </span>
              <span style={{ fontSize: 24, color: "var(--muted)", fontWeight: 300 }}>%</span>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
                {inputs.desiredMargin < 15 ? "Margem baixa — risco alto" : inputs.desiredMargin < 25 ? "Margem razoável" : "Margem saudável"}
              </p>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="1"
              value={inputs.desiredMargin}
              onChange={(e) => set("desiredMargin", parseFloat(e.target.value))}
              style={{ accentColor: "var(--gold)" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
              <span>5%</span><span>30%</span><span>60%</span>
            </div>
          </Section>

        </div>

        {/* RIGHT — Results (sticky) */}
        <div style={{ padding: "28px 0 48px 20px", borderLeft: "1px solid var(--border)" }}>
          <div style={{ position: "sticky", top: 80 }}>

            {/* Main price */}
            <div className="card" style={{ textAlign: "center", marginBottom: 12, background: "var(--surface)", border: "1px solid rgba(201, 168, 76, 0.15)" }}>
              <p style={{ fontSize: 12, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
                Preço Recomendado
              </p>
              <div
                className="font-display animate-fade"
                key={result.recommendedPrice.toFixed(0)}
                style={{ fontSize: 56, fontWeight: 700, color: "var(--gold-light)", lineHeight: 1, letterSpacing: "-0.02em" }}
              >
                {formatCurrency(result.recommendedPrice)}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "var(--surface-3)", color: "var(--muted)" }}>
                  Mínimo: {formatCurrency(result.breakEvenPrice)}
                </span>
              </div>
            </div>

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
              {[
                { label: "Lucro", value: formatCurrency(result.netProfit), color: result.netProfit > 0 ? "var(--green)" : "var(--red)" },
                { label: "Margem real", value: formatPercent(result.actualMargin), color: healthColor },
                { label: "Múltiplo", value: `${result.markup.toFixed(1)}x`, color: "var(--ivory)" },
              ].map((kpi) => (
                <div key={kpi.label} className="card" style={{ textAlign: "center", padding: "14px 10px" }}>
                  <div className="font-mono" style={{ fontSize: 17, fontWeight: 500, color: kpi.color }}>{kpi.value}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 4, letterSpacing: "0.05em" }}>{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Cost breakdown */}
            <div className="card" style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, color: "var(--muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16, fontWeight: 600 }}>
                Anatomia do Preço
              </p>
              <CostBar label="Custo do produto" value={result.costs.productCost} percent={result.costs.productCostPercent} color={COST_COLORS.productCost} price={result.recommendedPrice} />
              <CostBar label="Taxa marketplace" value={result.costs.marketplaceFee} percent={result.costs.marketplaceFeePercent} color={COST_COLORS.marketplaceFee} price={result.recommendedPrice} />
              <CostBar label="Impostos" value={result.costs.tax} percent={result.costs.taxPercent} color={COST_COLORS.tax} price={result.recommendedPrice} />
              {inputs.freeShipping && (
                <CostBar label="Frete" value={result.costs.shipping} percent={result.costs.shippingPercent} color={COST_COLORS.shipping} price={result.recommendedPrice} />
              )}
              <CostBar label="Embalagem" value={result.costs.packaging} percent={result.costs.packagingPercent} color={COST_COLORS.packaging} price={result.recommendedPrice} />
              {inputs.marketingPercent > 0 && (
                <CostBar label="Marketing" value={result.costs.marketing} percent={result.costs.marketingPercent} color={COST_COLORS.marketing} price={result.recommendedPrice} />
              )}
              {inputs.returnRate > 0 && (
                <CostBar label="Devoluções" value={result.costs.returnCost} percent={result.costs.returnCostPercent} color={COST_COLORS.returnCost} price={result.recommendedPrice} />
              )}
              <div style={{ borderTop: "1px solid var(--border)", marginTop: 12, paddingTop: 12 }}>
                <CostBar label="Lucro líquido" value={result.costs.profit} percent={result.costs.profitPercent} color={COST_COLORS.profit} price={result.recommendedPrice} />
              </div>
            </div>

            {/* Warning */}
            {result.actualMargin < 10 && (
              <div style={{ padding: "12px 14px", borderRadius: 8, background: "rgba(224, 85, 85, 0.1)", border: "1px solid rgba(224, 85, 85, 0.25)", display: "flex", gap: 10, marginBottom: 12 }}>
                <AlertCircle size={16} style={{ color: "var(--red)", flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: "var(--red)", lineHeight: 1.5 }}>
                  Margem abaixo de 10%. Aumente o preço ou reduza os custos para garantir a sustentabilidade do negócio.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Educational Section */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "0 32px" }}>
        <button
          onClick={() => setEduOpen(!eduOpen)}
          style={{
            width: "100%",
            padding: "20px 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BookOpen size={16} style={{ color: "var(--gold)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ivory)", letterSpacing: "0.04em" }}>
              Como precificar — Guia completo
            </span>
          </div>
          {eduOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {eduOpen && (
          <div className="animate-fade" style={{ paddingBottom: 48, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {EDU_CARDS.map((card) => (
              <div key={card.title} className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 20 }}>{card.emoji}</span>
                  <h4 style={{ fontSize: 15, fontWeight: 600, color: "var(--ivory)" }}>{card.title}</h4>
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>{card.text}</p>
                {card.formula && (
                  <div className="font-mono" style={{ marginTop: 12, padding: "10px 12px", borderRadius: 6, background: "var(--surface-2)", fontSize: 12, color: "var(--gold)", lineHeight: 1.6 }}>
                    {card.formula}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 11, color: "var(--muted-2)" }}>
          Os valores são estimativas. Consulte seu contador para decisões tributárias.
        </p>
        <p className="font-display" style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic" }}>
          Precify Moda
        </p>
      </footer>
    </div>
  );
}

const EDU_CARDS = [
  {
    emoji: "📐",
    title: "A fórmula correta",
    text: "Nunca calcule o markup multiplicando o custo por 2 ou 3 sem considerar as taxas variáveis. A forma certa é dividir os custos fixos pelo espaço que sobra após deduzir todas as taxas percentuais.",
    formula: "Preço = Custos fixos\n         ÷ (1 - taxas variáveis%)",
  },
  {
    emoji: "🏪",
    title: "Taxas de marketplace",
    text: "Mercado Livre Premium cobra 16% + frete grátis obrigatório. Shopee cobra 14% + R$2 fixo. Amazon cobra entre 8-12%. Esses percentuais incidem sobre o preço de venda, não sobre o lucro — por isso impactam tanto.",
  },
  {
    emoji: "📋",
    title: "Regime tributário",
    text: "MEI tem tributação quase zerada sobre faturamento (valor fixo mensal), mas tem limite de R$81k/ano. Simples Nacional Anexo I começa em 4% para comércio. Lucro Presumido pode chegar a 11,33%. Escolha errada = margem errada.",
  },
  {
    emoji: "🚚",
    title: "Frete grátis é ilusão?",
    text: "Frete grátis não existe — quem paga é você. Calcule o custo médio real do envio e embutido no preço. No Mercado Livre Premium, isso é obrigatório. Na sua loja própria, é uma estratégia de conversão que precisa estar no preço.",
  },
  {
    emoji: "↩️",
    title: "Taxa de devolução",
    text: "Moda online tem uma das maiores taxas de devolução do e-commerce: 5-15%. Cada devolução custa o frete de ida e volta + eventual não-reaproveitamento. Coloque pelo menos 2-3% no seu custo de partida.",
  },
  {
    emoji: "💰",
    title: "Qual margem perseguir?",
    text: "Margem líquida abaixo de 10% não sustenta um negócio com crescimento. Entre 15-25% é saudável para moda. Acima de 30% você tem espaço para promoções e investimento em marketing sem quebrar.",
  },
  {
    emoji: "📊",
    title: "Markup vs margem",
    text: "Markup de 2x não significa 50% de margem! Margem é calculada sobre o preço de venda. Um produto de R$100 vendido a R$200 tem markup 2x, mas margem de 50% antes das taxas — que podem consumir 30-40%.",
    formula: "Margem = Lucro ÷ Preço × 100\nMarkup = Preço ÷ Custo",
  },
  {
    emoji: "🎯",
    title: "Preço psicológico",
    text: "Após calcular o preço mínimo e recomendado, ajuste para valores psicológicos: R$159,90 vende mais que R$160. Se o cálculo der R$152, suba para R$159,90. Se der R$163, suba para R$169,90 — mais margem, melhor percepção.",
  },
];
