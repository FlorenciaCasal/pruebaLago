"use client";
import { ArrowRight } from "lucide-react";

export default function StepHeader({ index, title }: { index: number; title: string }) {
    return (
        <div className="flex items-center gap-2 mb-6">
            {/* número de step */}
            <span className="text-sm mr-[-4px] sm:text-base font-normal text-white/80">
                {index}
            </span>
            <ArrowRight className="w-4 h-4 sm:w-5 h-5 pr-1" />
            <h2 className="text-[20px] sm:text-xl font-normal sm:font-semibold leading-snug">
                {title}
            </h2>
        </div>
    );
}
