export const metadata = {
  title: "Privacy Policy — Alaska Labs",
  description:
    "How Alaska Labs collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white pt-24 md:pt-36 pb-20 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-display tracking-[0.3em] uppercase text-[#0072BC]/70 mb-3">
          Legal
        </p>
        <h1 className="text-5xl md:text-7xl font-display font-black uppercase text-[#1a1a1a] mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm font-sans text-[#888] mb-12">
          Last updated: April 30, 2026
        </p>

        {/* Intro callout */}
        <div className="bg-[#f5f5f5] border border-[#eee] rounded-2xl p-6 md:p-7 mb-12">
          <h2 className="text-lg font-display font-black uppercase text-[#1a1a1a] mb-2">
            The Short Version
          </h2>
          <p className="text-sm md:text-base font-sans text-[#444] leading-relaxed">
            Your information is yours. We collect only what we need to
            ship and support your order, we keep it secure, and we never
            sell it. The sections below cover the details — what we
            collect, why, who else sees it, and what you can ask us to do
            with it.
          </p>
        </div>

        <div className="space-y-10">
          <Section number="1" title="What We Collect">
            <p>
              We only collect what is necessary to process and deliver your order.
              When you visit the site or place an order, we may collect:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-[#0072BC]/60">
              <li>
                <strong>Order details</strong> — name, email, phone,
                billing address, and shipping address. The minimum needed
                to confirm and deliver your purchase.
              </li>
              <li>
                <strong>Payment data</strong> — handled by our payment
                processor or, for crypto orders, by the network you paid
                through. Card numbers and CVV codes are never stored on
                Alaska Labs servers.
              </li>
              <li>
                <strong>Basic technical signals</strong> — IP address,
                device and browser type, and the pages you visited.
                Gathered through cookies and standard analytics so we can
                understand how the site is being used.
              </li>
            </ul>
          </Section>

          <Section number="2" title="Why We Use It">
            <p>
              We use the information above to confirm and ship your
              order, send order updates, answer support questions, screen
              for fraud, and keep the site running smoothly. If you opt
              in, we'll also let you know about new releases and limited
              drops — and you can opt out at any time from a single click
              in any marketing email.
            </p>
            <p>
              We don't use your information for anything beyond running
              this business. No outside marketing partnerships, no
              data-broker arrangements.
            </p>
          </Section>

          <Section number="3" title="Your Information Stays With Us">
            <p>
              We do not sell, rent, or share your personal information
              with anyone. Your data is used solely to fulfill your
              order and provide support — nothing else.
            </p>
            <p>
              The only exception is when we are legally required to
              disclose information to comply with applicable law or to
              protect the safety, rights, or property of Alaska Labs
              and our customers.
            </p>
          </Section>

          <Section number="4" title="Cookies">
            <p>
              We use a small set of cookies to keep your cart working
              between pages, remember preferences you set, and measure
              site traffic in aggregate. We don't run advertising cookies
              and we don't build behavioral profiles for ads.
            </p>
            <p>
              You can disable cookies in your browser settings. If you
              do, parts of the site — including checkout — may not work
              the way they should.
            </p>
          </Section>

          <Section number="5" title="Security & Retention">
            <p>
              Customer data lives on US-based infrastructure with modern
              security practices in place, including encryption at rest
              and access controls scoped to people who actually need it.
              No system is perfectly secure, and we don't pretend
              otherwise — but we audit our setup regularly and respond
              promptly to anything that looks off.
            </p>
            <p>
              We keep your information only as long as it's useful for
              the order, support, and any legal obligation we have to
              hold onto records. After that, we let it go.
            </p>
          </Section>

          <Section number="6" title="Your Choices">
            <p>
              You can ask us to send you a copy of your information,
              correct anything that's wrong, delete what isn't legally
              required, or take you off the marketing list. Send the
              request from the email address on your order to{" "}
              <a
                href="mailto:support@alaskalabs.is"
                className="text-[#0072BC] hover:underline"
              >
                support@alaskalabs.is
              </a>{" "}
              and we'll typically respond within one business day.
            </p>
          </Section>

          <Section number="7" title="Updates">
            <p>
              If we change this policy, the "Last updated" date at the
              top changes with it. Material changes apply going forward,
              not retroactively. Continued use of the site after a change
              means you accept the new version.
            </p>
          </Section>

          <Section number="8" title="Contact">
            <p>
              Questions, requests, or concerns about your privacy can be
              sent to{" "}
              <a
                href="mailto:support@alaskalabs.is"
                className="text-[#0072BC] hover:underline"
              >
                support@alaskalabs.is
              </a>
              . A real person on our team will get back to you.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl md:text-2xl font-display font-black uppercase text-[#1a1a1a] mb-3">
        {number}. {title}
      </h2>
      <div className="space-y-3 text-sm md:text-base font-sans text-[#444] leading-relaxed">
        {children}
      </div>
    </section>
  );
}
