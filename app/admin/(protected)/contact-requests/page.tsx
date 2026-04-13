import { createServerSupabase } from "@/lib/supabase/server";
import { getCurrentAdminUser } from "@/lib/admin-auth";

type ContactRequestRow = {
  id: string;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  created_at: string | null;
};

export default async function AdminContactRequestsPage() {
  const supabase = await createServerSupabase();
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    throw new Error("UNAUTHORIZED");
  }

  const { data, error } = await supabase
    .from("contact_requests")
    .select("id, name, email, subject, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const requests = (data || []) as ContactRequestRow[];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
          Contact Requests
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          View customer inquiries
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Review messages submitted from the contact form.
        </p>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-500">
            Total requests:{" "}
            <span className="font-medium text-slate-900">{requests.length}</span>
          </p>
        </div>

        {requests.length > 0 ? (
          <div className="space-y-0">
            {requests.map((request) => (
              <div
                key={request.id}
                className="border-b border-slate-100 px-6 py-6 last:border-b-0"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {request.subject || "No subject"}
                      </h3>

                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {request.created_at
                          ? new Date(request.created_at).toLocaleDateString()
                          : "No date"}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-700">
                      <span className="font-medium">Name:</span>{" "}
                      {request.name || "-"}
                    </p>

                    <p className="mt-1 break-all text-sm text-slate-700">
                      <span className="font-medium">Email:</span>{" "}
                      {request.email || "-"}
                    </p>

                    <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
                      {request.message || "No message"}
                    </div>
                  </div>

                  {request.email && (
                    <div className="shrink-0">
                      <a
                        href={`mailto:${request.email}?subject=${encodeURIComponent(
                          request.subject || "Regarding your inquiry"
                        )}`}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
                      >
                        Reply
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              No contact requests yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Customer messages from the contact form will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}