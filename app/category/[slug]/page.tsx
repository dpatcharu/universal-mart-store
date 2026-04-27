import Link from "next/link";
import { notFound } from "next/navigation";
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
  image_url?: string | null;
};

type SitePage = {
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  cta_1_text?: string | null;
  section_1_title?: string | null;
  section_1_body?: string | null;
};

const PAGE_SIZE = 12;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ page?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = (await searchParams) || {};

  const currentPage = Math.max(1, Number(resolvedSearchParams.page || "1") || 1);
  const sort = resolvedSearchParams.sort || "newest";

  const normalizedSlug = decodeURIComponent(slug).toLowerCase();
  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createServerSupabase();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .eq("slug", normalizedSlug)
    .eq("is_active", true)
    .maybeSingle<Category>();

  if (!category) {
    notFound();
  }

  let productQuery = supabase
    .from("products")
    .select("id, slug, product_name, price, main_image_url, affiliate_link", {
      count: "exact",
    })
    .eq("category_id", category.id)
    .eq("is_active", true);

  if (sort === "oldest") {
    productQuery = productQuery.order("created_at", { ascending: true });
  } else if (sort === "price-low") {
    productQuery = productQuery.order("price", { ascending: true });
  } else if (sort === "price-high") {
    productQuery = productQuery.order("price", { ascending: false });
  } else {
    productQuery = productQuery.order("created_at", { ascending: false });
  }

  const { data: products, count } = await productQuery
    .range(from, to)
    .returns<Product[]>();

  const { data: page } = await supabase
    .from("site_pages")
    .select(`
      title,
      subtitle,
      content,
      cta_1_text,
      section_1_title,
      section_1_body
    `)
    .eq("page_key", "category")
    .maybeSingle<SitePage>();

  const totalProducts = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));

  const buildHref = (pageNum: number) => {
    const params = new URLSearchParams();

    if (pageNum > 1) params.set("page", String(pageNum));
    if (sort && sort !== "newest") params.set("sort", sort);

    const query = params.toString();
    return query ? `/category/${category.slug}?${query}` : `/category/${category.slug}`;
  };

  const buildSortHref = (nextSort: string) => {
    const params = new URLSearchParams();

    if (nextSort && nextSort !== "newest") params.set("sort", nextSort);

    const query = params.toString();
    return query ? `/category/${category.slug}?${query}` : `/category/${category.slug}`;
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f5f7] text-slate-950">
      <PublicHeader />

      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_35%),linear-gradient(180deg,#ffffff_0%,#f5f5f7_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <Link
            href="/shop"
            className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
          >
            ← Back to Shop
          </Link>

          <div className="mt-8 grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
                {page?.subtitle || "Products"}
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">
                {category.name}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                {page?.content || "Explore curated products in this category."}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="rounded-full bg-orange-500 px-7 py-4 text-sm font-extrabold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
                >
                  {page?.cta_1_text || "Browse All Products"}
                </Link>

                <Link
                  href="/contact"
                  className="rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-bold text-slate-800 transition hover:border-orange-300 hover:text-orange-600"
                >
                  Ask About This Category
                </Link>
              </div>
            </div>

            <div className="rounded-[36px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="overflow-hidden rounded-[28px] bg-slate-100">
                <img
                  src={
                    category.image_url ||
                    products?.[0]?.main_image_url ||
                    "https://via.placeholder.com/1000x700?text=Universal+Mart"
                  }
                  alt={category.name}
                  className="h-[260px] w-full object-cover md:h-[380px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8 flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            {page?.title && (
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
                {page.title}
              </p>
            )}

            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">
              {category.name} picks
            </h2>

            <p className="mt-2 text-sm font-semibold text-slate-500">
              Showing{" "}
              <span className="font-black text-slate-950">
                {totalProducts === 0 ? 0 : from + 1}-
                {Math.min(from + PAGE_SIZE, totalProducts)}
              </span>{" "}
              of <span className="font-black text-slate-950">{totalProducts}</span>{" "}
              products
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <p className="text-sm font-bold text-slate-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex flex-wrap gap-2">
              {[
                ["Newest", "newest"],
                ["Oldest", "oldest"],
                ["Price: Low", "price-low"],
                ["Price: High", "price-high"],
              ].map(([label, value]) => (
                <Link
                  key={value}
                  href={buildSortHref(value)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    sort === value
                      ? "bg-orange-500 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={currentPage > 1 ? buildHref(currentPage - 1) : "#"}
                  className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                    currentPage > 1
                      ? "border border-slate-300 bg-white text-slate-800 hover:border-orange-300 hover:text-orange-600"
                      : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  Previous
                </Link>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(
                    Math.max(0, currentPage - 3),
                    Math.min(totalPages, currentPage + 2)
                  )
                  .map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={buildHref(pageNum)}
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
                  href={currentPage < totalPages ? buildHref(currentPage + 1) : "#"}
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
          </>
        ) : (
          <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h3 className="text-2xl font-black text-slate-950">
              {page?.section_1_title || "No products found"}
            </h3>

            <p className="mt-3 text-slate-600">
              {page?.section_1_body ||
                "There are no active products in this category yet."}
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              {page?.cta_1_text || "Browse All Products"}
            </Link>
          </div>
        )}
      </section>

      <PublicFooter />
    </main>
  );
}