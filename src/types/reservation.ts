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
  circuito?: string;
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
  tmpDni?: string;
};
