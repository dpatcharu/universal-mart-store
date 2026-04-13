import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import CategoryCarousel from "@/components/CategoryCarousel";
import ShoppingAssistantPanel from "@/components/ShoppingAssistantPanel";

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
  assistant_badge?: string | null;
  assistant_title?: string | null;
  assistant_body?: string | null;
  assistant_categories_label?: string | null;
  assistant_products_label?: string | null;
  assistant_cta_1_text?: string | null;
  assistant_cta_1_link?: string | null;
  assistant_cta_2_text?: string | null;
  assistant_cta_2_link?: string | null;
  assistant_icon_url?: string | null;
};

export default async function Home() {
  const supabase =  await createServerSupabase();

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
      section_3_body,
      assistant_badge,
      assistant_title,
      assistant_body,
      assistant_categories_label,
      assistant_products_label,
      assistant_cta_1_text,
      assistant_cta_1_link,
      assistant_cta_2_text,
      assistant_cta_2_link,
      assistant_icon_url
    `)
    .eq("page_key", "home")
    .maybeSingle<SitePage>();

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("id, slug, product_name, price, main_image_url, affiliate_link, is_featured")
    .eq("is_active", true)
    .eq("is_featured", true)
    .limit(4);

  const { data: suggestedProducts } = await supabase
    .from("products")
    .select("id, slug, product_name")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .eq("is_active", true)
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fffefb_0%,#f6f3ee_45%,#ffffff_100%)] text-slate-900">
      <PublicHeader />

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-16">
        <div className="grid gap-10 overflow-hidden md:grid-cols-2 md:items-center">
          <div className="min-w-0 max-w-2xl overflow-hidden">
            <div className="inline-flex max-w-full rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-sm md:text-sm">
              <span className="truncate">
                {homePage?.subtitle}
              </span>
            </div>

            <h1 className="mt-5 max-w-full break-words text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-6xl">
              {homePage?.title}
            </h1>

            <p className="mt-5 max-w-full break-words text-base leading-7 text-slate-600 md:text-lg">
              {homePage?.content}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={homePage?.cta_1_link || "/shop"}
                className="rounded-2xl bg-black px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-800"
              >
                {homePage?.cta_1_text}
              </Link>

              <Link
                href={homePage?.cta_2_link || "/about"}
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-center text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                {homePage?.cta_2_text}
              </Link>
            </div>

            <div className="mt-7 max-w-full">
              <div className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
                <input
                  type="text"
                  placeholder={homePage?.search_placeholder || ""}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
                <Link
                  href="/shop"
                  className="w-full rounded-2xl bg-black px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Search
                </Link>
              </div>
            </div>

            <div className="mt-7 min-w-0">
              <p className="mb-3 text-sm uppercase tracking-[0.25em] text-slate-400">
                Shop by Category
              </p>

              <CategoryCarousel categories={categories || []} />
            </div>
          </div>

          <ShoppingAssistantPanel
            categories={categories || []}
            suggestedProducts={suggestedProducts || []}
            content={homePage}
          />
        </div>
      </section>

      <section
        id="featured"
        className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16"
      >
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
              {homePage?.featured_badge}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
              {homePage?.featured_title}
            </h2>
          </div>

          <Link
            href={homePage?.featured_cta_link || "/shop"}
            className="text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            {homePage?.featured_cta_text}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {(featuredProducts || []).map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(246,244,238,0.84))]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-3 md:px-6 md:py-14">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">
              {homePage?.section_1_title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {homePage?.section_1_body}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">
              {homePage?.section_2_title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {homePage?.section_2_body}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold">
              {homePage?.section_3_title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {homePage?.section_3_body}
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}