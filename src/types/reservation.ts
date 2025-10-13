export type ComoNosConociste = "redes" | "recomendacion" | "sitio" | "publicidad" | "otro";

export type CircuitoKey = "A" | "B" | "C" | "D";


export type ReservationFormData = {
  nombre?: string; apellido?: string; dni?: string; telefono?: string; correo?: string; origenVisita?: string;
  adultos: number;        // 18+
  ninos: number;          // 2–17
  bebes: number;          // <2
  movilidadReducidaSiNo?: "si" | "no";
  movilidadReducida: number;
  alergias?: "si" | "no";
  alergicos: number;
  detalleAlergias?: string;
  comentarios?: string;
  comoNosConociste?: ComoNosConociste;
  aceptaReglas: boolean;
  tipoVisitante?: "PARTICULAR" | "INSTITUCION_EDUCATIVA";
  // circuito?: string;
  fechaISO?: string;
  personas: { nombre: string; apellido: string; dni: string }[];
  institucion?: string;
  institucionLocalidad?: string;
  institucionEmail?: string;
  institucionTelefono?: string;
  responsableNombre?: string;
  responsableApellido?: string;
  responsableDni?: string;
  tmpNombreApe?: string;
  tmpDni?: string;reservationDate?: string;  // opcional, derivada de fechaISO
  totalPersonas?: number;    // opcional, adultos+ninos+bebes
};


// Tipo de respuesta del backend
export type BackendReservationDTO = {
  id: string;
  visitDate: string;
  firstName: string;
  lastName: string;
  adults18Plus: number;
  children2To17: number;
  babiesLessThan2: number;
  email: string;
  phone: string;
  circuit: string;
  visitorType: string;
  originLocation: string;
  status: string;
  createdAt: string;
};