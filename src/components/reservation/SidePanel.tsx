import * as React from "react";

export function SidePanel({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 md:items-center md:justify-center" onClick={onClose}>
      <div
        className="absolute right-0 top-0 h-full w-full max-w-md md:max-w-full bg-gray-900 text-white shadow-xl border-l border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <button className="rounded p-1 hover:bg-white/10" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">{children}</div>
      </div>
    </div>
  );
}
