import type { Metadata } from "next";
import CapitalGainsCalc from "@/components/CapitalGainsCalc";

export const metadata: Metadata = {
  title: "STCG & LTCG Tax Calculator — India",
  description:
    "Free capital gains tax calculator for Indian investors. Compute STCG and LTCG tax on equity, debt mutual funds, property, and gold based on Budget 2024 rates.",
  alternates: { canonical: "/capital-gains/" },
  openGraph: {
    title: "STCG & LTCG Tax Calculator — MoneyEnlight",
    description:
      "Compute short-term and long-term capital gains tax on equity, debt MF, property, and gold. Budget 2024 rates.",
  },
};

export default function CapitalGainsPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 pb-20 pt-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Capital Gains Tax Calculator
        </h1>
        <p className="mt-2 text-white/65">STCG · LTCG · Budget 2024 Rates</p>
      </div>
      <CapitalGainsCalc />
    </section>
  );
}
