// src/schemas/registerSchema.ts
import * as yup from "yup";

export const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ ''-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
export const PHONE_RE = /^\d{10}$/;  // exacto 10 dígitos
export const LETTERS_LEN = (s: string) => s.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "").length;

export const formSchema = yup.object({
  nombre: yup.string().transform(v => String(v ?? "").trim())
    .required("Completá tu nombre.")
    .matches(NAME_RE, "Nombre inválido: No se aceptan números ni carateres especiales.")
    .test("min-letters","Nombre inválido: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3),

  apellido: yup.string().transform(v => String(v ?? "").trim())
    .required("Completá tu apellido.")
    .matches(NAME_RE, "Apellido inválido: No se aceptan números ni carateres especiales.")
    .test("min-letters","Apellido inválido: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3),

  dni: yup.string().transform(v => String(v ?? "").replace(/\D+/g, ""))
    .required("Completá tu DNI.")
    .matches(/^\d{8}$/, "DNI inválido: deben ser exactamente 8 dígitos."),

  correo: yup.string().transform(v => String(v ?? "").trim())
    .required("Completá tu email.")
    .email("Email inválido."),

  telefono: yup.string().transform(v => String(v ?? "").replace(/\D+/g, ""))
    .required("Completá tu teléfono.")
    .matches(PHONE_RE, "Teléfono inválido: deben ser exactamente 10 dígitos."),

  origenVisita: yup.string().transform(v => String(v ?? "").trim())
    .required("Completá tu ciudad de origen.")
    .matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ,.''-]+$/, "Ciudad de origen inválida: No se aceptan números.")
    .test("min-letters","Ciudad de origen inválida: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3),
}).required();