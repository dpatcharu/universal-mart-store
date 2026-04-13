import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentAdminUser } from "@/lib/admin-auth";
import { adminLogout } from "../login/actions";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    redirect("/admin/login");
  }
  const getAccessLabel = (access: string) => {
  switch (access) {
    case "full_admin":
      return "⭐ Admin";
    case "read_write":
      return "Editor";
    case "read":
      return "Viewer";
    default:
      return access;
  }
};

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              Admin Portal
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              Universal Mart
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {adminUser.email} • {getAccessLabel(adminUser.access_level)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              View Store
            </Link>

            <form action={adminLogout}>
              <button
                type="submit"
                className="rounded-2xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px_1fr] md:px-6">
        <aside className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <nav className="space-y-2">
            <Link
              href="/admin"
              className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Products
            </Link>
            <Link
              href="/admin/categories"
              className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Categories
            </Link>
            <Link
              href="/admin/site-pages"
              className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Site Content
            </Link>
            <Link
              href="/admin/admin-users"
              className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Admin Users
            </Link>
            <Link
              href="/admin/contact-requests"
              className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Contact Requests
            </Link>
            <Link
              href="/admin/upload"
              className="block rounded-2xl px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Excel Upload
            </Link>
          </nav>
        </aside>

        <section>{children}</section>
      </div>
    </main>
  );
}