"use server";

import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";

export async function adminLogin(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const supabase = await createServerSupabase();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect("/admin/login?error=invalid");
  }

  redirect("/admin");
}

export async function adminLogout() {
  const supabase = await createServerSupabase();

  await supabase.auth.signOut();
  redirect("/admin/login");
}