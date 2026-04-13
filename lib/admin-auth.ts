import { createServerSupabase } from "@/lib/supabase/server";

export type AdminAccessLevel = "read" | "read_write" | "full_admin";

export type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  access_level: AdminAccessLevel;
  is_active: boolean;
};

export async function getCurrentAuthUser() {
  const supabase = await createServerSupabase();

  console.log("STEP 1: supabase created");

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("STEP 2: auth user =", user?.email);
  console.log("STEP 3: auth error =", error);

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  const supabase = await createServerSupabase();
  const authUser = await getCurrentAuthUser();

  console.log("STEP 4: authUser in admin check =", authUser?.email);

  if (!authUser?.email) {
    return null;
  }

  const { data, error } = await supabase
    .from("admin_users")
    .select("id, email, full_name, access_level, is_active")
    .eq("email", authUser.email)
    .eq("is_active", true)
    .maybeSingle<AdminUser>();

  console.log("STEP 5: admin row =", data);
  console.log("STEP 6: admin row error =", error);

  if (error || !data) {
    return null;
  }

  return data;
}

export async function requireAdminUser(): Promise<AdminUser> {
  const adminUser = await getCurrentAdminUser();

  if (!adminUser) {
    throw new Error("UNAUTHORIZED_ADMIN");
  }

  return adminUser;
}

export function hasReadWriteAccess(accessLevel: AdminAccessLevel) {
  return accessLevel === "read_write" || accessLevel === "full_admin";
}

export function hasFullAdminAccess(accessLevel: AdminAccessLevel) {
  return accessLevel === "full_admin";
}