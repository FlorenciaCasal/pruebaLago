import * as yup from "yup";
import type { ReservationFormData, CircuitoKey } from "@/types/reservation";

// Campos requeridos en ESTE paso del wizard (no opcionales)
export type WizardStepData = {
    tipoVisitante: NonNullable<ReservationFormData["tipoVisitante"]>;
    // circuito: CircuitoKey | string;  // si querés, dejalo en CircuitoKey estrictamente
    fechaISO: string;
    adultos: number;
    ninos: number;
    bebes: number;
};

const int = (s: unknown) => (typeof s === "string" && s.trim() !== "" ? Number(s) : s);

export const schema: yup.ObjectSchema<WizardStepData> = yup
    .object({
        tipoVisitante: yup
            .mixed<NonNullable<ReservationFormData["tipoVisitante"]>>()
            .oneOf(["PARTICULAR", "INSTITUCION_EDUCATIVA"] as const)
            .required(),
        // circuito: yup.string().required(),
        fechaISO: yup.string().required().matches(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
        adultos: yup.number()
            .integer("Número inválido")
            .min(1, "Debe haber al menos 1 adulto")
            .required(),
        ninos: yup.number()
            .transform(int)
            .integer()
            .min(0)
            .required(),
        bebes: yup.number()
            .transform(int)
            .integer()
            .min(0)
            .required(),
    })
    .required().test("al-menos-uno", "Agregá al menos 1 visitante", (v) =>
        (v?.adultos ?? 0) + (v?.ninos ?? 0) + (v?.bebes ?? 0) > 0
    );