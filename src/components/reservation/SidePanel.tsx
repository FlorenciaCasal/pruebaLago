import * as React from "react";

export function SidePanel({
  open,
  title,
  children,
  onClose,
  size = "md",
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  /** md = card normal, lg = card ancha (para calendario doble) */
  size?: "md" | "lg";
}) {
  if (!open) return null;

  // const width = size === "lg" ? "max-w-2xl" : "max-w-xl"; // 👈 más ancho para DATE
  // 👇 Anchos por preset + breakpoints
  const widthClasses =
    size === "lg"
      ? [
        "w-[92vw]",           // mobile casi full
        "sm:w-[90vw]",
        "lg:w-[70vw]",        // más ancho en lg
        "xl:w-[60vw]",
        "2xl:w-[50vw]",
        "max-w-[1200px]",     // tapa superior
      ].join(" ")
      : [
        "w-[92vw]",
        "sm:w-[80vw]",
        "md:w-[60vw]",
        "lg:w-[30vw]",        // 👈 compacto en lg+
        "xl:w-[28vw]",
        "2xl:w-[26vw]",
        "max-w-xl",
      ].join(" ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      {/* <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" /> */}

      {/* Card centrada */}
      <div
        // className={`relative w-[90vw] ${width} lg:w-[30vw] mb-48 lg:mr-64 xl:mr-50 lg:mb-0 rounded-2xl bg-white text-neutral-900 shadow-2xl border border-neutral-200
        //            max-h-[85vh] grid grid-rows-[auto,1fr] `}
        className={`
          relative z-10 ${widthClasses}
          rounded-2xl bg-white text-neutral-900 shadow-2xl border border-neutral-200
          max-h-[85vh] grid grid-rows-[auto,1fr] overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-gray-900 px-5 pt-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-100"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Content scrollable */}
        <div className="px-3 md:px-5 py-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
