import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Product = {
  id: string;
  slug: string;
  product_name: string;
};

type AssistantContent = {
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

export default function ShoppingAssistantPanel({
  categories,
  suggestedProducts,
  content,
}: {
  categories: Category[];
  suggestedProducts: Product[];
  content: AssistantContent | null;
}) {
  return (
    <div className="hidden md:block min-w-0">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-[24px] bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] p-5">
          <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <img
              src={content?.assistant_icon_url || "https://ui-avatars.com/api/?name=Universal+Mart&background=000000&color=ffffff&size=100"}
              alt="Shopping Assistant"
              className="h-full w-full object-contain p-2"
            />
          </div>

            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                {content?.assistant_badge}
              </p>

              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                {content?.assistant_title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {content?.assistant_body}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {content?.assistant_categories_label}
            </p>

            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-black hover:text-white"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {content?.assistant_products_label}
            </p>

            <div className="space-y-3">
              {suggestedProducts.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  {product.product_name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href={content?.assistant_cta_1_link || "/shop"}
              className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              {content?.assistant_cta_1_text}
            </Link>

            <Link
              href={content?.assistant_cta_2_link || "/contact"}
              className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              {content?.assistant_cta_2_text}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}