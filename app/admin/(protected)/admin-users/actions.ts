"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/admin-auth";

type AccessLevel = "read" | "read_write" | "full_admin";

function validateAccessLevel(value: string): value is AccessLevel {
  return value === "read" || value === "read_write" || value === "full_admin";
}

async function requireFullAdmin() {
  const adminUser = await requireAdminUser();

  if (adminUser.access_level !== "full_admin") {
    throw new Error("FORBIDDEN");
  }

  return adminUser;
}

export async function createAdminUser(formData: FormData) {
  await requireFullAdmin();

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const full_name = String(formData.get("full_name") || "").trim();
  const access_level = String(formData.get("access_level") || "").trim();
  const is_active = formData.get("is_active") === "on";

  if (!email) {
    throw new Error("EMAIL_REQUIRED");
  }

  if (!validateAccessLevel(access_level)) {
    throw new Error("INVALID_ACCESS_LEVEL");
  }

  const supabase = await createServerSupabase();

  const { data: existingUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    throw new Error("ADMIN_USER_ALREADY_EXISTS");
  }

  const { error } = await supabase.from("admin_users").insert({
    email,
    full_name: full_name || null,
    access_level,
    is_active,
    invited_by_email: "system",
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/admin-users");
}

export async function updateAdminUser(formData: FormData) {
  const currentAdmin = await requireFullAdmin();

  const id = String(formData.get("id") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const full_name = String(formData.get("full_name") || "").trim();
  const access_level = String(formData.get("access_level") || "").trim();
  const is_active = formData.get("is_active") === "on";

  if (!id) {
    throw new Error("ID_REQUIRED");
  }

  if (!email) {
    throw new Error("EMAIL_REQUIRED");
  }

  if (!validateAccessLevel(access_level)) {
    throw new Error("INVALID_ACCESS_LEVEL");
  }

  const supabase = await createServerSupabase();

  const { data: existingUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .neq("id", id)
    .maybeSingle();

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_USED");
  }

  const { error } = await supabase
    .from("admin_users")
    .update({
      email,
      full_name: full_name || null,
      access_level,
      is_active,
      invited_by_email: currentAdmin.email,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/admin-users");
}

export async function toggleAdminUserStatus(formData: FormData) {
  const currentAdmin = await requireFullAdmin();

  const id = String(formData.get("id") || "").trim();
  const nextStatus = String(formData.get("next_status") || "").trim();

  if (!id) {
    throw new Error("ID_REQUIRED");
  }

  if (nextStatus !== "true" && nextStatus !== "false") {
    throw new Error("INVALID_STATUS");
  }

  const supabase = await createServerSupabase();

  const { data: targetUser, error: fetchError } = await supabase
    .from("admin_users")
    .select("id, email, access_level")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!targetUser) {
    throw new Error("USER_NOT_FOUND");
  }

  if (
    targetUser.email === currentAdmin.email &&
    nextStatus === "false"
  ) {
    throw new Error("CANNOT_DISABLE_SELF");
  }

  const { error } = await supabase
    .from("admin_users")
    .update({
      is_active: nextStatus === "true",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/admin-users");
}

export async function deleteAdminUser(formData: FormData) {
  const currentAdmin = await requireFullAdmin();

  const id = String(formData.get("id") || "").trim();

  if (!id) {
    throw new Error("ID_REQUIRED");
  }

  const supabase = await createServerSupabase();

  const { data: targetUser, error: fetchError } = await supabase
    .from("admin_users")
    .select("id, email")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!targetUser) {
    throw new Error("USER_NOT_FOUND");
  }

  if (targetUser.email === currentAdmin.email) {
    throw new Error("CANNOT_DELETE_SELF");
  }

  const { error } = await supabase
    .from("admin_users")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/admin-users");
}