export const metadata = {
  title: "Wholesale — AlaskaLabs",
  description:
    "Wholesale inquiries for research peptides, COAs, and bulk ordering.",
};

export default function WholesalePage() {
  return (
    <main className="min-h-screen bg-white pt-28 pb-20 px-8 md:px-16 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="font-display text-xs md:text-sm tracking-[0.35em] uppercase text-[#0072BC]/70 mb-5">
          Wholesale
        </div>
        <div className="h-px w-10 bg-[#0072BC]/40 mb-7" />
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black uppercase text-[#1a1a1a] leading-[0.9] tracking-tight mb-8">
          Bulk Ordering &amp; Partnerships
        </h1>
        <p
          className="text-base md:text-lg leading-[1.7] text-[#444] max-w-2xl mb-6"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          AlaskaLabs partners with clinics, research labs, and compounding
          pharmacies who require high-purity peptides at scale. Every bulk
          order ships with a full Certificate of Analysis, third-party
          verification, and temperature-controlled packaging.
        </p>
        <p
          className="text-base md:text-lg leading-[1.7] text-[#444] max-w-2xl mb-10"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          For pricing tiers, MOQs, and custom synthesis inquiries, please
          contact our wholesale desk.
        </p>
        <a
          href="mailto:wholesale@alaskalabs.com"
          className="inline-block px-8 py-3 text-sm font-display tracking-[0.2em] uppercase bg-[#0072BC] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_-8px_rgba(0,114,188,0.5)]"
        >
          wholesale@alaskalabs.com
        </a>
      </div>
    </main>
  );
}
