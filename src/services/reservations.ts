import type { ReservationFormData } from "@/types/reservation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const MOCK_SUBMIT = !API_URL;

export async function submitReservation(data: ReservationFormData & { reservationDate: string; totalPersonas: number; }): Promise<void> {
  if (MOCK_SUBMIT) {
    await new Promise((r) => setTimeout(r, 700));
    return;
  }

  const res = await fetch(`${API_URL}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let msg = "Error creando reserva";
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
}
