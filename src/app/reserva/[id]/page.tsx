import ReservationCard, { ReservationView } from "@/components/reservation/ReservationCard";

async function fetchReservation(id: string): Promise<ReservationView> {
    const base = process.env.APP_ORIGIN || "http://localhost:3000";

    console.log("APP_ORIGIN:", process.env.APP_ORIGIN)
    const res = await fetch(`${base}/api/reservations/${id}`, {
        cache: "no-store",
    });


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
        <main className="min-h-[calc(100dvh-4rem)] flex items-center justify-center pt-4 bg-background">
            <ReservationCard data={data} />
        </main>
    );
}