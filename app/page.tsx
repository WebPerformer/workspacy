// Docs: https://docs.dndkit.com/presets/sortable

"use client";

import QuickAccess from "@/components/dashboard/quick-access";

export default function Home() {
  return (
    <div className="flex flex-col gap-10 sm:gap-14">
      <QuickAccess />
    </div>
  );
}
