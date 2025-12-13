import { NextResponse, NextRequest } from "next/server";

type MockReservation = {
    id: string;
    visitDate: string;
    // visitTime: string | null;
    totalVisitors: number;
    adults18Plus: number,
    children2To17: number,
    babiesLessThan2: number,
    // firstName: string;
    // lastName: string;
    // locationUrl: string;
    // locationLat: string;
    // locationLng: string;
};

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    type ErrorPayload = { error: string };

    const backend = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const res = await fetch(`${backend}/api/reservations/${id}`, {
        cache: "no-store",
    });

    // if (!res.ok) {
    //     let payload: ErrorPayload = { error: "No se pudo obtener la reserva" };
    //     try {
    //         payload = await res.json();
    //     } catch { }
    //     return NextResponse.json(payload, { status: res.status });
    // }
    if (!res.ok) {
        let payload: ErrorPayload = { error: "No se pudo obtener la reserva" };

        try {
            const json = await res.json();

            if (
                typeof json === "object" &&
                json !== null &&
                "error" in json &&
                typeof (json as { error: unknown }).error === "string"
            ) {
                payload = { error: (json as { error: string }).error };
            }
        } catch { }
        return NextResponse.json(payload, { status: res.status });
    }

    const dto = await res.json();

    const adults18Plus = dto.adults18Plus ?? 0;
    const children2To17 = dto.children2To17 ?? 0;
    const babiesLessThan2 = dto.babiesLessThan2 ?? 0;

    const mockData: MockReservation = {
        id: dto.id,
        visitDate: dto.visitDate,          // LocalDate -> string ISO
        // visitTime: null,                   // no existe en el backend
        adults18Plus,
        children2To17,
        babiesLessThan2,
        totalVisitors: adults18Plus + children2To17 + babiesLessThan2,

        // ⚠️ NO vienen en el DTO
        // firstName: "",
        // lastName: "",
        // locationLat: "",
        // locationLng: "",
    };

    return NextResponse.json(mockData, { status: 200 });
}



