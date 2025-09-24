// src/schemas/registerSchema.ts
import * as yup from "yup";

export const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '’-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
export const PHONE_RE = /^[0-9+()\-.\s]{8,20}$/;
export const LETTERS_LEN = (s: string) => s.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "").length;

export const registerSchema = yup.object({
  nombre: yup.string().transform(v => String(v ?? "").trim())
    .required("Completá tu nombre.")
    .matches(NAME_RE, "Nombre inválido: sólo letras, espacios, apóstrofes y guiones.")
    .test("min-letters","Nombre inválido: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3),

  apellido: yup.string().transform(v => String(v ?? "").trim())
    .required("Completá tu apellido.")
    .matches(NAME_RE, "Apellido inválido: sólo letras, espacios, apóstrofes y guiones.")
    .test("min-letters","Apellido inválido: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3),

  dni: yup.string().transform(v => String(v ?? "").replace(/\D+/g, ""))
    .required("Completá tu DNI.")
    .matches(/^\d{8}$/, "DNI inválido: deben ser exactamente 8 dígitos."),

  correo: yup.string().transform(v => String(v ?? "").trim())
    .required("Completá tu email.")
    .email("Email inválido."),

  telefono: yup.string().transform(v => String(v ?? "").trim())
    .required("Completá tu teléfono.")
    .matches(PHONE_RE, "Teléfono inválido."),

  origenVisita: yup.string().transform(v => String(v ?? "").trim())
    .required("Contanos desde dónde nos visitás.")
    .matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ '’-]+$/, "Origen inválido: sólo letras, espacios, apóstrofes y guiones.")
    .test("min-letters","Origen inválido: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3),
}).required();

