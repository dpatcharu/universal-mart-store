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
    .select(
      `
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
    `
    )
    .eq("page_key", "contact")
    .maybeSingle<SitePage>();

  const status = resolvedSearchParams.status;

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffefb_0%,#f6f3ee_45%,#ffffff_100%)] text-slate-900">
      <PublicHeader />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
              Contact
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">
              {contactPage?.title || "Contact Universal Mart"}
            </h1>

            <p className="mt-4 text-lg text-slate-600">
              {contactPage?.subtitle ||
                "Questions, product requests, or help finding the right item."}
            </p>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              {contactPage?.content ||
                "Get in touch with Universal Mart for product questions, seller support, or special requests."}
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="overflow-hidden rounded-[20px] bg-slate-100">
              <img
                src={
                  contactPage?.hero_image_url ||
                  "https://via.placeholder.com/1200x800?text=Contact+Universal+Mart"
                }
                alt={contactPage?.title || "Contact Universal Mart"}
                className="h-[280px] w-full object-cover md:h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6 md:pb-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">
                {contactPage?.section_1_title || "Product Questions"}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {contactPage?.section_1_body ||
                  "Ask about a listed item, compare products, or request more details."}
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">
                {contactPage?.section_2_title || "Request a Product"}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {contactPage?.section_2_body ||
                  "Looking for something specific? Send us a request."}
              </p>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">
                {contactPage?.section_3_title || "Seller Support"}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {contactPage?.section_3_body ||
                  "Use the form to connect with the seller."}
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              {contactPage?.form_title || "Send us a message"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {contactPage?.form_subtitle || "We’ll review your request and follow up."}
            </p>

            {status === "success" && (
              <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {contactPage?.form_success_message || "Your message was sent successfully."}
              </div>
            )}

            {status === "error" && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {contactPage?.form_error_message ||
                  "Something went wrong. Please fill all required fields and try again."}
              </div>
            )}

            <form action={submitContactRequest} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {contactPage?.form_name_label || "Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder={contactPage?.form_name_placeholder || "Your name"}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {contactPage?.form_email_label || "Email"}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder={contactPage?.form_email_placeholder || "you@example.com"}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {contactPage?.form_subject_label || "Subject"}
                </label>
                <input
                  type="text"
                  name="subject"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder={
                    contactPage?.form_subject_placeholder ||
                    "Product question, request, support..."
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  {contactPage?.form_message_label || "Message"}
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder={contactPage?.form_message_placeholder || "How can we help?"}
                />
              </div>

              <button
                type="submit"
                className="rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
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