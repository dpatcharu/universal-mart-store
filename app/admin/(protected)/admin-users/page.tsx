import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/admin-auth";
import {
  createAdminUser,
  updateAdminUser,
  toggleAdminUserStatus,
  deleteAdminUser,
} from "./actions";

type AdminUserRow = {
  id: string;
  email: string;
  full_name: string | null;
  access_level: "read" | "read_write" | "full_admin";
  is_active: boolean;
  created_at?: string | null;
};

export default async function AdminUsersPage() {
  const supabase = await createServerSupabase();
  const adminUser = await requireAdminUser();

  if (adminUser.access_level !== "full_admin") {
    throw new Error("FORBIDDEN");
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, full_name, access_level, is_active, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const users = (data || []) as AdminUserRow[];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
          Admin Users
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Manage admin access
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Add users, change access levels, enable or disable access, and remove admin access.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900">Add admin user</h3>
        <p className="mt-2 text-sm text-slate-500">
          This grants admin portal access. The same email must also exist in Supabase Auth to sign in.
        </p>

        <form action={createAdminUser} className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="name@example.com"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="Enter full name"
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Access Level
            </label>
            <select
              name="access_level"
              defaultValue="read"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
            >
              <option value="read">Viewer</option>
              <option value="read_write">Editor</option>
              <option value="full_admin">⭐ Admin</option>
            </select>
          </div>

          <div className="flex items-end">
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
              Add User
            </button>
          </div>
        </form>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-500">
            Total admin users:{" "}
            <span className="font-medium text-slate-900">{users.length}</span>
          </p>
        </div>

        {users.length > 0 ? (
          <div className="space-y-0">
            {users.map((user) => {
              const isSelf = user.email === adminUser.email;

              return (
                <div
                  key={user.id}
                  className="border-b border-slate-100 px-6 py-6 last:border-b-0"
                >
                  <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {user.full_name || user.email}
                        </h3>
                        <AccessBadge level={user.access_level} />
                        <StatusBadge active={user.is_active} />
                        {isSelf && (
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            You
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm text-slate-500">{user.email}</p>

                      <p className="mt-2 text-sm text-slate-500">
                        Created:{" "}
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <form action={updateAdminUser} className="grid gap-4 md:grid-cols-2">
                        <input type="hidden" name="id" value={user.id} />

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            defaultValue={user.email}
                            required
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="full_name"
                            defaultValue={user.full_name || ""}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                            Access Level
                          </label>
                          <select
                            name="access_level"
                            defaultValue={user.access_level}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                          >
                            <option value="read">Viewer</option>
                            <option value="read_write">Editor</option>
                            <option value="full_admin">⭐ Admin</option>
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="inline-flex items-center gap-3 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              name="is_active"
                              defaultChecked={user.is_active}
                              className="h-4 w-4 rounded border-slate-300"
                            />
                            Active
                          </label>
                        </div>

                        <div className="md:col-span-2">
                          <button
                            type="submit"
                            className="rounded-2xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                          >
                            Save Changes
                          </button>
                        </div>
                      </form>

                      <div className="flex flex-wrap gap-3">
                        <form action={toggleAdminUserStatus}>
                          <input type="hidden" name="id" value={user.id} />
                          <input
                            type="hidden"
                            name="next_status"
                            value={user.is_active ? "false" : "true"}
                          />
                          <button
                            type="submit"
                            disabled={isSelf && user.is_active}
                            className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${
                              user.is_active
                                ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            } ${
                              isSelf && user.is_active
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                            title={
                              isSelf && user.is_active
                                ? "You cannot disable yourself"
                                : user.is_active
                                ? "Disable admin access"
                                : "Enable admin access"
                            }
                          >
                            {user.is_active ? "Disable" : "Enable"}
                          </button>
                        </form>

                        <form action={deleteAdminUser}>
                          <input type="hidden" name="id" value={user.id} />
                          <button
                            type="submit"
                            disabled={isSelf}
                            className={`rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 ${
                              isSelf ? "cursor-not-allowed opacity-50" : ""
                            }`}
                            title={isSelf ? "You cannot delete yourself" : "Delete admin access"}
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              No admin users found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Add your first admin user to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AccessBadge({ level }: { level: string }) {
  let label = level;
  let classes = "bg-slate-100 text-slate-700";

  if (level === "full_admin") {
    label = "⭐ Admin";
    classes = "bg-amber-50 text-amber-700";
  } else if (level === "read_write") {
    label = "Editor";
    classes = "bg-blue-50 text-blue-700";
  } else if (level === "read") {
    label = "Viewer";
    classes = "bg-slate-100 text-slate-700";
  }

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}