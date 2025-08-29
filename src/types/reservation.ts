export type ComoNosConociste = "redes" | "recomendacion" | "sitio" | "publicidad" | "otro";

export type CircuitoKey = "A" | "B" | "C" | "D";

export type ReservationFormData = {
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    correo: string;
    adultos14: number;         // 14+ (incluye titular)
    menores14: number;         // < 14
    movilidadReducida: number; // subset de los anteriores
    alergias: "si" | "no";
    detalleAlergias?: string;
    comentarios?: string;
    origenVisita: string;
    comoNosConociste: ComoNosConociste | "";
    aceptaReglas: boolean;
    personas?: { nombre: string; apellido: string; dni: string }[];
    circuito?: CircuitoKey;
    fechaISO?: string;
};
