export const metadata = {
  title: "About — AlaskaLabs",
  description: "Learn about AlaskaLabs and our commitment to purity.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pt-24 md:pt-36 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-display font-black uppercase text-[#1a1a1a] mb-8">
          About
        </h1>
        <div className="space-y-6 text-base font-sans text-[#444] leading-relaxed">
          <p>
            AlaskaLabs was founded with a single mission: deliver the purest
            research peptides available, with full transparency and zero
            compromise on quality.
          </p>
          <p>
            Every batch we produce undergoes rigorous third-party testing via
            HPLC and mass spectrometry analysis. We publish complete Certificates
            of Analysis for every product, so you always know exactly what
            you&apos;re getting.
          </p>
          <p>
            Our peptides are synthesized using solid-phase methodology in
            USA-based facilities, delivering consistent chain lengths and purity
            levels that exceed industry standards.
          </p>
          <p>
            We believe researchers deserve better than opaque sourcing and
            questionable quality. That&apos;s why we&apos;ve built AlaskaLabs
            from the ground up around transparency, testing, and trust.
          </p>
        </div>
      </div>
    </main>
  );
}
