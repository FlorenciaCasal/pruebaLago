import type { ReservationFormData } from "@/types/reservation";

export function formatVisitorsFromForm(f?: Pick<ReservationFormData, "adultos" | "ninos" | "bebes">) {
  if (!f) return undefined;
  const total = (f.adultos ?? 0) + (f.ninos ?? 0) + (f.bebes ?? 0);
  return total ? `${total} visitante${total !== 1 ? "s" : ""}` : undefined;
}
