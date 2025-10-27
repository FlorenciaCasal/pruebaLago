import * as React from "react";

export function CounterRow({
  title,
  subtitle,
  value,
  onChange,
}: {
  title: string;
  subtitle: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-800 p-3 mb-2 bg-white/5">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-white/70">{subtitle}</div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => onChange(value - 1)} className="rounded border border-white/30 px-2 py-1 hover:bg-white/10">
          -
        </button>
        <span className="w-6 text-center">{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} className="rounded border border-white/30 px-2 py-1 hover:bg-white/10">
          +
        </button>
      </div>
    </div>
  );
}
