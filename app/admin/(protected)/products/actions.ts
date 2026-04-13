"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdminUser, hasReadWriteAccess } from "@/lib/admin-auth";

export async function deleteProduct(formData: FormData) {
  const adminUser = await requireAdminUser();

  if (!hasReadWriteAccess(adminUser.access_level)) {
    throw new Error("UNAUTHORIZED_ACTION");
  }

  const productId = String(formData.get("productId") || "").trim();

  if (!productId) {
    throw new Error("MISSING_PRODUCT_ID");
  }

  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/shop");
}