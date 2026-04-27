import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import ProductCard from "@/components/ProductCard";
import ProductImageGallery from "@/components/ProductImageGallery";

type Product = {
  id: string;
  slug: string;
  product_name: string;
  price?: number | null;
  main_image_url?: string | null;
  affiliate_link: string;
  description?: string | null;
};

type ProductImage = {
  id: string;
  image_url?: string | null;
  alt_text?: string | null;
  is_primary?: boolean | null;
  sort_order?: number | null;
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
    .select(
      "id, slug, product_name, price, main_image_url, affiliate_link, description"
    )
    .ilike("slug", normalizedSlug)
    .eq("is_active", true)
    .maybeSingle<Product>();

  if (!product) {
    notFound();
  }

  const { data: productImages } = await supabase
    .from("product_images")
    .select("id, image_url, alt_text, is_primary, sort_order")
    .eq("product_id", product.id)
    .order("is_primary", { ascending: false })
    .order("sort_order", { ascending: true });

  const galleryImages: ProductImage[] = [
    {
      id: "main",
      image_url: product.main_image_url,
      alt_text: product.product_name,
      is_primary: true,
      sort_order: 0,
    },
    ...(productImages || []),
  ].filter((image) => image.image_url);

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
    <main className="min-h-screen overflow-x-hidden bg-[#f5f5f7] text-slate-950">
      <PublicHeader />

      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.10),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f5f5f7_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
          <Link
            href="/shop"
            className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
          >
            {page?.subtitle || "← Back to Shop"}
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="rounded-[36px] border border-slate-200 bg-white p-4 shadow-sm">
            <ProductImageGallery images={galleryImages} />
          </div>

          <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:sticky lg:top-28">
            {page?.title && (
              <div className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-600">
                {page.title}
              </div>
            )}

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-950 md:text-5xl">
              {product.product_name}
            </h1>

            <div className="mt-5 rounded-[28px] border border-slate-200 bg-[#fbfbfd] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Price
              </p>
              <p className="mt-2 text-3xl font-black text-slate-950">
                {product.price ? `$${product.price.toFixed(2)}` : "See deal"}
              </p>
              <p className="mt-2 text-xs font-semibold text-slate-500">
                Price may change on partner website.
              </p>
            </div>

            {(product.description || page?.content) && (
              <p className="mt-6 text-base leading-8 text-slate-600">
                {product.description || page?.content}
              </p>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <a
                href={product.affiliate_link}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-orange-500 px-6 py-4 text-center text-sm font-extrabold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
              >
                {page?.cta_1_text || "View Deal"}
              </a>

              <Link
                href="/contact"
                className="rounded-full border border-slate-300 bg-white px-6 py-4 text-center text-sm font-bold text-slate-800 transition hover:border-orange-300 hover:text-orange-600"
              >
                {page?.cta_2_text || "Ask About This Product"}
              </Link>
            </div>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-600 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">Curated pick</div>
              <div className="rounded-2xl bg-slate-50 p-4">Affiliate deal</div>
              <div className="rounded-2xl bg-slate-50 p-4">No extra cost</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 md:pb-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            {page?.section_1_title && (
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
                {page.section_1_title}
              </p>
            )}

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              {page?.section_2_title || "Related products"}
            </h2>
          </div>

          <Link
            href="/shop"
            className="text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            View all products
          </Link>
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