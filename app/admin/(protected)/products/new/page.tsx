import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdminUser, hasReadWriteAccess } from "@/lib/admin-auth";
import { createProduct } from "./actions";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export default async function AdminNewProductPage() {
  const supabase = await createServerSupabase();
  const adminUser = await getCurrentAdminUser();

  if (!adminUser || !hasReadWriteAccess(adminUser.access_level)) {
    throw new Error("UNAUTHORIZED_PAGE");
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true })
    .returns<CategoryOption[]>();

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
            Products
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Add product
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Create a new product entry for the store.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
        >
          Back to Products
        </Link>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <form action={createProduct} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Product Name
            </label>
            <input
              type="text"
              name="product_name"
              required
              placeholder="Enter product name"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              placeholder="auto-generated-if-empty"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              name="category_id"
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="">Select category</option>
              {(categories || []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Price
            </label>
            <input
              type="number"
              name="price"
              step="0.01"
              min="0"
              placeholder="0.00"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Affiliate Link
            </label>
            <input
              type="url"
              name="affiliate_link"
              required
              placeholder="https://example.com/product"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Main Image URL
            </label>
            <input
              type="url"
              name="main_image_url"
              placeholder="https://..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              rows={5}
              placeholder="Enter product description"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="is_featured"
                className="h-4 w-4 rounded border-slate-300"
              />
              Featured Product
            </label>

            <label className="inline-flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked
                className="h-4 w-4 rounded border-slate-300"
              />
              Active
            </label>
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Save Product
            </button>

            <Link
              href="/admin/products"
              className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}