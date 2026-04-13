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
    <div className="group rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <Link href={`/product/${product.slug}`}>
        <div className="overflow-hidden rounded-[20px] bg-slate-100">
          <img
            src={imageUrl}
            alt={product.product_name}
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <h3 className="mt-4 text-xl font-semibold leading-tight text-slate-900">
        <Link href={`/product/${product.slug}`}>{product.product_name}</Link>
      </h3>

      <p className="mt-2 text-base font-semibold text-slate-500">
        {product.price ? `$${product.price}` : "See deal"}
      </p>

      <div className="mt-4 flex gap-3">
        <Link
          href={`/product/${product.slug}`}
          className="flex-1 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-slate-50"
        >
          Details
        </Link>

        <a
          href={product.affiliate_link}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-2xl bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-800"
        >
          View Deal
        </a>
      </div>
    </div>
  );
}