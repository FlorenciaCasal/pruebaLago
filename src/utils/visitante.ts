// src/utils/visitante.ts
import type { ReservationFormData } from "@/types/reservation";

export type Visitante = NonNullable<ReservationFormData["tipoVisitante"]>; 
// equivale a "PARTICULAR" | "INSTITUCION_EDUCATIVA"

export function isVisitante(x: unknown): x is Visitante {
  return x === "PARTICULAR" || x === "INSTITUCION_EDUCATIVA";
}
