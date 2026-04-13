import { createServerSupabase } from "@/lib/supabase/server";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

type SitePage = {
  page_key: string;
  badge?: string | null;
  title: string;
  subtitle?: string | null;
  content?: string | null;
  hero_image_url?: string | null;
  section_1_title?: string | null;
  section_1_body?: string | null;
  section_2_title?: string | null;
  section_2_body?: string | null;
  section_3_title?: string | null;
  section_3_body?: string | null;
};

export default async function AboutPage() {
  const supabase = await createServerSupabase();

  const { data: aboutPage } = await supabase
    .from("site_pages")
    .select(`
      page_key,
      badge,
      title,
      subtitle,
      content,
      hero_image_url,
      section_1_title,
      section_1_body,
      section_2_title,
      section_2_body,
      section_3_title,
      section_3_body
    `)
    .eq("page_key", "about")
    .maybeSingle<SitePage>();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffefb_0%,#f6f3ee_45%,#ffffff_100%)] text-slate-900">
      <PublicHeader />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
              {aboutPage?.badge || "About"}
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">
              {aboutPage?.title || "About Universal Mart"}
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              {aboutPage?.subtitle || "Curated finds. Better deals. Smarter shopping."}
            </p>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              {aboutPage?.content ||
                "Universal Mart helps customers discover selected products in a clean, modern, and trustworthy shopping experience."}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="overflow-hidden rounded-[20px] bg-slate-100">
              <img
                src={
                  aboutPage?.hero_image_url ||
                  "https://via.placeholder.com/1200x800?text=Universal+Mart"
                }
                alt={aboutPage?.title || "About Universal Mart"}
                className="h-[280px] w-full object-cover md:h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 md:pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              {aboutPage?.section_1_title || "Curated Shopping"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {aboutPage?.section_1_body ||
                "We focus on presenting selected products in a clean and simple format so customers can browse with confidence."}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              {aboutPage?.section_2_title || "Trust & Simplicity"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {aboutPage?.section_2_body ||
                "The goal is to make affiliate shopping feel transparent, polished, and easy to use across devices."}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              {aboutPage?.section_3_title || "Built to Grow"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {aboutPage?.section_3_body ||
                "This platform is designed so the seller can manage and update content later from the admin portal."}
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}