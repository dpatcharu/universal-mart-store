import { requireAdminUser } from "@/lib/admin-auth";
import UploadPreview from "./UploadPreview";

export default async function AdminUploadPage() {
  const adminUser = await requireAdminUser();

  const canEdit =
    adminUser.access_level === "read_write" ||
    adminUser.access_level === "full_admin";

  if (!canEdit) {
    throw new Error("FORBIDDEN");
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
          Excel Upload
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Upload products in bulk
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Preview Excel data before importing products into the store.
        </p>
      </div>

      <UploadPreview />
    </div>
  );
}