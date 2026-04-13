"use server";

import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export async function submitContactRequest(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const subject = String(formData.get("subject") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    redirect("/contact?status=error");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const { error } = await supabase.from("contact_requests").insert([
    {
      name,
      email,
      subject,
      message,
    },
  ]);

  if (error) {
    redirect("/contact?status=error");
  }

  redirect("/contact?status=success");
}