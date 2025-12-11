import * as React from "react";

export function Step({
  label,
  value,
  onClick,
  disabled,
  error,
}: {
  label: string;
  value?: string;
  onClick: () => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex w-full items-center justify-between rounded-lg border p-3 text-left transition",
        "bg-white border-secondary hover:bg-white/10",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        error ? "border-red-500" : "",
      ].join(" ")}
    >
      <span className="truncate">{value || label}</span>
      <span className="ml-3">▾</span>
    </button>
  );
}
