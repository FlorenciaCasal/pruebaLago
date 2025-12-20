"use client";
import { useState } from "react";
import PoliciesModal from "./PoliciesModal";
import PoliciesContent from "./PoliciesContent";

export default function PolicyCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1"
        />
        <span className="text-sm">
          Acepto las{" "}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="underline text-button"
          >
            políticas de visita
          </button>
        </span>
      </label>

      <PoliciesModal open={open} onClose={() => setOpen(false)}>
        <PoliciesContent />
      </PoliciesModal>
    </>
  );
}
