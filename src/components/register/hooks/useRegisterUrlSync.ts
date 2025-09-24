"use client";
import { useEffect } from "react";
import type { ReadonlyURLSearchParams } from "next/navigation";


type Args = {
    currentStep: number;
    successMsg: string | null;
    pathname: string;
    routerReplace: (url: string) => void;
    searchParams: ReadonlyURLSearchParams;

    // fuente de verdad para el tipo + datos que preservamos
    tipo: "PARTICULAR" | "INSTITUCION_EDUCATIVA" | null;
    fechaISO?: string | null;
    circuito?: string | null;
    adultos?: number | null;
    ninos?: number | null;
    bebes?: number | null;
};

// Efecto #2: sincronizar la URL (step + visitorType + totales) sin pisar valores nuevos.
export function useRegisterUrlSync({
    currentStep, successMsg, pathname, routerReplace, searchParams,
    tipo, fechaISO, circuito, adultos, ninos, bebes,
}: Args) {
    useEffect(() => {
        if (successMsg) return;

        const sp = new URLSearchParams(searchParams);
        const nextStep = String(currentStep);
        const urlStep = sp.get("step") ?? "0";

        if (tipo) sp.set("visitorType", tipo);
        if (fechaISO) sp.set("fecha", fechaISO);
        if (circuito) sp.set("circuito", String(circuito));
        sp.set("adults", String(adultos ?? 0));
        sp.set("kids", String(ninos ?? 0));
        sp.set("babies", String(bebes ?? 0));

        const needsVTFix = !!tipo && sp.get("visitorType") !== tipo;
        const needsStep = urlStep !== nextStep;

        if (needsVTFix || needsStep) {
            sp.set("step", nextStep);
            routerReplace(`${pathname}?${sp.toString()}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep, successMsg, pathname, searchParams, tipo, fechaISO, circuito, adultos, ninos, bebes]);
}
