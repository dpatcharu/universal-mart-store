import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

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
  searchParams?: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page || "1") || 1);

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

  const { data: products, count } = await supabase
    .from("products")
    .select("id, slug, product_name, price, main_image_url, affiliate_link", {
      count: "exact",
    })
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  const totalProducts = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));

  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fffefb_0%,#f6f3ee_45%,#ffffff_100%)] text-slate-900">
      <PublicHeader />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
            {shopPage?.subtitle || "Shop"}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
            {shopPage?.title || "Explore all products"}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
            {shopPage?.content ||
              "Browse all active products in a clean, responsive shopping layout."}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
          <input
            type="text"
            placeholder={
              shopPage?.search_placeholder ||
              "Search products, brands, categories..."
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          <button
            type="button"
            className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            {shopPage?.cta_1_text || "Search"}
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-black hover:text-white"
          >
            All
          </Link>

          {(categories || []).map((item: Category) => (
            <Link
              key={item.id}
              href={`/category/${item.slug}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-black hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
          <p>
            Showing {from + 1}-{Math.min(from + PAGE_SIZE, totalProducts)} of {totalProducts} products
          </p>
          <p>
            Page {currentPage} of {totalPages}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {(products || []).map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={currentPage > 1 ? `/shop?page=${currentPage - 1}` : "#"}
            className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${
              currentPage > 1
                ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
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
                href={`/shop?page=${pageNum}`}
                className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  pageNum === currentPage
                    ? "bg-black text-white"
                    : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                }`}
              >
                {pageNum}
              </Link>
            ))}

          <Link
            href={currentPage < totalPages ? `/shop?page=${currentPage + 1}` : "#"}
            className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${
              currentPage < totalPages
                ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
            }`}
          >
            Next
          </Link>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}