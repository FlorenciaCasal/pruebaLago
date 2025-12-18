
export type Companion = {
    nombre: string;
    apellido: string;
    dni: string;
};

export type AdminReservation = {
    id: string;
    createdAt: string;          // ISO
    reservationDate: string;    // ISO date
    circuito?: string;
    tipoVisitante?: "PARTICULAR" | "INSTITUCION_EDUCATIVA" | "EVENTO";
    nombre?: string;
    apellido?: string;
    telefono?: string;
    correo?: string;
    personas?: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED";
    // notas?: string;
    dni?: string; // Agregado recientemente para hacer busqueda por dni
    companions?: Companion[];
    adultos: number;
    ninos: number;
    bebes: number;
    movilidadReducida: number;      // cantidad
    comentarios?: string;
    originLocation?: string;
};

export type CalendarMonthState = {
    year: number;
    month: number;              // 1-12
    disabled: boolean;          // entire month disabled?
    disabledDays: string[];     // ISO dates disabled within the month
};