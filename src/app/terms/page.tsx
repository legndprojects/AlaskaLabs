export const metadata = {
  title: "Terms & Conditions — Alaska Labs",
  description:
    "Terms and conditions for purchasing research peptides from Alaska Labs.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white pt-24 md:pt-36 pb-20 px-8 md:px-16 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-display tracking-[0.3em] uppercase text-[#0072BC]/70 mb-3">
          Legal
        </p>
        <h1 className="text-5xl md:text-7xl font-display font-black uppercase text-[#1a1a1a] mb-3">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm font-sans text-[#888] mb-12">
          Last updated: April 30, 2026
        </p>

        {/* Important notice callout */}
        <div className="bg-[#f5f5f5] border border-[#eee] rounded-2xl p-6 md:p-7 mb-12">
          <h2 className="text-lg font-display font-black uppercase text-[#1a1a1a] mb-2">
            Read Before You Order
          </h2>
          <p className="text-sm md:text-base font-sans text-[#444] leading-relaxed">
            Placing an order on this site means you've read and agreed to
            the sections below. Alaska Labs supplies{" "}
            <strong>research-grade compounds for laboratory use only</strong>
            {" "}— not for human consumption, veterinary use, or medical
            purposes of any kind. If that doesn't fit your use case, please
            don't order.
          </p>
        </div>

        <div className="space-y-10">
          <Section number="1" title="Agreement to These Terms">
            <p>
              These Terms &amp; Conditions are the agreement between you
              and Alaska Labs. They cover your visits to this site and any
              purchase placed through it. By creating an account, adding a
              product to your cart, or completing checkout, you accept
              these terms.
            </p>
            <p>
              If any part of these terms doesn't work for you, please
              don't use the site or place an order. Continued use after we
              update these terms means you accept the updated version.
            </p>
          </Section>

          <Section number="2" title="Eligibility">
            <p>
              You must be at least <strong>21 years of age</strong> to use
              this site or place an order. By placing an order you confirm
              that you meet that requirement. Alaska Labs may request
              proof of age or institutional affiliation at any point in
              the order lifecycle, and may cancel orders that cannot be
              verified.
            </p>
          </Section>

          <Section number="3" title="Strictly Research Use — Prohibited Uses">
            <p>
              Every product sold by Alaska Labs is supplied for{" "}
              <strong>in-vitro and laboratory research only</strong>. Our
              compounds are not drugs, supplements, cosmetics, or food. The
              following uses are <strong>strictly prohibited</strong> and
              fall entirely outside the scope of any sale:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-[#E31C23]">
              <li>Human ingestion, injection, inhalation, or topical application of any kind</li>
              <li>Administration to animals, including pets, livestock, and laboratory animals outside an approved protocol</li>
              <li>Diagnostic, prophylactic, therapeutic, or palliative use</li>
              <li>Compounding, repackaging, or resale to unqualified third parties</li>
              <li>Use in food, beverage, dietary supplement, or cosmetic preparation</li>
              <li>Use in clinical trials or studies on human subjects without independent IRB/IEC approval and full regulatory compliance</li>
              <li>Use in any manner that would cause Alaska Labs to be classified as a drug manufacturer, compounder, or outsourcing facility</li>
            </ul>
            <p className="italic text-[#444]/85">
              Misuse is on the buyer, not on Alaska Labs. It also voids
              warranty and refund eligibility on the affected order.
            </p>
          </Section>

          <Section number="4" title="Researcher Certification">
            <p>When you place an order, you confirm that:</p>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-[#0072BC]/60">
              <li>You are a qualified researcher, or you represent a qualified research institution authorized to procure laboratory chemicals on its behalf</li>
              <li>You will use the products solely for legitimate, lawful research</li>
              <li>You possess the equipment, facilities, training, and personal protective measures necessary to handle research-grade compounds safely</li>
              <li>You understand that these compounds may not have been studied for safety in humans or animals and that the risks of handling them are entirely your own</li>
              <li>You will not transfer, sell, or otherwise distribute these compounds to anyone who does not meet the conditions described here</li>
              <li>You are not ordering on behalf of, or with the intent to supply, anyone engaged in unlawful activity</li>
            </ul>
          </Section>

          <Section number="5" title="FDA & Regulatory Status">
            <p>
              The statements on this website have not been evaluated by the
              United States Food and Drug Administration (FDA). The
              products of Alaska Labs are not intended to diagnose, treat,
              cure, mitigate, or prevent any disease.
            </p>
            <p>
              Alaska Labs is a chemical supplier. Alaska Labs is{" "}
              <strong>not</strong> a compounding pharmacy or chemical
              compounding facility as defined under Section 503A of the
              Federal Food, Drug, and Cosmetic Act. Alaska Labs is{" "}
              <strong>not</strong> an outsourcing facility as defined under
              Section 503B of the Federal Food, Drug, and Cosmetic Act. No
              statement on this website should be read as a representation
              that any product is safe or effective for human or animal
              use.
            </p>
          </Section>

          <Section number="6" title="Product Information">
            <p>
              Compounds are sold individually and most ship in lyophilized
              (powder) form. Bacteriostatic water, syringes, sterile
              filters, and other research consumables are{" "}
              <strong>not included</strong> with purchase. Reconstitution,
              storage, and handling are the responsibility of the buyer.
            </p>
            <p>
              Every batch is independently analyzed by HPLC and mass
              spectrometry; a Certificate of Analysis is available on
              request and, where indicated, attached to the product page.
              Purity, identity, and assay specifications reflect the
              tested batch and may vary lot to lot within published
              tolerances.
            </p>
          </Section>

          <Section number="7" title="Order Acceptance & Right to Refuse">
            <p>
              Submission of an order is an offer to purchase. Alaska Labs
              accepts that offer when payment clears and the order ships,
              not before. We may decline, hold, or cancel any order at our
              sole discretion — including, without limitation, orders
              flagged by our fraud screening, orders shipping to addresses
              we cannot verify, orders inconsistent with research-quantity
              norms, and orders we reasonably believe are intended for
              prohibited use under Section 3.
            </p>
            <p>
              We are under no obligation to disclose the reason an order is
              declined. Any captured payment on a declined order is
              refunded to the original payment method.
            </p>
          </Section>

          <Section number="8" title="Pricing & Payment">
            <p>
              All prices are listed in United States dollars and are
              subject to change without notice. Promotions, discount codes,
              and sale pricing apply only to the order on which they are
              redeemed and cannot be applied retroactively. Payment must
              clear in full before any order ships.
            </p>
            <p>
              Alaska Labs accepts major credit and debit cards as well as
              select cryptocurrencies. Crypto payments are final once
              confirmed on-chain and are not reversible; please double-check
              addresses and amounts before sending.
            </p>
          </Section>

          <Section number="9" title="Shipping">
            <p>
              Orders placed before 2:00 PM PST on a business day will
              typically ship the same day; orders placed after that cutoff
              ship the next business day. Standard shipping is free on
              orders over <strong>$199</strong>. All packages ship in
              plain, unmarked exterior packaging with tracking provided.
            </p>
            <p>
              Alaska Labs ships <strong>within the United States only</strong>.
              We do not ship to international addresses, APO/FPO addresses,
              or third-party freight-forwarder addresses. Orders to such
              destinations will be cancelled and refunded.
            </p>
            <p>
              Risk of loss and title for products pass to you upon delivery
              to the carrier. Lost or stolen packages are the
              responsibility of the carrier; we will assist in opening a
              claim where possible.
            </p>
          </Section>

          <Section number="10" title="Refunds, Returns & Damaged Shipments">
            <p>
              If your shipment arrives damaged, incorrect, or short,
              contact{" "}
              <a
                href="mailto:support@alaskalabs.is"
                className="text-[#0072BC] hover:underline"
              >
                support@alaskalabs.is
              </a>{" "}
              within <strong>48 hours of delivery</strong> with photos of
              the package and contents. Eligible claims will be replaced or
              refunded at our discretion.
            </p>
            <p>
              Because of the nature of these products, we do not accept
              returns of opened, used, or reconstituted vials under any
              circumstance. Sealed product may be returned only with prior
              written authorization and at the buyer's expense.
            </p>
          </Section>

          <Section number="11" title="Electronic Communications">
            <p>
              By placing an order or providing your email address, you
              consent to receive transactional and order-related
              communications from Alaska Labs electronically. You agree
              that all notices, agreements, disclosures, and other
              communications we provide to you electronically satisfy any
              legal requirement that such communications be in writing.
            </p>
          </Section>

          <Section number="12" title="Limitation of Liability & Indemnification">
            <p>
              To the fullest extent permitted by law, Alaska Labs, its
              owners, employees, contractors, and suppliers shall not be
              liable for any indirect, incidental, consequential, special,
              exemplary, or punitive damages of any kind, including but
              not limited to lost profits, lost data, lost research
              outcomes, personal injury, or property damage, even if Alaska
              Labs has been advised of the possibility of such damages.
              Our total aggregate liability for any claim arising out of
              or relating to a purchase shall not exceed the amount you
              paid for the product giving rise to the claim.
            </p>
            <p>
              You agree to defend, indemnify, and hold harmless Alaska
              Labs and its affiliates from and against any claim, demand,
              loss, or liability arising out of (a) your breach of these
              Terms, (b) your misuse of any product, (c) your violation of
              any law or regulation in connection with a purchase, or (d)
              any third-party injury caused by a compound you obtained
              from Alaska Labs.
            </p>
          </Section>

          <Section number="13" title="Modification of Terms">
            <p>
              Alaska Labs may revise these Terms &amp; Conditions at any
              time by posting an updated version on this page. The "Last
              updated" date at the top reflects the current revision.
              Material changes apply to orders placed on or after the
              effective date of the change. Periodically reviewing this
              page is your responsibility.
            </p>
          </Section>

          <Section number="14" title="Governing Law & Disputes">
            <p>
              These Terms &amp; Conditions are governed by and construed
              in accordance with the laws of the United States and, where
              applicable, the state in which Alaska Labs is established,
              without regard to conflict-of-law principles. Any dispute
              arising out of or relating to these Terms or a purchase
              shall be brought exclusively in the state or federal courts
              located within the United States, and you submit to the
              personal jurisdiction of such courts.
            </p>
            <p>
              If any provision of these Terms is held invalid or
              unenforceable, the remaining provisions remain in full force
              and effect.
            </p>
          </Section>

          <Section number="15" title="Contact">
            <p>
              Questions about these Terms &amp; Conditions can be sent to{" "}
              <a
                href="mailto:support@alaskalabs.is"
                className="text-[#0072BC] hover:underline"
              >
                support@alaskalabs.is
              </a>
              . We do our best to respond within one business day.
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
