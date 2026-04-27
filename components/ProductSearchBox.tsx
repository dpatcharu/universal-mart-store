"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SearchProduct = {
  id: string;
  slug: string;
  product_name: string;
  price?: number | null;
  main_image_url?: string | null;
};

export default function ProductSearchBox({
  products,
  placeholder,
}: {
  products: SearchProduct[];
  placeholder?: string | null;
}) {
  const [query, setQuery] = useState("");
  const cleanQuery = query.trim();

  const results = useMemo(() => {
    const q = cleanQuery.toLowerCase();
    if (q.length < 2) return [];

    return products
      .filter((product) => product.product_name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [cleanQuery, products]);

  const searchHref = cleanQuery
    ? `/shop?search=${encodeURIComponent(cleanQuery)}`
    : "/shop";

  return (
    <div className="relative mx-auto mt-8 max-w-2xl">
      <div className="rounded-full border border-slate-200 bg-white p-2 shadow-2xl shadow-orange-100/70">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || ""}
            className="min-h-14 flex-1 rounded-full border border-transparent px-6 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-orange-200"
          />

          <Link
            href={searchHref}
            className="rounded-full bg-orange-500 px-8 py-4 text-center text-sm font-extrabold text-white shadow-lg shadow-orange-200 hover:bg-orange-600"
          >
            Search
          </Link>
        </div>
      </div>

      {cleanQuery.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden rounded-[28px] border border-slate-200 bg-white text-left shadow-2xl">
          {results.length > 0 ? (
            <>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-orange-50"
                >
                  <img
                    src={
                      product.main_image_url ||
                      "https://via.placeholder.com/120x120?text=Product"
                    }
                    alt={product.product_name}
                    className="h-14 w-14 rounded-2xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-950">
                      {product.product_name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-orange-600">
                      {product.price ? `$${product.price.toFixed(2)}` : "View deal"}
                    </p>
                  </div>
                </Link>
              ))}

              <Link
                href={searchHref}
                className="block border-t border-slate-100 px-5 py-4 text-center text-sm font-bold text-orange-600 hover:bg-orange-50"
              >
                View all results
              </Link>
            </>
          ) : (
            <div className="px-5 py-6 text-center text-sm font-bold text-slate-900">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
}