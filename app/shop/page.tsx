import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import ProductSearchBox from "@/components/ProductSearchBox";

type Product = {
  id: string;
  slug: string;
  product_name: string;
  price?: number | null;
  main_image_url?: string | null;
  affiliate_link: string;
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

type SitePage = {
  page_key: string;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  search_placeholder?: string | null;
  cta_1_text?: string | null;
};

const PAGE_SIZE = 12;

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    sort?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}) {
  const params = (await searchParams) || {};

  const currentPage = Math.max(1, Number(params.page || "1") || 1);
  const searchQuery = (params.search || "").trim();
  const sort = params.sort || "newest";
  const selectedCategory = params.category || "";
  const minPrice = params.minPrice ? Number(params.minPrice) : null;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : null;

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createServerSupabase();

  const { data: shopPage } = await supabase
    .from("site_pages")
    .select(`
      page_key,
      title,
      subtitle,
      content,
      search_placeholder,
      cta_1_text
    `)
    .eq("page_key", "shop")
    .maybeSingle<SitePage>();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  let productQuery = supabase
    .from("products")
    .select("id, slug, product_name, price, main_image_url, affiliate_link", {
      count: "exact",
    })
    .eq("is_active", true);

  if (searchQuery) {
    productQuery = productQuery.ilike("product_name", `%${searchQuery}%`);
  }

  if (selectedCategory) {
    productQuery = productQuery.eq("category_id", selectedCategory);
  }

  if (minPrice !== null) {
    productQuery = productQuery.gte("price", minPrice);
  }

  if (maxPrice !== null) {
    productQuery = productQuery.lte("price", maxPrice);
  }

  if (sort === "oldest") {
    productQuery = productQuery.order("created_at", { ascending: true });
  } else if (sort === "price-low") {
    productQuery = productQuery.order("price", { ascending: true });
  } else if (sort === "price-high") {
    productQuery = productQuery.order("price", { ascending: false });
  } else {
    productQuery = productQuery.order("created_at", { ascending: false });
  }

  const { data: products, count } = await productQuery.range(from, to);

  const { data: searchableProducts } = await supabase
    .from("products")
    .select("id, slug, product_name, price, main_image_url")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(150);

  const totalProducts = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));

  const buildHref = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams();

    if (searchQuery) next.set("search", searchQuery);
    if (sort) next.set("sort", sort);
    if (selectedCategory) next.set("category", selectedCategory);
    if (minPrice !== null) next.set("minPrice", String(minPrice));
    if (maxPrice !== null) next.set("maxPrice", String(maxPrice));

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) next.delete(key);
      else next.set(key, value);
    });

    if (updates.page === null) next.delete("page");

    const query = next.toString();
    return query ? `/shop?${query}` : "/shop";
  };

  const priceFilters = [
    { label: "All prices", min: null, max: null },
    { label: "Under $25", min: null, max: "25" },
    { label: "$25 - $50", min: "25", max: "50" },
    { label: "$50 - $100", min: "50", max: "100" },
    { label: "$100+", min: "100", max: null },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f5f7] text-slate-950">
      <PublicHeader />

      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_35%),linear-gradient(180deg,#ffffff_0%,#f5f5f7_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center md:px-6 md:py-16">
          {shopPage?.subtitle && (
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
              {shopPage.subtitle}
            </p>
          )}

          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            {shopPage?.title}
          </h1>

          {shopPage?.content && (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {shopPage.content}
            </p>
          )}

          <ProductSearchBox
            products={searchableProducts || []}
            placeholder={shopPage?.search_placeholder}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-black">Filters</h2>
              <Link href="/shop" className="text-xs font-bold text-orange-600">
                Clear
              </Link>
            </div>

            <div className="border-t border-slate-100 py-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Sort by
              </p>

              <div className="space-y-2">
                {[
                  ["Newest", "newest"],
                  ["Oldest", "oldest"],
                  ["Price: Low to High", "price-low"],
                  ["Price: High to Low", "price-high"],
                ].map(([label, value]) => (
                  <Link
                    key={value}
                    href={buildHref({ sort: value, page: null })}
                    className={`block rounded-2xl px-4 py-3 text-sm font-bold transition ${
                      sort === value
                        ? "bg-orange-500 text-white"
                        : "bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 py-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Categories
              </p>

              <div className="space-y-2">
                <Link
                  href={buildHref({ category: null, page: null })}
                  className={`block rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    !selectedCategory
                      ? "bg-slate-950 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  All
                </Link>

              {(categories || []).map((item) => (
                <Link
                  key={item.id}
                  href={buildHref({ category: item.id, page: null })}
                  className={`block rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    selectedCategory === item.id
                      ? "bg-orange-500 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Price
              </p>
                <form action="/shop" className="mb-4 space-y-3">
                  {searchQuery && <input type="hidden" name="search" value={searchQuery} />}
                  {sort && <input type="hidden" name="sort" value={sort} />}
                  {selectedCategory && (
                    <input type="hidden" name="category" value={selectedCategory} />
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      min="0"
                      step="0.01"
                      defaultValue={minPrice ?? ""}
                      placeholder="Min"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-orange-300"
                    />

                    <input
                      type="number"
                      name="maxPrice"
                      min="0"
                      step="0.01"
                      defaultValue={maxPrice ?? ""}
                      placeholder="Max"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-orange-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                  >
                    Apply Price
                  </button>
                </form>
              <div className="space-y-2">
                {priceFilters.map((item) => {
                  const active =
                    String(minPrice ?? "") === String(item.min ?? "") &&
                    String(maxPrice ?? "") === String(item.max ?? "");

                  return (
                    <Link
                      key={item.label}
                      href={buildHref({
                        minPrice: item.min,
                        maxPrice: item.max,
                        page: null,
                      })}
                      className={`block rounded-2xl px-4 py-3 text-sm font-bold transition ${
                        active
                          ? "bg-orange-500 text-white"
                          : "bg-slate-50 text-slate-700 hover:bg-orange-50 hover:text-orange-600"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-semibold text-slate-600">
                Showing{" "}
                <span className="font-black text-slate-950">
                  {totalProducts === 0 ? 0 : from + 1}-
                  {Math.min(from + PAGE_SIZE, totalProducts)}
                </span>{" "}
                of{" "}
                <span className="font-black text-slate-950">
                  {totalProducts}
                </span>{" "}
                products
              </p>

              <p className="text-sm font-semibold text-slate-500">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
                <h2 className="text-2xl font-black text-slate-950">
                  No products found
                </h2>
                <p className="mt-3 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600"
                >
                  View all products
                </Link>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={currentPage > 1 ? buildHref({ page: String(currentPage - 1) }) : "#"}
                  className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                    currentPage > 1
                      ? "border border-slate-300 bg-white text-slate-800 hover:border-orange-300 hover:text-orange-600"
                      : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  Previous
                </Link>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
                  .map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={buildHref({ page: pageNum === 1 ? null : String(pageNum) })}
                      className={`rounded-full px-4 py-3 text-sm font-bold transition ${
                        pageNum === currentPage
                          ? "bg-orange-500 text-white"
                          : "border border-slate-300 bg-white text-slate-800 hover:border-orange-300 hover:text-orange-600"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ))}

                <Link
                  href={
                    currentPage < totalPages
                      ? buildHref({ page: String(currentPage + 1) })
                      : "#"
                  }
                  className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                    currentPage < totalPages
                      ? "border border-slate-300 bg-white text-slate-800 hover:border-orange-300 hover:text-orange-600"
                      : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  Next
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}