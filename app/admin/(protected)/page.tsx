import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdminUser } from "@/lib/admin-auth";

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabase();

  // 🔐 get logged in admin
  const adminUser = await getCurrentAdminUser();

  // 📊 fetch counts in parallel
  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: featuredCount },
    { count: requestsCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true),
    supabase
      .from("contact_requests")
      .select("*", { count: "exact", head: true }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
          Dashboard
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Welcome{adminUser?.full_name ? `, ${adminUser.full_name}` : ""}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Manage your store data and monitor activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Products" value={productsCount} />
        <StatCard title="Categories" value={categoriesCount} />
        <StatCard title="Featured" value={featuredCount} />
        <StatCard title="Contact Requests" value={requestsCount} />
      </div>

      {/* Quick Actions */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold">Quick actions</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          <ActionCard
            title="Add Product"
            description="Create a new product entry"
            href="/admin/products"
          />

          <ActionCard
            title="Manage Categories"
            description="Edit category structure"
            href="/admin/categories"
          />

          <ActionCard
            title="Edit Site Content"
            description="Update home, about, contact pages"
            href="/admin/site-pages"
          />

          <ActionCard
            title="Admin Users"
            description="Control access and permissions"
            href="/admin/users"
          />

          <ActionCard
            title="Contact Requests"
            description="View user inquiries"
            href="/admin/contact-requests"
          />

          <ActionCard
            title="Upload Products"
            description="Bulk import via Excel"
            href="/admin/upload"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value?: number | null;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-semibold">{value || 0}</p>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100"
    >
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </a>
  );
}