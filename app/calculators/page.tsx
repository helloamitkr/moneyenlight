import type { Metadata } from "next";
import Calculators from "@/components/Calculators";

export const metadata: Metadata = {
  title: "SIP, Lumpsum & EMI Calculators",
  description:
    "Free online SIP calculator with optional yearly step-up, lumpsum future value calculator, and EMI calculator. Amounts shown in Indian numbering (lakh, crore).",
  alternates: { canonical: "/calculators/" },
  openGraph: {
    title: "SIP, Lumpsum & EMI Calculators — MoneyEnlight",
    description:
      "Free online SIP calculator with optional yearly step-up, lumpsum future value calculator, and EMI calculator.",
  },
};

export default function CalculatorsPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 pb-20 pt-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Calculators</h1>
        <p className="mt-2 text-white/65">SIP · Lumpsum · EMI</p>
      </div>
      <Calculators />
    </section>
  );
}
