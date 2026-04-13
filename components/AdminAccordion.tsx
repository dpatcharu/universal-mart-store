"use client";

import { useState } from "react";

export default function AdminAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-2xl">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-5 py-4 text-left"
      >
        <span className="font-semibold">{title}</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && <div className="p-5 border-t">{children}</div>}
    </div>
  );
}