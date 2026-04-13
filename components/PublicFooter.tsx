import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Universal Mart LLC
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Curated affiliate shopping with a cleaner browsing experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-600">
            <Link href="/shop" className="hover:text-slate-900">
              Shop
            </Link>
            <Link href="/about" className="hover:text-slate-900">
              About
            </Link>
            <Link href="/contact" className="hover:text-slate-900">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-slate-900">
              Privacy / Disclosure
            </Link>
          </div>
        </div>

        <p className="mt-6 text-xs leading-6 text-slate-500">
          Some links on this site are affiliate links, which means Universal Mart
          may earn a commission at no extra cost to you.
        </p>
      </div>
    </footer>
  );
}