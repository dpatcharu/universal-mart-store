import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdminUser, hasReadWriteAccess } from "@/lib/admin-auth";
import { updateProduct } from "./actions";

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type ProductRecord = {
  id: string;
  product_name: string;
  slug: string;
  description: string | null;
  affiliate_link: string;
  main_image_url: string | null;
  category_id: string | null;
  price: number | null;
  is_featured: boolean | null;
  is_active: boolean | null;
};

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createServerSupabase();
  const adminUser = await getCurrentAdminUser();

  if (!adminUser || !hasReadWriteAccess(adminUser.access_level)) {
    throw new Error("UNAUTHORIZED_PAGE");
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select(`
      id,
      product_name,
      slug,
      description,
      affiliate_link,
      main_image_url,
      category_id,
      price,
      is_featured,
      is_active
    `)
    .eq("id", id)
    .maybeSingle();

  if (productError) {
    throw new Error(productError.message);
  }

  if (!product) {
    notFound();
  }

  const typedProduct = product as ProductRecord;

  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  const typedCategories = (categories || []) as CategoryOption[];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
            Products
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Edit product
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Update the selected product entry.
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
        <form action={updateProduct} className="grid gap-5 md:grid-cols-2">
          <input type="hidden" name="id" value={typedProduct.id} />

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Product Name
            </label>
            <input
              type="text"
              name="product_name"
              required
              defaultValue={typedProduct.product_name}
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
              defaultValue={typedProduct.slug}
              placeholder="product-slug"
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
              defaultValue={typedProduct.category_id || ""}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="">Select category</option>
              {typedCategories.map((category) => (
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
              defaultValue={typedProduct.price ?? ""}
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
              defaultValue={typedProduct.affiliate_link}
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
              defaultValue={typedProduct.main_image_url || ""}
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
              defaultValue={typedProduct.description || ""}
              placeholder="Enter product description"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="md:col-span-2 flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="is_featured"
                defaultChecked={!!typedProduct.is_featured}
                className="h-4 w-4 rounded border-slate-300"
              />
              Featured Product
            </label>

            <label className="inline-flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={!!typedProduct.is_active}
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
              Update Product
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