import ReservationCard, { ReservationView } from "@/components/reservation/ReservationCard";

async function fetchReservation(id: string): Promise<ReservationView> {
    // const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // const res = await fetch(`${base}/api/reservations/${id}`, {
    //     cache: "no-store",
    // });
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/reservations/${id}`);

    if (!res.ok) throw new Error("No se pudo cargar la reserva");

    return res.json();
}

export default async function ReservationPage({
    params,
}: {
    // params: { id: string };
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    // const data = await fetchReservation(params.id);
    const data = await fetchReservation(id);

    return (
        <main className="min-h-[calc(100dvh-4rem)] flex items-center justify-center p-4 bg-white">
            <ReservationCard data={data} />
        </main>
    );
}