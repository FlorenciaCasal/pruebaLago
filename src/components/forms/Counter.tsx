"use client";
import React from "react";

// Counter.tsx (o donde lo tengas)
export default function Counter({
    label,
    value,
    onChange,
    min = 0,
    max = Infinity,
    description,
    disableMinusWhenMin = false,
}: {
    label: string;
    value: number;
    onChange: (next: number) => void;
    min?: number;
    max?: number;
    description?: string;
    disableMinusWhenMin?: boolean;
}) {
    const dec = () => onChange(Math.max(min, value - 1));
    const inc = () => onChange(Math.min(max, value + 1));

    return (
        <div className="flex items-start justify-between py-3 border-b border-white/10">
            {/* texto: más chico en mobile, normal en md+ */}
            <div className="pr-3 max-w-[75%] sm:max-w-none">
                <p className="font-medium text-sm leading-snug sm:text-base sm:leading-normal break-words">
                    {label}
                </p>
                {description ? (
                    <p className="text-xs leading-snug text-white/70 sm:text-sm sm:leading-snug mt-0.5">
                        {description}
                    </p>
                ) : null}
            </div>

            {/* controles: un toque más chicos en mobile */}
            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={dec}
                    disabled={disableMinusWhenMin && value <= min}
                    className="h-8 w-8 sm:h-10 sm:w-10 grid place-items-center rounded-full border border-white/80 text-white disabled:opacity-50"
                    aria-label={`Disminuir ${label}`}
                >
                    –
                </button>
                <span className="w-8 text-center text-sm sm:text-base">{value}</span>
                <button
                    type="button"
                    onClick={inc}
                    disabled={value >= max}
                    className="h-8 w-8 sm:h-10 sm:w-10 grid place-items-center rounded-full border border-white/80 text-white disabled:opacity-50"
                    aria-label={`Aumentar ${label}`}
                >
                    +
                </button>
            </div>
        </div>
    );
}

