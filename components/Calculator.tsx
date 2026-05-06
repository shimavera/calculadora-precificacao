"use client";

import { useState, useMemo, useId } from "react";
import { PRODUCTS, MARKETPLACES, TAX_REGIMES, COST_COLORS } from "@/lib/data";
import { calculate, formatCurrency, formatPercent } from "@/lib/calculations";
import { CalculatorInputs } from "@/lib/types";
import {
  ShoppingBag, Receipt, Truck, Megaphone, TrendingUp,
  ChevronDown, ChevronUp, Info, AlertTriangle, CheckCircle2,
} from "lucide-react";

const DEFAULT_INPUTS: CalculatorInputs = {
  productCost: 75,
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

/* ─── Tooltip ─── */
function Tooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative" style={{ display: "inline-flex", marginLeft: 5, verticalAlign: "middle" }}>
      <button
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        style={{ color: "var(--text-3)", lineHeight: 0, cursor: "help" }}
      >
        <Info size={12} />
      </button>
      {open && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)", background: "var(--surface-3)",
          border: "1px solid var(--border-strong)", borderRadius: 8,
          padding: "9px 12px", fontSize: 12, color: "var(--text-2)",
          width: 220, lineHeight: 1.6, zIndex: 100,
          boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
          whiteSpace: "normal", pointerEvents: "none",
        }}>
          {text}
        </span>
      )}
    </span>
  );
}

/* ─── Field wrapper ─── */
function Field({
  label, tooltip, children, inline,
}: {
  label: string; tooltip?: string; children: React.ReactNode; inline?: boolean;
}) {
  return (
    <div style={{ marginBottom: 16, display: inline ? "flex" : undefined, alignItems: inline ? "center" : undefined, gap: inline ? 12 : undefined }}>
      <label style={{
        display: "flex", alignItems: "center",
        fontSize: 12, fontWeight: 500, color: "var(--text-2)",
        letterSpacing: "0.02em", marginBottom: inline ? 0 : 7,
        whiteSpace: "nowrap",
      }}>
        {label}{tooltip && <Tooltip text={tooltip} />}
      </label>
      {children}
    </div>
  );
}

