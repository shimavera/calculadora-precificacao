import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculadora de Precificação — Moda",
  description: "Calcule o preço ideal dos seus produtos considerando marketplace, impostos, frete e margem de lucro.",
  openGraph: {
    title: "Calculadora de Precificação — Moda",
    description: "Precifique seus produtos de forma inteligente e lucrativa.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
