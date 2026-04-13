import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: string;
  slug: string;
  product_name: string;
  price?: number | null;
  main_image_url?: string | null;
  affiliate_link: string;
  description?: string | null;
};

type SitePage = {
  title?: string;
  subtitle?: string;
  content?: string;
  cta_1_text?: string;
  cta_2_text?: string;
  section_1_title?: string;
  section_2_title?: string;
};

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalizedSlug = decodeURIComponent(slug).toLowerCase();

  const supabase = await createServerSupabase();

  const { data: product } = await supabase
    .from("products")
    .select("id, slug, product_name, price, main_image_url, affiliate_link, description")
    .ilike("slug", normalizedSlug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) {
    notFound();
  }

  const { data: relatedProducts } = await supabase
    .from("products")
    .select("id, slug, product_name, price, main_image_url, affiliate_link")
    .neq("id", product.id)
    .eq("is_active", true)
    .limit(4);

  const { data: page } = await supabase
    .from("site_pages")
    .select(`
      title,
      subtitle,
      content,
      cta_1_text,
      cta_2_text,
      section_1_title,
      section_2_title
    `)
    .eq("page_key", "product")
    .maybeSingle<SitePage>();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffefb_0%,#f6f3ee_45%,#ffffff_100%)] text-slate-900">
      <PublicHeader />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-6">
          <Link href="/shop" className="text-sm text-slate-500 hover:text-slate-900">
            {page?.subtitle || "← Back to Shop"}
          </Link>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="overflow-hidden rounded-[22px] bg-slate-100">
              <img
                src={
                  product.main_image_url ||
                  "https://via.placeholder.com/900x700?text=Universal+Mart"
                }
                alt={product.product_name}
                className="h-[320px] w-full object-cover md:h-[520px]"
              />
            </div>
          </div>

          <div>
            <div className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-sm">
              {page?.title || "Universal Mart Pick"}
            </div>

            <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              {product.product_name}
            </h1>

            <p className="mt-4 text-2xl font-semibold text-slate-700">
              {product.price ? `$${product.price}` : "See deal"}
            </p>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
              {product.description || page?.content}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={product.affiliate_link}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {page?.cta_1_text || "View Deal"}
              </a>

              <Link
                href="/contact"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                {page?.cta_2_text || "Ask About This Product"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 md:pb-16">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
            {page?.section_1_title || "More to Explore"}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {page?.section_2_title || "Related products"}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {(relatedProducts || []).map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}