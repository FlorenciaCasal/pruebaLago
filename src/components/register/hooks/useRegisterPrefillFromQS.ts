// /components/register/hooks/useRegisterPrefillFromQS.ts
"use client";
import { useEffect } from "react";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import type { ReadonlyURLSearchParams } from "next/navigation";
import type { ReservationFormData } from "@/types/reservation";
import type { Visitante } from "@/utils/visitante";
import { isVisitante } from "@/utils/visitante";

export function useRegisterPrefillFromQS(
    searchParams: ReadonlyURLSearchParams,
    setValue: UseFormSetValue<ReservationFormData>,
    watch: UseFormWatch<ReservationFormData>
): { tipoFromQS: Visitante | null } {       // 👈 retorno tipado
    const raw = searchParams.get("visitorType");
    const tipoFromQS: Visitante | null = isVisitante(raw) ? raw : null; // 👈 ya narrowed

    useEffect(() => {
        const fechaQS = searchParams.get("fecha");
        if (fechaQS) setValue("fechaISO", fechaQS, { shouldDirty: true });

        if (tipoFromQS && watch("tipoVisitante") !== tipoFromQS) {
            setValue("tipoVisitante", tipoFromQS, { shouldDirty: true });
        }

        const ad = Number(searchParams.get("adults") ?? "0");
        const ni = Number(searchParams.get("kids") ?? "0");
        const be = Number(searchParams.get("babies") ?? "0");
        setValue("adultos", Math.max(0, ad), { shouldDirty: true });
        setValue("ninos", Math.max(0, ni), { shouldDirty: true });
        setValue("bebes", Math.max(0, be), { shouldDirty: true });

        // const circuitQS = searchParams.get("circuito");
        // if (circuitQS) setValue("circuito", circuitQS as any, { shouldDirty: true });
    }, [searchParams, tipoFromQS, setValue, watch]);

    return { tipoFromQS };
}
