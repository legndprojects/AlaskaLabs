export const metadata = {
  title: "Contact — AlaskaLabs",
  description: "Get in touch with AlaskaLabs.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white pt-24 md:pt-36 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-display font-black uppercase text-[#1a1a1a] mb-8">
          Contact
        </h1>
        <div className="space-y-6 text-base font-sans text-[#444] leading-relaxed">
          <p>
            Have a question about our products or your order? We&apos;re here to help.
          </p>
          <div className="bg-[#f5f5f5] rounded-xl p-6">
            <h2 className="text-lg font-display font-black uppercase text-[#1a1a1a] mb-3">
              Email Us
            </h2>
            <a
              href="mailto:support@alaskalabs.is"
              className="text-[#0072BC] hover:underline font-sans"
            >
              support@alaskalabs.is
            </a>
            <p className="text-sm text-[#888] mt-2">
              We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
