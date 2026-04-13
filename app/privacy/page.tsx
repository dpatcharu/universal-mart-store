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
  section_4_title?: string | null;
  section_4_body?: string | null;
  section_5_body?: string | null;
  section_6_body?: string | null;
};

export default async function PrivacyPage() {
  const supabase = await createServerSupabase();

  const { data: privacyPage } = await supabase
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
      section_3_body,
      section_4_title,
      section_4_body,
      section_5_body,
      section_6_body
    `)
    .eq("page_key", "privacy")
    .maybeSingle<SitePage>();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffefb_0%,#f6f3ee_45%,#ffffff_100%)] text-slate-900">
      <PublicHeader />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
              {privacyPage?.badge || "Privacy & Disclosure"}
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">
              {privacyPage?.title || "Privacy & Affiliate Disclosure"}
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              {privacyPage?.subtitle ||
                "Transparency, privacy, and how our product links work."}
            </p>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              {privacyPage?.content ||
                "Universal Mart may earn a commission when customers click affiliate links and make purchases through supported sellers."}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="overflow-hidden rounded-[20px] bg-slate-100">
              <img
                src={
                  privacyPage?.hero_image_url ||
                  "https://via.placeholder.com/1200x800?text=Privacy+and+Disclosure"
                }
                alt={privacyPage?.title || "Privacy & Affiliate Disclosure"}
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
              {privacyPage?.section_1_title || "Affiliate Disclosure"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {privacyPage?.section_1_body ||
                "Some product links on Universal Mart are affiliate links. We may earn a commission at no extra cost to you."}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              {privacyPage?.section_2_title || "Privacy"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {privacyPage?.section_2_body ||
                "We only collect information customers voluntarily provide through forms and requests."}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              {privacyPage?.section_3_title || "Transparency"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              {privacyPage?.section_3_body ||
                "Our goal is to present curated products in a clear and trustworthy shopping experience."}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">
            {privacyPage?.section_4_title || "Additional Information"}
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">
            <p>
              {privacyPage?.section_4_body ||
                "Universal Mart may contain links to third-party seller websites. When you leave this site and continue to a seller or affiliate partner, their policies, pricing, and purchase terms apply."}
            </p>

            <p>
              {privacyPage?.section_5_body ||
                "We may update products, content, and link destinations over time as the storefront evolves. Customers should always review the final seller page before completing any purchase."}
            </p>

            <p>
              {privacyPage?.section_6_body ||
                "If you have questions about privacy, product listings, or affiliate links, please use the contact page to reach out."}
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}