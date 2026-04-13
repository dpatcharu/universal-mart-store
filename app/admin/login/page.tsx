import Link from "next/link";
import { adminLogin } from "./actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const resolved = (await searchParams) || {};

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fffefb_0%,#f6f3ee_45%,#ffffff_100%)] px-4 py-10 text-slate-900 md:px-6">
      <div className="mx-auto max-w-md">
        <div className="mb-6">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
            ← Back to Store
          </Link>
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
            Admin
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Sign in to Universal Mart
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Protected access for store management.
          </p>

          {resolved.error === "invalid" && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Invalid email or password.
            </div>
          )}

          <form action={adminLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}