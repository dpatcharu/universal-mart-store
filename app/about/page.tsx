import { createServerSupabase } from "@/lib/supabase/server";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";

type SitePage = {
  page_key: string;
  badge?: string | null;
  title?: string | null;
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

  const sections = [
    {
      title: aboutPage?.section_1_title,
      body: aboutPage?.section_1_body,
    },
    {
      title: aboutPage?.section_2_title,
      body: aboutPage?.section_2_body,
    },
    {
      title: aboutPage?.section_3_title,
      body: aboutPage?.section_3_body,
    },
  ].filter((item) => item.title || item.body);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f5f7] text-slate-950">
      <PublicHeader />

      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.16),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f5f5f7_100%)]">
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:items-center md:px-6 md:py-24">
          <div>
            {aboutPage?.badge && (
              <p className="inline-flex rounded-full border border-orange-200 bg-white/80 px-5 py-2 text-xs font-black uppercase tracking-[0.22em] text-orange-600 shadow-sm">
                {aboutPage.badge}
              </p>
            )}

            {aboutPage?.title && (
              <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-tight text-slate-950 md:text-7xl">
                {aboutPage.title}
              </h1>
            )}

            {aboutPage?.subtitle && (
              <p className="mt-6 text-xl font-bold leading-8 text-slate-700">
                {aboutPage.subtitle}
              </p>
            )}

            {aboutPage?.content && (
              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                {aboutPage.content}
              </p>
            )}
          </div>

          {aboutPage?.hero_image_url && (
            <div className="relative">
              <div className="absolute -inset-4 rounded-[44px] bg-gradient-to-br from-orange-200/50 to-white blur-xl" />

              <div className="relative overflow-hidden rounded-[40px] border border-white bg-white p-4 shadow-2xl shadow-slate-200">
                <img
                  src={aboutPage.hero_image_url}
                  alt={aboutPage?.title || ""}
                  className="h-[320px] w-full rounded-[30px] object-cover md:h-[520px]"
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {sections.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {sections.map((item, index) => (
              <div
                key={index}
                className="group rounded-[36px] border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-lg font-black text-orange-600 transition group-hover:bg-orange-500 group-hover:text-white">
                  {index + 1}
                </div>

                {item.title && (
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    {item.title}
                  </h2>
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
      )}

      <PublicFooter />
    </main>
  );
}