import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import CategoryCarousel from "@/components/CategoryCarousel";
import ProductSearchBox from "@/components/ProductSearchBox";

type Product = {
  id: string;
  slug: string;
  product_name: string;
  price?: number | null;
  main_image_url?: string | null;
  affiliate_link: string;
  is_featured?: boolean;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
};

type SitePage = {
  page_key: string;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  hero_image_url?: string | null;
  cta_1_text?: string | null;
  cta_1_link?: string | null;
  cta_2_text?: string | null;
  cta_2_link?: string | null;
  search_placeholder?: string | null;
  featured_badge?: string | null;
  featured_title?: string | null;
  featured_cta_text?: string | null;
  featured_cta_link?: string | null;
  section_1_title?: string | null;
  section_1_body?: string | null;
  section_2_title?: string | null;
  section_2_body?: string | null;
  section_3_title?: string | null;
  section_3_body?: string | null;
};

export default async function Home() {
  const supabase = await createServerSupabase();

  const { data: homePage } = await supabase
    .from("site_pages")
    .select(`
      page_key,
      title,
      subtitle,
      content,
      hero_image_url,
      cta_1_text,
      cta_1_link,
      cta_2_text,
      cta_2_link,
      search_placeholder,
      featured_badge,
      featured_title,
      featured_cta_text,
      featured_cta_link,
      section_1_title,
      section_1_body,
      section_2_title,
      section_2_body,
      section_3_title,
      section_3_body
    `)
    .eq("page_key", "home")
    .maybeSingle<SitePage>();

  const { data: featuredProducts } = await supabase
    .from("products")
    .select(
      "id, slug, product_name, price, main_image_url, affiliate_link, is_featured"
    )
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(4);

  const { data: searchableProducts } = await supabase
    .from("products")
    .select("id, slug, product_name, price, main_image_url")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f5f7] text-slate-950">
      <PublicHeader />

      <section className="relative overflow-visible border-b border-slate-200 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.14),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f5f5f7_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center md:px-6 md:py-16">
          <div className="mx-auto max-w-4xl">
            {homePage?.subtitle && (
              <div className="inline-flex max-w-full rounded-full border border-orange-200 bg-white/90 px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-600 shadow-sm">
                <span className="truncate">{homePage.subtitle}</span>
              </div>
            )}

            <h1 className="mt-6 break-words text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl md:text-5xl">
              {homePage?.title}
            </h1>

            {homePage?.content && (
              <p className="mx-auto mt-6 max-w-2xl break-words text-base leading-8 text-slate-600 md:text-lg">
                {homePage.content}
              </p>
            )}

            <ProductSearchBox
              products={searchableProducts || []}
              placeholder={homePage?.search_placeholder}
            />

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {homePage?.cta_1_text && (
                <Link
                  href={homePage?.cta_1_link || "/shop"}
                  className="rounded-full bg-slate-950 px-7 py-4 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  {homePage.cta_1_text}
                </Link>
              )}

              {homePage?.cta_2_text && (
                <Link
                  href={homePage?.cta_2_link || "/about"}
                  className="rounded-full border border-slate-300 bg-white px-7 py-4 text-sm font-bold text-slate-800 transition hover:border-orange-300 hover:text-orange-600"
                >
                  {homePage.cta_2_text}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
              Shop by Category
            </p>
          </div>

          <Link
            href="/shop"
            className="hidden text-sm font-bold text-orange-600 hover:text-orange-700 sm:block"
          >
            View all
          </Link>
        </div>

        <CategoryCarousel categories={categories || []} />
      </section>

      <section
        id="featured"
        className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16"
      >
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            {homePage?.featured_badge && (
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
                {homePage.featured_badge}
              </p>
            )}

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
              {homePage?.featured_title}
            </h2>
          </div>

          {homePage?.featured_cta_text && (
            <Link
              href={homePage?.featured_cta_link || "/shop"}
              className="text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              {homePage.featured_cta_text}
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {(featuredProducts || []).map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-14 md:grid-cols-3 md:px-6">
          {[
            {
              title: homePage?.section_1_title,
              body: homePage?.section_1_body,
            },
            {
              title: homePage?.section_2_title,
              body: homePage?.section_2_body,
            },
            {
              title: homePage?.section_3_title,
              body: homePage?.section_3_body,
            },
          ]
            .filter((item) => item.title || item.body)
            .map((item, index) => (
              <div
                key={index}
                className="rounded-[32px] border border-slate-200 bg-[#fbfbfd] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {item.title && (
                  <h3 className="text-2xl font-black tracking-tight text-slate-950">
                    {item.title}
                  </h3>
                )}

                {item.body && (
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {item.body}
                  </p>
                )}
              </div>
            ))}
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}