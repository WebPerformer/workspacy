// Docs: https://docs.dndkit.com/presets/sortable

"use client";

import WidgetQuickAccess from "@/components/widgets/widget-quick-access";

export default function Home() {
  const widgets = [
    {
      id: 1,
      component: WidgetQuickAccess,
    },
  ];

  return (
    <div className="max-w-[1320px] mx-auto px-2 sm:px-4">
      <div className="flex flex-col gap-12 sm:gap-18 touch-none">
        {widgets.map((widget) => (
          <widget.component key={widget.id} id={widget.id} />
        ))}
      </div>
    </div>
  );
}
