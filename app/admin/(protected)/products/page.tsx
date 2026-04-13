import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { deleteProduct } from "./actions";
import { getCurrentAdminUser, hasReadWriteAccess } from "@/lib/admin-auth";

type ProductRow = {
  id: string;
  product_name: string;
  slug: string;
  price: number | null;
  is_featured: boolean | null;
  is_active: boolean | null;
  created_at: string | null;
  category_id: string | null;
  categories:
    | {
        name: string;
        slug: string;
      }
    | {
        name: string;
        slug: string;
      }[]
    | null;
};

type CategoryOption = {
  id: string;
  name: string;
  slug: string;
};

type SearchParams = {
  search?: string;
  category?: string;
  status?: string;
  featured?: string;
  sort?: string;
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const params = (await searchParams) || {};
const supabase = await createServerSupabase();
const adminUser = await getCurrentAdminUser();

if (!adminUser) {
  throw new Error("UNAUTHORIZED");
}

const isAdmin = adminUser.access_level === "full_admin";
const canEdit =
  adminUser.access_level === "read_write" || isAdmin;

  const search = (params.search || "").trim();
  const category = (params.category || "").trim();
  const status = (params.status || "").trim();
  const featured = (params.featured || "").trim();
  const sort = (params.sort || "newest").trim();

  const { data: categoryOptions } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("name", { ascending: true })


  let query = supabase
    .from("products")
    .select(`
      id,
      product_name,
      slug,
      price,
      is_featured,
      is_active,
      created_at,
      category_id,
      categories(name, slug)
    `)


  if (search) {
    query = query.or(`product_name.ilike.%${search}%,slug.ilike.%${search}%`);
  }

  if (category) {
    const selectedCategory = categoryOptions?.find((c) => c.slug === category);
    if (selectedCategory) {
      query = query.eq("category_id", selectedCategory.id);
    }
  }

  if (status === "active") {
    query = query.eq("is_active", true);
  } else if (status === "inactive") {
    query = query.eq("is_active", false);
  }

  if (featured === "yes") {
    query = query.eq("is_featured", true);
  } else if (featured === "no") {
    query = query.eq("is_featured", false);
  }

  switch (sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "name_asc":
      query = query.order("product_name", { ascending: true });
      break;
    case "name_desc":
      query = query.order("product_name", { ascending: false });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  const { data: products, error } = await query;
  const typedProducts = products as ProductRow[] | null;

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
            Manage products
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            View, edit, and organize your store catalog.
          </p>
        </div>

        {canEdit && (
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Add Product
          </Link>
        )}
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-500">
            Total products:{" "}
            <span className="font-medium text-slate-900">
              {typedProducts?.length || 0}
            </span>
          </p>
        </div>

        <div className="border-b border-slate-200 px-6 py-4">
          <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search product or slug"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400 xl:col-span-2"
            />

            <select
              name="category"
              defaultValue={category}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="">All categories</option>
              {(categoryOptions || []).map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              name="status"
              defaultValue={status}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="">All status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              name="featured"
              defaultValue={featured}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="">All featured</option>
              <option value="yes">Featured</option>
              <option value="no">Not featured</option>
            </select>

            <select
              name="sort"
              defaultValue={sort}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
              <option value="price_asc">Price Low-High</option>
              <option value="price_desc">Price High-Low</option>
            </select>

            <div className="flex gap-3 xl:col-span-5">
              <button
                type="submit"
                className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Apply
              </button>

              <Link
                href="/admin/products"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
              >
                Reset
              </Link>
            </div>
          </form>
        </div>

        {typedProducts && typedProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Featured
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Created
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {typedProducts.map((product) => {
                  const categoryName = Array.isArray(product.categories)
                    ? product.categories[0]?.name
                    : product.categories?.name;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 align-top last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900">
                            {product.product_name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            /product/{product.slug}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {categoryName || "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {product.price != null ? `$${product.price}` : "-"}
                      </td>

                      <td className="px-6 py-4">
                        <StatusPill
                          label={product.is_featured ? "Yes" : "No"}
                          active={!!product.is_featured}
                        />
                      </td>

                      <td className="px-6 py-4">
                        <StatusPill
                          label={product.is_active ? "Active" : "Inactive"}
                          active={!!product.is_active}
                        />
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {product.created_at
                          ? new Date(product.created_at).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                      {canEdit && (
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                      )}

                          {isAdmin && (
                            <form action={deleteProduct}>
                              <input
                                type="hidden"
                                name="productId"
                                value={product.id}
                              />
                              <button
                                type="submit"
                                className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 transition hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              No products found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            {canEdit && (
              <Link
                href="/admin/products/new"
                className="mt-5 inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Add Product
              </Link>
            )}
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