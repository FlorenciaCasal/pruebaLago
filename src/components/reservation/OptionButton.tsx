import * as React from "react";

export function OptionButton({
  title,
  subtitle,
  onSelect,
  active,
}: {
  title: string;
  subtitle: string;
  onSelect: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onSelect}
      className={[
        "w-full text-left rounded-lg p-4 border transition",
        "bg-white/5 hover:bg-white/10 border-white/20",
        active ? "ring-2 ring-white" : "",
      ].join(" ")}
    >
      <div className="font-medium">{title}</div>
      <div className="text-sm text-white/70">{subtitle}</div>
    </button>
  );
}
