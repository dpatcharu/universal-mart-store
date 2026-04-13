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
  searchParams?: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = (await searchParams) || {};
  const currentPage = Math.max(1, Number(resolvedSearchParams.page || "1") || 1);

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

  const { data: products, count } = await supabase
    .from("products")
    .select("id, slug, product_name, price, main_image_url, affiliate_link", {
      count: "exact",
    })
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
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

  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fffefb_0%,#f6f3ee_45%,#ffffff_100%)] text-slate-900">
      <PublicHeader />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-6">
          <Link href="/shop" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to Shop
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
              {page?.subtitle || "Products"}
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">
              {category.name}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              {page?.content || "Explore curated products in this category."}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {page?.cta_1_text || "Browse All Products"}
              </Link>

              <Link
                href="/contact"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                Ask About This Category
              </Link>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="overflow-hidden rounded-[20px] bg-slate-100">
              <img
                src={
                  category.image_url ||
                  products?.[0]?.main_image_url ||
                  "https://via.placeholder.com/1000x700?text=Universal+Mart"
                }
                alt={category.name}
                className="h-[260px] w-full object-cover md:h-[360px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 md:pb-16">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
              {page?.title || "Category"}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
              {category.name} picks
            </h2>
          </div>

          <div className="text-sm text-slate-500">
            <p>
              Showing {totalProducts === 0 ? 0 : from + 1}-{Math.min(from + PAGE_SIZE, totalProducts)} of {totalProducts}
            </p>
            <p className="mt-1 text-right">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={
                  currentPage > 1
                    ? `/category/${category.slug}?page=${currentPage - 1}`
                    : "#"
                }
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
                    href={`/category/${category.slug}?page=${pageNum}`}
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
                href={
                  currentPage < totalPages
                    ? `/category/${category.slug}?page=${currentPage + 1}`
                    : "#"
                }
                className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${
                  currentPage < totalPages
                    ? "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                    : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                }`}
              >
                Next
              </Link>
            </div>
          </>
        ) : (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900">
              {page?.section_1_title || "No products found"}
            </h3>
            <p className="mt-3 text-slate-600">
              {page?.section_1_body || "There are no active products in this category yet."}
            </p>

            <Link
              href="/shop"
              className="mt-6 inline-block rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
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