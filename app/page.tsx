import Hero from "@/components/Hero";
import PathTable from "@/components/PathTable";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="path" className="mx-auto max-w-5xl px-4 py-16">
        <PathTable />
      </section>
    </>
  );
}
