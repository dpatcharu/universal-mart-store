"use server";

import { requireAdminUser } from "@/lib/admin-auth";
import * as XLSX from "xlsx";

export async function uploadProductsFile(formData: FormData) {
  const adminUser = await requireAdminUser();

  const canEdit =
    adminUser.access_level === "read_write" ||
    adminUser.access_level === "full_admin";

  if (!canEdit) {
    throw new Error("FORBIDDEN");
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("FILE_REQUIRED");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const workbook = XLSX.read(buffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const data = XLSX.utils.sheet_to_json(sheet);

  console.log("Parsed Excel:", data);

  return data;
}