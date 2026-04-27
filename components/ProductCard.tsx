import Link from "next/link";

type Product = {
  id: string;
  slug: string;
  product_name: string;
  price?: number | null;
  main_image_url?: string | null;
  affiliate_link: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl =
    product.main_image_url ||
    "https://via.placeholder.com/600x400?text=Universal+Mart";

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/product/${product.slug}`} className="relative block bg-slate-100">
        <div className="absolute left-3 top-3 z-10 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
          Featured Deal
        </div>

        <img
          src={imageUrl}
          alt={product.product_name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
            Universal Mart Pick
          </p>
          <p className="text-xs font-medium text-slate-400">Trusted deal</p>
        </div>

        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-950">
          <Link href={`/product/${product.slug}`} className="hover:text-orange-600">
            {product.product_name}
          </Link>
        </h3>

        <p className="mt-3 text-xl font-extrabold text-slate-950">
          {product.price ? `$${product.price.toFixed(2)}` : "See latest deal"}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Price may change on partner website.
        </p>

        <div className="mt-auto flex gap-3 pt-5">
          <Link
            href={`/product/${product.slug}`}
            className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Details
          </Link>

          <a
            href={product.affiliate_link}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-2xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
          >
            View Deal
          </a>
        </div>
      </div>
    </div>
  );
}