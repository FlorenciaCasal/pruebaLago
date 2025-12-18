// src/schemas/formSchema.ts
import * as yup from "yup";

export const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ ''-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
export const PHONE_RE = /^\d{10}$/;  // exacto 10 dígitos
export const LETTERS_LEN = (s: string) => s.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "").length;

export const formSchema = yup.object({
  nombre: yup.string().transform(v => String(v ?? "").trim())
    .required("Completá tu nombre.")
    .matches(NAME_RE, "Nombre inválido: No se aceptan números ni carateres especiales.")
    .test("min-letters", "Nombre inválido: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3),

  apellido: yup.string().transform(v => String(v ?? "").trim())
    .required("Completá tu apellido.")
    .matches(NAME_RE, "Apellido inválido: No se aceptan números ni carateres especiales.")
    .test("min-letters", "Apellido inválido: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3),

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
    .test("min-letters", "Ciudad de origen inválida: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3),
}).required();

export const nombreSchema = yup
  .string()
  .transform(v => String(v ?? "").trim())
  .required("Completá el nombre.")
  .matches(NAME_RE, "Nombre inválido: no se aceptan números ni caracteres especiales.")
  .test("min-letters", "Nombre inválido: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3);

export const apellidoSchema = yup
  .string()
  .transform(v => String(v ?? "").trim())
  .required("Completá el apellido.")
  .matches(NAME_RE, "Apellido inválido: no se aceptan números ni caracteres especiales.")
  .test("min-letters", "Apellido inválido: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3);

export const dniSchema = yup
  .string()
  .transform(v => String(v ?? "").replace(/\D+/g, ""))
  .required("Completá el DNI.")
  .matches(/^\d{8}$/, "DNI inválido: deben ser exactamente 8 dígitos.");

export const telefonoSchema = yup
  .string()
  .transform(v => String(v ?? "").replace(/\D+/g, ""))
  .test(
    "telefono-opcional",
    "Teléfono inválido: deben ser exactamente 10 dígitos.",
    v => !v || /^\d{10}$/.test(v)
  );

// Un visitante de listado
export const visitanteSchema = yup.object({
  nombre: nombreSchema,
  apellido: apellidoSchema,
  dni: dniSchema,
  telefono: telefonoSchema,
}).required();

// export const TelefonoNRSchema = yup.object({
//   telefono: telefonoSchema.transform(v => String(v ?? "").replace(/\D+/g, "")),
// }).notRequired();