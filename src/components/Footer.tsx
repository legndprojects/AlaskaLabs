import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white px-8 md:px-16 lg:px-24 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link
              href="/"
              className="text-2xl font-display tracking-[0.2em] uppercase"
            >
              AlaskaLabs
            </Link>
            <p className="text-sm text-gray-400 mt-4 font-sans leading-relaxed">
              The purest peptides, straight from the source.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-[0.15em] uppercase mb-4">
              Shop
            </h4>
            <ul className="space-y-2 font-sans text-sm text-gray-400">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-[0.15em] uppercase mb-4">
              Company
            </h4>
            <ul className="space-y-2 font-sans text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-[0.15em] uppercase mb-4">
              Legal
            </h4>
            <ul className="space-y-2 font-sans text-sm text-gray-400">
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-xs text-gray-500 font-sans mb-4">
            For research and laboratory use only. Not for human consumption. By
            using this website, you agree to our Terms of Service.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 font-sans">
              &copy; {new Date().getFullYear()} AlaskaLabs. All rights reserved.
            </p>
            <div className="flex gap-3 text-xs text-gray-500 font-sans">
              <span>Visa</span>
              <span>Mastercard</span>
              <span>BTC</span>
              <span>ETH</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
