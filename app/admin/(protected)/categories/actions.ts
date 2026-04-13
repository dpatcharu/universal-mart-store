"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdminUser, hasReadWriteAccess } from "@/lib/admin-auth";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createCategory(formData: FormData) {
  const adminUser = await requireAdminUser();

  if (!hasReadWriteAccess(adminUser.access_level)) {
    throw new Error("UNAUTHORIZED_ACTION");
  }

  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const image_url = String(formData.get("image_url") || "").trim();
  const is_active = formData.get("is_active") === "on";

  if (!name) {
    throw new Error("CATEGORY_NAME_REQUIRED");
  }

  const slug = slugInput ? toSlug(slugInput) : toSlug(name);

  const supabase = await createServerSupabase();

  const { data: existingSlug } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingSlug) {
    throw new Error("CATEGORY_SLUG_ALREADY_EXISTS");
  }

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    image_url: image_url || null,
    is_active,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/shop");
}

export async function updateCategory(formData: FormData) {
  const adminUser = await requireAdminUser();

  if (!hasReadWriteAccess(adminUser.access_level)) {
    throw new Error("UNAUTHORIZED_ACTION");
  }

  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const image_url = String(formData.get("image_url") || "").trim();
  const is_active = formData.get("is_active") === "on";

  if (!id) {
    throw new Error("CATEGORY_ID_REQUIRED");
  }

  if (!name) {
    throw new Error("CATEGORY_NAME_REQUIRED");
  }

  const slug = slugInput ? toSlug(slugInput) : toSlug(name);

  const supabase = await createServerSupabase();

  const { data: existingSlug } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .neq("id", id)
    .maybeSingle();

  if (existingSlug) {
    throw new Error("CATEGORY_SLUG_ALREADY_EXISTS");
  }

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      slug,
      image_url: image_url || null,
      is_active,
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/shop");
}

export async function deleteCategory(formData: FormData) {
  const adminUser = await requireAdminUser();

  if (!hasReadWriteAccess(adminUser.access_level)) {
    throw new Error("UNAUTHORIZED_ACTION");
  }

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("CATEGORY_ID_REQUIRED");
  }

  const supabase = await createServerSupabase();

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if ((count || 0) > 0) {
    throw new Error("CATEGORY_HAS_PRODUCTS");
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/shop");
}