/* ─── Section header ─── */
function SectionHead({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      marginBottom: 18, paddingBottom: 12,
      borderBottom: "1px solid var(--border)",
    }}>
      <span style={{ color: "var(--gold)", lineHeight: 0 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-2)" }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Cost bar row ─── */
function CostRow({
  label, value, percent, color,
}: { label: string; value: number; percent: number; color: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "var(--text-2)" }}>{label}</span>
        </div>
        <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
          <span className="f-mono" style={{ fontSize: 10, color: "var(--text-3)" }}>{percent.toFixed(1)}%</span>
          <span className="f-mono" style={{ fontSize: 13, color: "var(--text)", minWidth: 78, textAlign: "right" }}>
            {formatCurrency(value)}
          </span>
        </div>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: "var(--surface-3)", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${Math.min(Math.max(percent, 0), 100)}%`,
          background: color, borderRadius: 3,
          transition: "width 0.55s cubic-bezier(0.34,1.56,0.64,1)",
          transformOrigin: "left",
        }} />
      </div>
    </div>
  );
}

/* ─── KPI card ─── */
function KPI({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{
      background: "var(--surface-2)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "14px 16px",
    }}>
      <div className="f-mono" style={{ fontSize: 20, fontWeight: 500, color: color ?? "var(--text)", lineHeight: 1.1 }}>{value}</div>
      {sub && <div className="f-mono" style={{ fontSize: 10, color: "var(--text-3)", marginTop: 3 }}>{sub}</div>}
      <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 6, letterSpacing: "0.03em" }}>{label}</div>
    </div>
  );
}

/* ─── Main ─── */
export default function Calculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [selectedProduct, setSelectedProduct] = useState("vestido-luna");
  const [eduOpen, setEduOpen] = useState(false);

  const result = useMemo(() => calculate(inputs), [inputs]);

  function set<K extends keyof CalculatorInputs>(k: K, v: CalculatorInputs[K]) {
    setInputs((p) => ({ ...p, [k]: v }));
  }

  function pickProduct(id: string) {
    setSelectedProduct(id);
    const p = PRODUCTS.find((x) => x.id === id);
    if (p) set("productCost", p.cost);
  }

  const healthColor = result.actualMargin >= 20 ? "var(--green)" : result.actualMargin >= 10 ? "var(--gold-light)" : "var(--red)";
  const HealthIcon = result.actualMargin >= 20 ? CheckCircle2 : AlertTriangle;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ── Header ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        borderBottom: "1px solid var(--border)",
        background: "rgba(14,12,18,0.88)", backdropFilter: "blur(20px)",
        padding: "0 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60,
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span className="f-display" style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em", color: "var(--text)" }}>
            Precify
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--gold)",
            background: "var(--gold-dim)", padding: "2px 7px", borderRadius: 20,
          }}>
            Moda
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <HealthIcon size={13} style={{ color: healthColor }} />
          <span style={{ fontSize: 12, color: healthColor, fontWeight: 500 }}>
            {result.actualMargin >= 20 ? "Margem saudável" : result.actualMargin >= 10 ? "Atenção à margem" : "Margem crítica"}
          </span>
        </div>
      </header>

      {/* ── Body ── */}
      <div style={{
        flex: 1, display: "grid",
        gridTemplateColumns: "1fr 380px",
        maxWidth: 1100, width: "100%",
        margin: "0 auto", padding: "0 24px",
        gap: 0,
      }}>

        {/* LEFT — Inputs */}
        <div style={{ padding: "32px 28px 64px 0", borderRight: "1px solid var(--border)" }}>

          {/* Produtos */}
          <section style={{ marginBottom: 36 }}>
            <SectionHead icon={<ShoppingBag size={15} />} label="Produto" />

            {/* Pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
              {PRODUCTS.map((p) => {
                const active = selectedProduct === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => pickProduct(p.id)}
                    style={{
                      padding: "8px 14px", borderRadius: 8,
                      border: `1.5px solid ${active ? "var(--gold)" : "var(--border-strong)"}`,
                      background: active ? "var(--gold-dim)" : "var(--surface-2)",
                      cursor: "pointer", transition: "all 0.18s",
                      display: "flex", flexDirection: "column", gap: 2, textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500, color: active ? "var(--gold-light)" : "var(--text)" }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-3)" }}>{p.category}</span>
                    <span className="f-mono" style={{ fontSize: 12, color: active ? "var(--gold)" : "var(--text-2)", marginTop: 2 }}>
                      {formatCurrency(p.cost)}
                    </span>
                  </button>
                );
              })}
            </div>

            <Field label="Custo do produto" tooltip="Quanto você paga pelo produto — preço de compra ou custo de produção.">
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  color: "var(--text-3)", fontSize: 13, fontFamily: "var(--font-mono), monospace", pointerEvents: "none",
                }}>R$</span>
                <input
                  type="number"
                  className="field"
                  style={{ paddingLeft: 34 }}
                  value={inputs.productCost}
                  onChange={(e) => { setSelectedProduct("custom"); set("productCost", parseFloat(e.target.value) || 0); }}
                  step="0.01" min="0"
                />
              </div>
            </Field>
          </section>

          {/* Canal de venda */}
          <section style={{ marginBottom: 36 }}>
            <SectionHead icon={<ShoppingBag size={15} />} label="Canal de Venda" />
            <Field label="Plataforma" tooltip="Cada marketplace cobra uma comissão sobre o valor da venda.">
              <select className="field" value={inputs.marketplaceId} onChange={(e) => set("marketplaceId", e.target.value)}>
                {MARKETPLACES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.fee}%{m.fixedFee ? ` + R$ ${m.fixedFee}/pedido` : ""}
                  </option>
                ))}
                <option value="custom">Personalizado</option>
              </select>
            </Field>
            {inputs.marketplaceId === "custom" ? (
              <Field label="Taxa personalizada (%)" tooltip="Informe a comissão do canal que você usa.">
                <input type="number" className="field" value={inputs.customMarketplaceFee}
                  onChange={(e) => set("customMarketplaceFee", parseFloat(e.target.value) || 0)}
                  step="0.5" min="0" max="50" />
              </Field>
            ) : (
              <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.6, marginTop: -8, paddingLeft: 2 }}>
                {MARKETPLACES.find((m) => m.id === inputs.marketplaceId)?.description}
              </p>
            )}
          </section>

          {/* Tributação */}
          <section style={{ marginBottom: 36 }}>
            <SectionHead icon={<Receipt size={15} />} label="Tributação" />
            <Field label="Regime tributário" tooltip="Cada regime tem alíquotas diferentes. Consulte seu contador.">
              <select className="field" value={inputs.taxRegimeId} onChange={(e) => set("taxRegimeId", e.target.value)}>
                {TAX_REGIMES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.rate}%
                  </option>
                ))}
              </select>
            </Field>
            {(() => {
              const r = TAX_REGIMES.find((t) => t.id === inputs.taxRegimeId);
              return r ? (
                <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.6, marginTop: -8, paddingLeft: 2 }}>
                  {r.description}{r.limit && <span style={{ color: "var(--gold)", marginLeft: 4 }}>({r.limit})</span>}
                </p>
              ) : null;
            })()}
          </section>

          {/* Logística */}
          <section style={{ marginBottom: 36 }}>
            <SectionHead icon={<Truck size={15} />} label="Logística" />

            {/* Checkbox frete grátis */}
            <label style={{
              display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer",
              padding: "12px 14px", borderRadius: 10,
              background: "var(--surface-2)", border: "1.5px solid var(--border-strong)",
              marginBottom: 14, transition: "border-color 0.18s",
              ...(inputs.freeShipping ? { borderColor: "rgba(200,160,74,0.35)" } : {}),
            }}>
              <input type="checkbox" checked={inputs.freeShipping} onChange={(e) => set("freeShipping", e.target.checked)} style={{ marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 2 }}>Oferecer frete grátis</div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>Você absorve o custo do envio no preço de venda</div>
              </div>
            </label>

            {inputs.freeShipping && (
              <Field label="Custo médio do envio" tooltip="Valor que você paga para despachar uma peça. Será embutido no preço.">
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 13, fontFamily: "var(--font-mono),monospace", pointerEvents: "none" }}>R$</span>
                  <input type="number" className="field" style={{ paddingLeft: 34 }} value={inputs.shippingCost}
                    onChange={(e) => set("shippingCost", parseFloat(e.target.value) || 0)} step="0.5" min="0" />
                </div>
              </Field>
            )}

            <Field label="Custo de embalagem" tooltip="Caixa, papel de seda, sacola, fita. Não esqueça esses detalhes!">
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)", fontSize: 13, fontFamily: "var(--font-mono),monospace", pointerEvents: "none" }}>R$</span>
                <input type="number" className="field" style={{ paddingLeft: 34 }} value={inputs.packagingCost}
                  onChange={(e) => set("packagingCost", parseFloat(e.target.value) || 0)} step="0.5" min="0" />
              </div>
            </Field>
          </section>

          {/* Marketing & Perdas */}
          <section style={{ marginBottom: 36 }}>
            <SectionHead icon={<Megaphone size={15} />} label="Marketing & Perdas" />

            <Field label={`Anúncios e marketing — ${inputs.marketingPercent}%`}
              tooltip="Percentual do preço de venda destinado a anúncios patrocinados ou mídia paga.">
              <input type="range" min="0" max="30" step="0.5" value={inputs.marketingPercent}
                onChange={(e) => set("marketingPercent", parseFloat(e.target.value))}
                style={{ accentColor: "var(--gold)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                {["0%", "10%", "20%", "30%"].map((v) => (
                  <span key={v} className="f-mono" style={{ fontSize: 10, color: "var(--text-3)" }}>{v}</span>
                ))}
              </div>
            </Field>

            <Field label={`Taxa de devolução — ${inputs.returnRate}%`}
              tooltip="Moda online tem 5-15% de devolução em média. Cada retorno custa o frete de ida e volta.">
              <input type="range" min="0" max="20" step="0.5" value={inputs.returnRate}
                onChange={(e) => set("returnRate", parseFloat(e.target.value))}
                style={{ accentColor: "var(--gold)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                {["0%", "5%", "10%", "20%"].map((v) => (
                  <span key={v} className="f-mono" style={{ fontSize: 10, color: "var(--text-3)" }}>{v}</span>
                ))}
              </div>
            </Field>
          </section>

          {/* Margem */}
          <section>
            <SectionHead icon={<TrendingUp size={15} />} label="Margem de Lucro Desejada" />
            <div style={{ textAlign: "center", marginBottom: 20, padding: "20px 0" }}>
              <span className="f-display" style={{ fontSize: 72, fontWeight: 700, color: "var(--gold-light)", lineHeight: 1, letterSpacing: "-0.02em" }}>
                {inputs.desiredMargin}
              </span>
              <span style={{ fontSize: 28, color: "var(--text-3)", fontWeight: 300, marginLeft: 4 }}>%</span>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 10 }}>
                {inputs.desiredMargin < 15 ? "⚠ Margem baixa — risco operacional" : inputs.desiredMargin < 25 ? "Margem razoável" : "Margem saudável"}
              </p>
            </div>
            <input type="range" min="5" max="60" step="1" value={inputs.desiredMargin}
              onChange={(e) => set("desiredMargin", parseFloat(e.target.value))}
              style={{ accentColor: "var(--gold)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
              {["5%", "20%", "40%", "60%"].map((v) => (
                <span key={v} className="f-mono" style={{ fontSize: 10, color: "var(--text-3)" }}>{v}</span>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT — Results (sticky) */}
        <div style={{ padding: "32px 0 64px 28px" }}>
          <div style={{ position: "sticky", top: 76 }}>

            {/* Price hero */}
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border-strong)",
              borderRadius: 14, padding: "28px 24px", marginBottom: 12, textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 12 }}>
                Preço Recomendado
              </p>
              <div key={result.recommendedPrice.toFixed(0)} className="f-display fade-up" style={{
                fontSize: 52, fontWeight: 700, color: "var(--gold-light)",
                letterSpacing: "-0.02em", lineHeight: 1,
              }}>
                {formatCurrency(result.recommendedPrice)}
              </div>
              <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 8 }}>
                <span style={{
                  fontSize: 11, padding: "4px 10px", borderRadius: 20,
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  color: "var(--text-3)",
                }}>
                  Mínimo: <span className="f-mono" style={{ color: "var(--text-2)" }}>{formatCurrency(result.breakEvenPrice)}</span>
                </span>
              </div>
            </div>

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
              <KPI label="Lucro / venda" value={formatCurrency(result.netProfit)} color={result.netProfit > 0 ? "var(--green)" : "var(--red)"} />
              <KPI label="Margem real" value={formatPercent(result.actualMargin)} color={healthColor} />
              <KPI label="Múltiplo" value={`${result.markup.toFixed(1)}×`} />
            </div>

            {/* Alert */}
            {result.actualMargin < 10 && (
              <div style={{
                display: "flex", gap: 10, padding: "12px 14px", borderRadius: 10,
                background: "rgba(224,88,88,0.08)", border: "1px solid rgba(224,88,88,0.2)",
                marginBottom: 12,
              }}>
                <AlertTriangle size={14} style={{ color: "var(--red)", flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: "var(--red)", lineHeight: 1.5 }}>
                  Margem abaixo de 10%. Ajuste o preço ou reduza custos para garantir a sustentabilidade.
                </p>
              </div>
            )}

            {/* Breakdown */}
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 14, padding: "20px 20px 14px",
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 16 }}>
                Anatomia do Preço
              </p>
              <CostRow label="Custo do produto"  value={result.costs.productCost}     percent={result.costs.productCostPercent}     color={COST_COLORS.productCost} />
              <CostRow label="Taxa marketplace"  value={result.costs.marketplaceFee}   percent={result.costs.marketplaceFeePercent}   color={COST_COLORS.marketplaceFee} />
              <CostRow label="Impostos"           value={result.costs.tax}              percent={result.costs.taxPercent}              color={COST_COLORS.tax} />
              {inputs.freeShipping && (
                <CostRow label="Frete"            value={result.costs.shipping}         percent={result.costs.shippingPercent}         color={COST_COLORS.shipping} />
              )}
              <CostRow label="Embalagem"          value={result.costs.packaging}        percent={result.costs.packagingPercent}        color={COST_COLORS.packaging} />
              {inputs.marketingPercent > 0 && (
                <CostRow label="Marketing"        value={result.costs.marketing}        percent={result.costs.marketingPercent}        color={COST_COLORS.marketing} />
              )}
              {inputs.returnRate > 0 && (
                <CostRow label="Devoluções"       value={result.costs.returnCost}       percent={result.costs.returnCostPercent}       color={COST_COLORS.returnCost} />
              )}
              <div style={{ borderTop: "1px solid var(--border)", marginTop: 4, paddingTop: 12 }}>
                <CostRow label="Lucro líquido"   value={result.costs.profit}           percent={result.costs.profitPercent}           color={COST_COLORS.profit} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Educational Section ── */}
      <div style={{ borderTop: "1px solid var(--border)", maxWidth: 1100, width: "100%", margin: "0 auto", padding: "0 24px" }}>
        <button
          onClick={() => setEduOpen(!eduOpen)}
          style={{
            width: "100%", padding: "18px 0",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "none", border: "none", cursor: "pointer",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>Como precificar — Guia completo</span>
          </div>
          {eduOpen
            ? <ChevronUp size={15} style={{ color: "var(--text-3)" }} />
            : <ChevronDown size={15} style={{ color: "var(--text-3)" }} />
          }
        </button>

        {eduOpen && (
          <div className="fade-up" style={{ paddingBottom: 56, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {EDU_CARDS.map((card) => (
              <div key={card.title} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "18px 20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{card.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{card.title}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7 }}>{card.text}</p>
                {card.formula && (
                  <pre className="f-mono" style={{
                    marginTop: 12, padding: "10px 12px", borderRadius: 8,
                    background: "var(--surface-2)", fontSize: 12,
                    color: "var(--gold)", lineHeight: 1.7, whiteSpace: "pre-wrap",
                  }}>
                    {card.formula}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: 1100, width: "100%", margin: "0 auto",
      }}>
        <p style={{ fontSize: 11, color: "var(--text-3)" }}>
          Valores estimados. Consulte seu contador para decisões tributárias.
        </p>
        <span className="f-display" style={{ fontSize: 13, color: "var(--text-3)", fontStyle: "italic" }}>
          Precify
        </span>
      </footer>
    </div>
  );
}

const EDU_CARDS = [
  {
    emoji: "📐",
    title: "A fórmula correta",
    text: "Multiplicar o custo por 2 ou 3 sem considerar as taxas variáveis é um erro grave. A forma certa divide os custos fixos pelo espaço que sobra após deduzir todas as taxas em %.",
    formula: "Preço = Custos fixos\n         ÷ (1 − taxas variáveis %)",
  },
  {
    emoji: "🏪",
    title: "Taxas de marketplace",
    text: "Mercado Livre Premium: 16% + frete grátis obrigatório. Shopee: 14% + R$ 2 fixo. Amazon: 8-12%. Esses percentuais incidem sobre o preço de venda, por isso impactam tanto no lucro.",
  },
  {
    emoji: "📋",
    title: "Regime tributário",
    text: "MEI tem tributação quase zerada (valor fixo mensal), mas limite de R$ 81k/ano. Simples Nacional Anexo I começa em 4% para comércio. Lucro Presumido chega a 11,33%. Escolha errada = margem errada.",
  },
  {
    emoji: "🚚",
    title: "Frete grátis é ilusão?",
    text: "Frete grátis não existe — quem paga é você. Calcule o custo médio real e embutido no preço. No ML Premium é obrigatório. Na loja própria é estratégia de conversão que deve estar no preço.",
  },
  {
    emoji: "↩️",
    title: "Taxa de devolução",
    text: "Moda online tem 5-15% de devolução. Cada retorno custa o frete de ida e volta + eventual não-reaproveitamento do produto. Coloque pelo menos 2-3% no cálculo.",
  },
  {
    emoji: "💰",
    title: "Qual margem buscar?",
    text: "Margem líquida abaixo de 10% não sustenta crescimento. Entre 15-25% é saudável para moda. Acima de 30% você tem espaço para promoções e investimento em marketing.",
  },
  {
    emoji: "📊",
    title: "Markup ≠ margem",
    text: "Markup 2× não significa 50% de margem! Margem é calculada sobre o preço de venda. R$ 100 vendido a R$ 200 tem markup 2×, mas margem de 50% antes das taxas — que consomem 30-40%.",
    formula: "Margem % = Lucro ÷ Preço × 100\nMarkup   = Preço ÷ Custo",
  },
  {
    emoji: "🎯",
    title: "Preço psicológico",
    text: "Após calcular, ajuste para valores psicológicos. R$ 159,90 converte mais que R$ 160. Se o cálculo der R$ 152, suba para R$ 159,90. Se der R$ 163, suba para R$ 169,90 — mais margem e melhor percepção.",
  },
];
