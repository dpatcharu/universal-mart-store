import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      
      {/* Top Section */}
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          
          {/* Brand */}
          <div>
            <h3 className="text-xl font-extrabold tracking-tight text-slate-950">
              Universal<span className="text-orange-500">Mart</span>{" "}
              <span className="text-xs font-medium text-slate-400">LLC</span>
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Discover curated products, better deals, and smarter ways to shop online — all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Quick Links
            </p>

            <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
              <Link href="/shop" className="hover:text-orange-600">
                Shop
              </Link>
              <Link href="/about" className="hover:text-orange-600">
                About
              </Link>
              <Link href="/contact" className="hover:text-orange-600">
                Contact
              </Link>
              <Link href="/privacy" className="hover:text-orange-600">
                Privacy / Disclosure
              </Link>
            </div>
          </div>

          {/* Trust / Info */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Why Shop With Us
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• Handpicked product recommendations</li>
              <li>• Trusted affiliate partners</li>
              <li>• No extra cost to you</li>
              <li>• Fast redirection to secure platforms</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <p className="text-xs leading-6 text-slate-500">
            Some links on this site are affiliate links, which means Universal Mart LLC may earn a commission at no extra cost to you.
          </p>

          <p className="mt-2 text-xs text-slate-400">
            © {new Date().getFullYear()} Universal Mart LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}