import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdminUser, hasReadWriteAccess } from "@/lib/admin-auth";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "./actions";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  is_active: boolean | null;
};

type ProductCountRow = {
  category_id: string | null;
};

export default async function AdminCategoriesPage() {
  const supabase = await createServerSupabase();
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    throw new Error("UNAUTHORIZED");
  }

  const isAdmin = adminUser.access_level === "full_admin";
  const canEdit =
    adminUser.access_level === "read_write" || isAdmin;

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id, name, slug, image_url, is_active")
    .order("name", { ascending: true });

  if (categoriesError) {
    throw new Error(categoriesError.message);
  }

  const typedCategories = (categories || []) as CategoryRow[];
  const categoryIds = typedCategories.map((c) => c.id);

  let productCountMap = new Map<string, number>();

  if (categoryIds.length > 0) {
    const { data: productRows, error: productsError } = await supabase
      .from("products")
      .select("category_id")
      .in("category_id", categoryIds);

    if (productsError) {
      throw new Error(productsError.message);
    }

    const typedProductRows = (productRows || []) as ProductCountRow[];

    productCountMap = typedProductRows.reduce((map, row) => {
      if (!row.category_id) return map;
      map.set(row.category_id, (map.get(row.category_id) || 0) + 1);
      return map;
    }, new Map<string, number>());
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
          Categories
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Manage categories
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Add, edit, and organize product categories with live product counts.
        </p>
      </div>

      {canEdit && (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Add category</h3>

          <form action={createCategory} className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Enter category name"
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

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Image URL
              </label>
              <input
                type="url"
                name="image_url"
                placeholder="https://..."
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div className="md:col-span-2">
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

            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Save Category
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-500">
            Total categories:{" "}
            <span className="font-medium text-slate-900">
              {typedCategories.length}
            </span>
          </p>
        </div>

        {typedCategories.length > 0 ? (
          <div className="space-y-0">
            {typedCategories.map((category) => {
              const productCount = productCountMap.get(category.id) || 0;

              return (
                <div
                  key={category.id}
                  className="border-b border-slate-100 px-6 py-6 last:border-b-0"
                >
                  <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {category.name}
                        </h3>

                        <StatusPill
                          label={category.is_active ? "Active" : "Inactive"}
                          active={!!category.is_active}
                        />

                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          {productCount} product{productCount === 1 ? "" : "s"}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-500">
                        /category/{category.slug}
                      </p>

                      <p className="mt-2 break-all text-sm text-slate-500">
                        {category.image_url || "No image URL"}
                      </p>
                    </div>

                    <div>
                      {canEdit ? (
                        <div className="space-y-3">
                          <form
                            action={updateCategory}
                            className="grid gap-3 md:grid-cols-2"
                          >
                            <input type="hidden" name="id" value={category.id} />

                            <div>
                              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                                Name
                              </label>
                              <input
                                type="text"
                                name="name"
                                required
                                defaultValue={category.name}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                                Slug
                              </label>
                              <input
                                type="text"
                                name="slug"
                                defaultValue={category.slug}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                                Image URL
                              </label>
                              <input
                                type="url"
                                name="image_url"
                                defaultValue={category.image_url || ""}
                                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                              />
                            </div>

                            <div className="md:col-span-2 flex flex-wrap items-center gap-4 pt-1">
                              <label className="inline-flex items-center gap-3 text-sm text-slate-700">
                                <input
                                  type="checkbox"
                                  name="is_active"
                                  defaultChecked={!!category.is_active}
                                  className="h-4 w-4 rounded border-slate-300"
                                />
                                Active
                              </label>
                            </div>

                            <div className="md:col-span-2 pt-2">
                              <button
                                type="submit"
                                className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                              >
                                Update
                              </button>
                            </div>
                          </form>

                          {isAdmin && (
                            <form action={deleteCategory}>
                              <input type="hidden" name="id" value={category.id} />
                              <button
                                type="submit"
                                disabled={productCount > 0}
                                className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${
                                  productCount > 0
                                    ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400"
                                    : "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                }`}
                                title={
                                  productCount > 0
                                    ? "Cannot delete a category that still has products"
                                    : "Delete category"
                                }
                              >
                                Delete
                              </button>
                            </form>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                          You have read-only access.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              No categories yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Start by adding your first category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {label}
    </span>
  );
}