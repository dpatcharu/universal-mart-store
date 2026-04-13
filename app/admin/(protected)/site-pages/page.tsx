import AdminAccordion from "@/components/AdminAccordion";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdminUser, hasReadWriteAccess } from "@/lib/admin-auth";
import { updateSitePage } from "./actions";

type SitePage = {
  id: string;
  page_key: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
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
  cta_1_text?: string | null;
  cta_1_link?: string | null;
  cta_2_text?: string | null;
  cta_2_link?: string | null;
  search_placeholder?: string | null;
  featured_badge?: string | null;
  featured_title?: string | null;
  featured_cta_text?: string | null;
  featured_cta_link?: string | null;
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
  badge?: string | null;
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

const FIELD_GROUPS = {
  basic: ["page_key", "badge"] as const,
  hero: ["title", "subtitle", "content", "hero_image_url", "search_placeholder"] as const,
  cta: ["cta_1_text", "cta_1_link", "cta_2_text", "cta_2_link"] as const,
  sections: [
    "section_1_title",
    "section_1_body",
    "section_2_title",
    "section_2_body",
    "section_3_title",
    "section_3_body",
    "section_4_title",
    "section_4_body",
    "section_5_body",
    "section_6_body",
  ] as const,
  featured: [
    "featured_badge",
    "featured_title",
    "featured_cta_text",
    "featured_cta_link",
  ] as const,
  form: [
    "form_title",
    "form_subtitle",
    "form_success_message",
    "form_error_message",
    "form_name_label",
    "form_email_label",
    "form_subject_label",
    "form_message_label",
    "form_name_placeholder",
    "form_email_placeholder",
    "form_subject_placeholder",
    "form_message_placeholder",
    "form_submit_text",
  ] as const,
  assistant: [
    "assistant_badge",
    "assistant_title",
    "assistant_body",
    "assistant_categories_label",
    "assistant_products_label",
    "assistant_cta_1_text",
    "assistant_cta_1_link",
    "assistant_cta_2_text",
    "assistant_cta_2_link",
    "assistant_icon_url",
  ] as const,
};

function hasValues(
  page: SitePage,
  fields: readonly (keyof SitePage)[]
) {
  return fields.some((field) => {
    const value = page[field];
    return value !== null && value !== undefined && String(value).trim() !== "";
  });
}

function renderField(field: keyof SitePage, value: SitePage[keyof SitePage]) {
  if (field === "page_key") {
    return null;
  }

  const label = field
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const stringValue = value ?? "";

  const isLongText =
    String(field).includes("_body") ||
    String(field).includes("content") ||
    String(field).includes("_message");

  return (
    <div key={String(field)}>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {isLongText ? (
        <textarea
          name={String(field)}
          defaultValue={String(stringValue)}
          rows={4}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />
      ) : (
        <input
          name={String(field)}
          defaultValue={String(stringValue)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
        />
      )}
    </div>
  );
}

export default async function AdminSitePagesPage() {
  const supabase = await createServerSupabase();
const adminUser = await getCurrentAdminUser();

if (!adminUser) {
  throw new Error("UNAUTHORIZED");
}

const isAdmin = adminUser.access_level === "full_admin";

const canEdit =
  adminUser.access_level === "read_write" || isAdmin;

  const { data, error } = await supabase
    .from("site_pages")
    .select("*")
    .order("page_key", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const pages = (data || []) as SitePage[];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
          Site Pages
        </p>
        <h2 className="mt-2 text-3xl font-semibold">
          Manage site content
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Expand each section and edit only the fields that currently have values.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
        {pages.map((page) => (
          <div
            key={page.id}
            className="border-b border-slate-100 p-6 last:border-b-0"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                {page.page_key.toUpperCase()}
              </h3>
            </div>

            {canEdit ? (
              <form action={updateSitePage} className="space-y-4">
                <input type="hidden" name="id" value={page.id} />

                {hasValues(page, FIELD_GROUPS.basic) && (
                  <AdminAccordion title="Basic">
                    <div className="grid gap-4 md:grid-cols-2">
                      {FIELD_GROUPS.basic.map((field) =>
                        renderField(field, page[field])
                      )}
                    </div>
                  </AdminAccordion>
                )}

                {hasValues(page, FIELD_GROUPS.hero) && (
                  <AdminAccordion title="Hero Section">
                    <div className="grid gap-4 md:grid-cols-2">
                      {FIELD_GROUPS.hero.map((field) =>
                        renderField(field, page[field])
                      )}
                    </div>
                  </AdminAccordion>
                )}

                {hasValues(page, FIELD_GROUPS.cta) && (
                  <AdminAccordion title="CTA Buttons">
                    <div className="grid gap-4 md:grid-cols-2">
                      {FIELD_GROUPS.cta.map((field) =>
                        renderField(field, page[field])
                      )}
                    </div>
                  </AdminAccordion>
                )}

                {hasValues(page, FIELD_GROUPS.sections) && (
                  <AdminAccordion title="Content Sections">
                    <div className="grid gap-4 md:grid-cols-2">
                      {FIELD_GROUPS.sections.map((field) =>
                        renderField(field, page[field])
                      )}
                    </div>
                  </AdminAccordion>
                )}

                {hasValues(page, FIELD_GROUPS.featured) && (
                  <AdminAccordion title="Featured Section">
                    <div className="grid gap-4 md:grid-cols-2">
                      {FIELD_GROUPS.featured.map((field) =>
                        renderField(field, page[field])
                      )}
                    </div>
                  </AdminAccordion>
                )}

                {hasValues(page, FIELD_GROUPS.form) && (
                  <AdminAccordion title="Form Section">
                    <div className="grid gap-4 md:grid-cols-2">
                      {FIELD_GROUPS.form.map((field) =>
                        renderField(field, page[field])
                      )}
                    </div>
                  </AdminAccordion>
                )}

                {hasValues(page, FIELD_GROUPS.assistant) && (
                  <AdminAccordion title="Assistant Section">
                    <div className="grid gap-4 md:grid-cols-2">
                      {FIELD_GROUPS.assistant.map((field) =>
                        renderField(field, page[field])
                      )}
                    </div>
                  </AdminAccordion>
                )}

                <div>
                  <button
                    type="submit"
                    className="rounded-xl bg-black px-5 py-2 text-white"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-gray-500">
                Read-only access
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}