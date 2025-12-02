import { NextResponse, NextRequest } from "next/server";

type MockReservation = {
    id: string;
    visitDate: string;
    visitTime: string | null;
    totalVisitors: number;
    adults18Plus: number,
    children2To17: number,
    babiesLessThan2: number,
    firstName: string;
    lastName: string;
    // locationUrl: string;
    locationLat: string;
    locationLng: string;
};

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;


    //  Mock temporal para pruebas
    const mockData: MockReservation = {
        id,
        visitDate: "2025-12-31",
        visitTime: "09:00",
        totalVisitors: 5,
        adults18Plus: 3,
        children2To17: 0,
        babiesLessThan2: 1,
        firstName: "Martina",
        lastName: "Guerzi",
        // locationUrl:
        //     "https://www.google.com/maps?q=-41.740568,-71.483703",
        locationLat: " -41.740568",
        locationLng: "-71.483703",


    };

    return NextResponse.json(mockData, { status: 200 });
}

// cuando el back este listo:
// const backend = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

//     const res = await fetch(`${backend}/reservations/${id}`);

//     if (!res.ok) {
//         return NextResponse.json(
//             { error: "No se pudo obtener la reserva" },
//             { status: res.status }
//         );


