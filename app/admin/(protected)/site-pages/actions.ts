"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdminUser, hasReadWriteAccess } from "@/lib/admin-auth";

export async function updateSitePage(formData: FormData) {
  const adminUser = await requireAdminUser();

  if (!hasReadWriteAccess(adminUser.access_level)) {
    throw new Error("UNAUTHORIZED_ACTION");
  }

  const id = String(formData.get("id"));
  const title = String(formData.get("title") || "");
  const subtitle = String(formData.get("subtitle") || "");
  const content = String(formData.get("content") || "");

  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("site_pages")
    .update({
      title,
      subtitle,
      content,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/site-pages");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/shop");
}