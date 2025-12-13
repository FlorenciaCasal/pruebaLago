import React from "react";
import { RESERVA_LOCATION } from "@/utils/location";


export type ReservationView = {
    id: string;
    visitDate: string; // ISO 2025-12-31
    // visitTime: string | null;
    totalVisitors: number;
    adults18Plus: number;
    children2To17: number;
    babiesLessThan2: number;
    // firstName: string;
    // lastName: string;
    // locationLat: string;
    // locationLng: string;
};

export default function ReservationCard({ data }: { data: ReservationView }) {
    const formattedDate = new Date(data.visitDate).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
    const mapEmbed = `https://www.google.com/maps?q=${RESERVA_LOCATION.lat},${RESERVA_LOCATION.lng}&z=15&output=embed`;
    const mapRoute = `https://www.google.com/maps/dir/?api=1&destination=${RESERVA_LOCATION.lat},${RESERVA_LOCATION.lng}`;

    function pluralize(count: number, singular: string, plural: string) {
        return `${count} ${count === 1 ? singular : plural}`;
    }

    function formatVisitors(data: ReservationView) {
        const parts = [];

        if (data.adults18Plus > 0)
            parts.push(pluralize(data.adults18Plus, "adulto", "adultos"));

        if (data.children2To17 > 0)
            parts.push(pluralize(data.children2To17, "menor", "menores"));

        if (data.babiesLessThan2 > 0)
            parts.push(pluralize(data.babiesLessThan2, "bebé", "bebés"));

        return parts.length > 0 ? parts.join(" · ") : "Sin visitantes registrados";
    }


    return (
        <main className="min-h-screen bg-background px-4 py-8 flex justify-center">
            <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6 space-y-6">

                {/* HEADER */}
                <div className="text-center space-y-2">
                    <div className="text-green-600 rounded-100 text-4xl">✅</div>
                    <h1 className="text-xl font-bold">
                        ¡Tu Visita ha sido Confirmada!
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Código de Reserva: <span className="font-semibold">{data.id}</span>
                    </p>
                </div>

                {/* DETAILS */}
                <div className="space-y-3">
                    <div>
                        <p className="font-semibold">Lugar</p>
                        <p className="text-gray-700">Reserva Natural Lago Escondido</p>
                    </div>

                    <div>
                        <p className="font-semibold">Fecha</p>
                        <p className="text-gray-700">
                            {formattedDate}
                        </p>
                    </div>
                    {/* <div>
                        <p className="font-semibold">Horario de ingreso</p>
                        <p className="text-gray-700">
                            {data.visitTime} hs
                        </p> */}
                    <div className="space-y-1">
                        <p className="font-semibold">Horario</p>
                        <p className="text-gray-700">
                            <span className="text-sm">⏳</span> 09:00 hs</p>
                        {/* <p className="text-sm">⏳ Por favor, llegá 15 minutos antes.</p> */}
                        <p className="text-sm text-green-700 flex items-center">

                            Por favor, llegá 15 minutos antes.
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold">Visitantes</p>
                        {/* <p className="text-gray-700">{data.adults18Plus} adultos - {data.children2To17} menores - {data.babiesLessThan2} bebés</p> */}
                        <p className="text-gray-700">{formatVisitors(data)}</p>

                    </div>
                </div>

                {/* MAP */}
                <div className="space-y-3">
                    <p className="font-semibold">Ubicación</p>

                    <iframe
                        src={mapEmbed}
                        className="w-full h-48 rounded-md"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>

                    <a
                        href={mapRoute}
                        target="_blank"
                        className="block w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md text-center font-semibold"
                    >
                        Abrir en Google Maps
                    </a>
                </div>

                {/* POLÍTICAS */}
                <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">📣 Indicaciones para tu visita</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Llegar 15 minutos antes.</li>
                        <li>No dejar basura ni alimentar a la fauna.</li>
                        <li>Está prohibido ingresar con mascotas.</li>
                        {/* <li>Si ya tenés una reserva y no podés asistir, por favor avisanos a traves de nuestro WhatsApp.</li> */}
                    </ul>
                </div>

            </div>
        </main>
    );
}
