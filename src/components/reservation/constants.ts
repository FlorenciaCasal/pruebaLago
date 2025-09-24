import type { CircuitoKey } from "@/types/reservation";

export const CIRCUITS: ReadonlyArray<{
    key: CircuitoKey;
    titulo: string;
    summary: string;
    img: string;
}> = [
    { key: "A", titulo: "Circuito Panorámico", summary: "Vistas y estaciones clave.", img: "/img/circuito1.jpg" },
    { key: "B", titulo: "Circuito de Senderos", summary: "Recorrido por senderos guiados.", img: "/img/circuito2.jpg" },
    { key: "C", titulo: "Circuito de Senderos", summary: "Ideal para ir con chicos.", img: "/img/circuito3.jpg" },
    { key: "D", titulo: "Circuito de Senderos", summary: "Para grupos con más tiempo.", img: "/img/circuito4.jpg" },
] as const;
