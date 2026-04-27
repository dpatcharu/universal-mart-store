import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { createServerSupabase } from "@/lib/supabase/server";
import { submitContactRequest } from "./actions";

type SitePage = {
  page_key: string;
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
  form_title?: string | null;
  form_subtitle?: string | null;
  form_success_message?: string | null;
  form_error_message?: string | null;
  form_name_label?: string | null;
  form_email_label?: string | null;
  form_subject_label?: string | null;
  form_message_label?: string | null;
  form_name_placeholder?: string | null;
  form_email_placeholder?: string | null;
  form_subject_placeholder?: string | null;
  form_message_placeholder?: string | null;
  form_submit_text?: string | null;
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const resolvedSearchParams = (await searchParams) || {};
  const supabase = await createServerSupabase();

  const { data: contactPage } = await supabase
    .from("site_pages")
    .select(`
      page_key,
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
      form_title,
      form_subtitle,
      form_success_message,
      form_error_message,
      form_name_label,
      form_email_label,
      form_subject_label,
      form_message_label,
      form_name_placeholder,
      form_email_placeholder,
      form_subject_placeholder,
      form_message_placeholder,
      form_submit_text
    `)
    .eq("page_key", "contact")
    .maybeSingle<SitePage>();

  const status = resolvedSearchParams.status;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f5f5f7] text-slate-950">
      <PublicHeader />

      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_35%),linear-gradient(180deg,#ffffff_0%,#f5f5f7_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center md:px-6 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
            Contact
          </p>

          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
            {contactPage?.title || "Contact Universal Mart"}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            {contactPage?.subtitle ||
              "Questions, product requests, or help finding the right item."}
          </p>

          {contactPage?.content && (
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-slate-500 md:text-base">
              {contactPage.content}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            {contactPage?.hero_image_url && (
              <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white p-4 shadow-sm">
                <img
                  src={contactPage.hero_image_url}
                  alt={contactPage?.title || "Contact Universal Mart"}
                  className="h-[280px] w-full rounded-[28px] object-cover md:h-[360px]"
                />
              </div>
            )}

            {[
              {
                title: contactPage?.section_1_title || "Product Questions",
                body:
                  contactPage?.section_1_body ||
                  "Ask about a listed item, compare products, or request more details.",
              },
              {
                title: contactPage?.section_2_title || "Request a Product",
                body:
                  contactPage?.section_2_body ||
                  "Looking for something specific? Send us a request.",
              },
              {
                title: contactPage?.section_3_title || "Seller Support",
                body:
                  contactPage?.section_3_body ||
                  "Use the form to connect with the seller.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h2 className="text-xl font-black text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:sticky lg:top-28">
            <h2 className="text-3xl font-black tracking-tight text-slate-950">
              {contactPage?.form_title || "Send us a message"}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {contactPage?.form_subtitle ||
                "We’ll review your request and follow up."}
            </p>

            {status === "success" && (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {contactPage?.form_success_message ||
                  "Your message was sent successfully."}
              </div>
            )}

            {status === "error" && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {contactPage?.form_error_message ||
                  "Something went wrong. Please fill all required fields and try again."}
              </div>
            )}

            <form action={submitContactRequest} className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {contactPage?.form_name_label || "Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  placeholder={contactPage?.form_name_placeholder || "Your name"}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {contactPage?.form_email_label || "Email"}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  placeholder={
                    contactPage?.form_email_placeholder || "you@example.com"
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {contactPage?.form_subject_label || "Subject"}
                </label>
                <input
                  type="text"
                  name="subject"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  placeholder={
                    contactPage?.form_subject_placeholder ||
                    "Product question, request, support..."
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  {contactPage?.form_message_label || "Message"}
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-300 focus:bg-white"
                  placeholder={
                    contactPage?.form_message_placeholder || "How can we help?"
                  }
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-orange-500 px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
              >
                {contactPage?.form_submit_text || "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}