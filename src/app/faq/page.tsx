"use client";

import { useState } from "react";

const faqs = [
  {
    category: "Products",
    questions: [
      {
        q: "What are peptides?",
        a: "Peptides are short chains of amino acids that serve as building blocks for proteins. They play crucial roles in various biological processes and are widely used in research settings.",
      },
      {
        q: "What is the purity of your peptides?",
        a: "All our peptides are ≥99% purity as verified by independent third-party HPLC and mass spectrometry analysis. We publish full Certificates of Analysis for every batch.",
      },
      {
        q: "Are these products for human consumption?",
        a: "No. All products sold by AlaskaLabs are intended for research and laboratory use only. They are not intended for human consumption.",
      },
    ],
  },
  {
    category: "Shipping",
    questions: [
      {
        q: "How long does shipping take?",
        a: "Most orders ship within 1 business day. Standard domestic delivery typically takes 3-5 business days.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! Orders over $150 qualify for free standard shipping within the United States.",
      },
      {
        q: "Is packaging discreet?",
        a: "Yes. All orders ship in plain, unmarked packaging with no product descriptions on the exterior.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept major credit/debit cards and cryptocurrency (BTC, ETH, LTC). Crypto payments receive a 5% discount.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. Card payments are processed through PCI-compliant payment processors. Your card details never touch our servers.",
      },
    ],
  },
  {
    category: "Returns",
    questions: [
      {
        q: "What is your return policy?",
        a: "Due to the nature of our products, we cannot accept returns on opened items. Unopened items may be returned within 30 days of purchase for a full refund.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#eee]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-base font-sans font-medium text-[#1a1a1a] pr-4">
          {q}
        </span>
        <span className="text-[#888] flex-shrink-0">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <p className="pb-4 text-sm font-sans text-[#444] leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white pt-24 md:pt-36 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-display font-black uppercase text-[#1a1a1a] mb-8">
          FAQ
        </h1>
        <div className="space-y-10">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="text-xl font-display font-black uppercase text-[#1a1a1a] mb-4">
                {section.category}
              </h2>
              <div>
                {section.questions.map((faq) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
