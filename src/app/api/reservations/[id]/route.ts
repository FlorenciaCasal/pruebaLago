import { NextResponse, NextRequest } from "next/server";

type MockReservation = {
    id: string;
    visitDate: string;
    visitTime: string | null;
    totalVisitors: number;
    firstName: string;
    lastName: string;
    locationUrl: string;
};

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;


    // 🟢 Mock temporal para pruebas
    const mockData: MockReservation = {
        id,
        visitDate: "2025-12-31",
        visitTime: "09:00",
        totalVisitors: 5,
        firstName: "Martina",
        lastName: "Guerzi",
        locationUrl:
            "https://www.google.com/maps?q=-41.7166667,-71.6666667",
    };

    return NextResponse.json(mockData, { status: 200 });
}
