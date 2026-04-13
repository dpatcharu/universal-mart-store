"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function createProduct(formData: FormData) {
  const adminUser = await requireAdminUser();

  if (!hasReadWriteAccess(adminUser.access_level)) {
    throw new Error("UNAUTHORIZED_ACTION");
  }

  const product_name = String(formData.get("product_name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const affiliate_link = String(formData.get("affiliate_link") || "").trim();
  const main_image_url = String(formData.get("main_image_url") || "").trim();
  const category_id = String(formData.get("category_id") || "").trim();

  const priceRaw = String(formData.get("price") || "").trim();
  const is_featured = formData.get("is_featured") === "on";
  const is_active = formData.get("is_active") === "on";

  if (!product_name) {
    throw new Error("PRODUCT_NAME_REQUIRED");
  }

  if (!affiliate_link) {
    throw new Error("AFFILIATE_LINK_REQUIRED");
  }

  if (!category_id) {
    throw new Error("CATEGORY_REQUIRED");
  }

  const slug = slugInput ? toSlug(slugInput) : toSlug(product_name);
  const price = priceRaw ? Number(priceRaw) : null;

  if (priceRaw && Number.isNaN(price)) {
    throw new Error("INVALID_PRICE");
  }

  const supabase = await createServerSupabase();

  const { data: existingSlug } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existingSlug) {
    throw new Error("SLUG_ALREADY_EXISTS");
  }

  const { error } = await supabase.from("products").insert({
    product_name,
    slug,
    description: description || null,
    affiliate_link,
    main_image_url: main_image_url || null,
    category_id,
    price,
    is_featured,
    is_active,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/shop");
  redirect("/admin/products");
}