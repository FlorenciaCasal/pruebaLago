"use client";
import { checkboxBox, textSoft } from "@/styles/ui";

export default function PolicyCheckbox({
  href, checked, onChange,
}: { href: string; checked: boolean; onChange: (v: boolean) => void; }) {
  return (
    <label className={`flex items-start gap-3 text-xs ${textSoft} cursor-pointer select-none`}>
      <input
        id="acepta"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={checkboxBox}
      />
      <span>
        Acepto las{" "}
        <a href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-90 text-gray-700">
          políticas de visita
        </a>{" "}
        (derecho de admisión y manejo de datos).
      </span>
    </label>
  );
}
