// import * as React from "react";

// type OptionButtonProps = {
//   title: string;
//   subtitle: string;
//   disabled?: boolean;                // ← booleano
//   onSelect: () => void;
//   active?: boolean;
//   onDisabledClick?: () => void;      // opcional (p.ej. mostrar toast)
// };

// export function OptionButton({
//   title,
//   subtitle,
//   disabled = false,
//   onSelect,
//   active,
//   onDisabledClick,
// }: OptionButtonProps) {
//   const handleClick = React.useCallback(() => {
//     if (disabled) {
//       onDisabledClick?.();
//       return;
//     }
//     onSelect();
//   }, [disabled, onSelect, onDisabledClick]);

//   // Evita activar con Enter/Espacio cuando está “deshabilitado”
//   const handleKeyDown = React.useCallback(
//     (e: React.KeyboardEvent<HTMLButtonElement>) => {
//       if (!disabled) return;
//       if (e.key === "Enter" || e.key === " ") {
//         e.preventDefault();
//         e.stopPropagation();
//         onDisabledClick?.();
//       }
//     },
//     [disabled, onDisabledClick]
//   );

//   return (
//     <button
//       type="button"
//       onClick={handleClick}
//       // disabled={disabled}                 // ← deshabilita nativo
//       aria-disabled={disabled}
//       onKeyDown={handleKeyDown}
//       className={[
//         "w-full text-left rounded-lg p-4 mb-2 border transition",
//         "border-white/20",
//         active ? "ring-2 ring-white" : "",
//         disabled
//           ? "bg-white/5 opacity-50 cursor-not-allowed"
//           : "bg-white/5 hover:bg-white/10",
//       ].join(" ")}
//     >
//       <div className="font-medium">{title}</div>
//       <div className="text-sm text-white/70">{subtitle}</div>
//     </button>
//   );
// }

"use client";
import Image from "next/image";
import React from "react";

export function OptionButton({
  title,
  subtitle,
  imageSrc,
  disabled,
  onSelect,
  onDisabledClick,
}: {
  title: string;
  subtitle?: string;
  imageSrc: string;
  disabled?: boolean;
  onSelect?: () => void;
  onDisabledClick?: () => void;
}) {
  const handle = () => {
    if (disabled) return onDisabledClick?.();
    onSelect?.();
  };

  return (
    <button
      type="button"
      onClick={handle}
      className={`
        w-full overflow-hidden text-left rounded-2xl border
        ${disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md cursor-pointer"}
        border-neutral-200 bg-white shadow-sm transition
      `}
    >
      <div className="relative h-40">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(min-width: 1024px) 480px, 90vw"
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="text-white text-lg font-semibold drop-shadow">{title}</div>
          {subtitle && (
            <div className="text-white/90 text-sm leading-snug">{subtitle}</div>
          )}
        </div>
      </div>
    </button>
  );
}
