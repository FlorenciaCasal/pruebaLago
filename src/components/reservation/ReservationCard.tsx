import React from "react";

export type ReservationView = {
    id: string;
    visitDate: string; // ISO 2025-12-31
    visitTime: string | null;
    totalVisitors: number;
    firstName: string;
    lastName: string;
    locationUrl: string;
};

export default function ReservationCard({ data }: { data: ReservationView }) {
    const formattedDate = new Date(data.visitDate).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="w-full max-w-xl mx-auto bg-[#f4f5f5] border border-gray-300 rounded-2xl p-6 shadow-md">
            <h1 className="text-2xl font-semibold text-center mb-6">
                Reserva confirmada
            </h1>

            <div className="space-y-4 text-gray-900">
                <p>
                    <span className="font-semibold">Titular:</span>{" "}
                    {data.firstName} {data.lastName}
                </p>

                <p>
                    <span className="font-semibold">Fecha de visita:</span>{" "}
                    {formattedDate}
                </p>

                {data.visitTime && (
                    <p>
                        <span className="font-semibold">Horario:</span>{" "}
                        {data.visitTime} hs
                    </p>
                )}

                <p>
                    <span className="font-semibold">Cantidad de visitantes:</span>{" "}
                    {data.totalVisitors}
                </p>

                <a
                    href={data.locationUrl}
                    target="_blank"
                    className="block w-full text-center bg-[#6fa69f] hover:bg-[#5c938d] text-white font-semibold py-2 rounded-lg transition"
                >
                    Cómo llegar
                </a>

                <p className="text-xs text-gray-600 mt-6 border-t pt-4">
                    Recordá llegar 15 minutos antes.
                    Para conocer las reglas de visita revisá nuestra sección{" "}
                    <a href="/politicas-de-visita" className="underline">
                        Políticas de visita
                    </a>.
                </p>
            </div>
        </div>
    );
}
