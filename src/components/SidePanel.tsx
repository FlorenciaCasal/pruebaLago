"use client";
import React from "react";

export default function SidePanel({
  open, title, children, onClose }:
  { open: boolean; title: string; children: React.ReactNode; onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose}>
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <button className="rounded p-1 hover:bg-gray-100" onClick={onClose}>✕</button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-56px)]">{children}</div>
      </div>
    </div>
  );
}
