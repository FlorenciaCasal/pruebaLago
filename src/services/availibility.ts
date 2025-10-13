// src/services/availability.ts
export type DayDTO = {
  availableDate: string;              // "YYYY-MM-DD"
  totalCapacity: number | null;
  remainingCapacity: number | null;
};

export async function getDisabledDays(year: number, month: number): Promise<Set<string>> {
  const mm = String(month).padStart(2, "0");
  const res = await fetch(`/api/availability-proxy?month=${year}-${mm}`, { cache: "no-store" });
  if (!res.ok) throw new Error("No se pudo cargar disponibilidad");
  const data: DayDTO[] = await res.json();

  // Consideramos deshabilitado si NO hay cupo
  const disabled = data
    .filter(d => (d.totalCapacity ?? 0) <= 0 || (d.remainingCapacity ?? 0) <= 0)
    .map(d => d.availableDate);

  return new Set(disabled);
}
