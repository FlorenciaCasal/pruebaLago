import * as yup from "yup";
import { NAME_RE } from "./registerSchema";
import { LETTERS_LEN } from "./registerSchema";


export const listadoSchema = yup.object({
    nombre: yup.string().transform(v => String(v ?? "").trim())
        .required("Completá el nombre del/la responsable.")
        .matches(NAME_RE, "Nombre y/o Apellido inválido: sólo letras, espacios, apóstrofes y guiones.")
        .test("min-letters", "Nombre y/o Apellido inválido: mínimo 3 letras cada uno.", v => LETTERS_LEN(v || "") >= 3),
    apellido: yup.string().transform(v => String(v ?? "").trim())
        .required("Completá el apellido del/la responsable.")
        .matches(NAME_RE, "Nombre y/o Apellido inválido: sólo letras, espacios, apóstrofes y guiones.")
        .test("min-letters", "Nombre y/o Apellido inválido: mínimo 3 letras cada uno.", v => LETTERS_LEN(v || "") >= 3),
    dni: yup.string()
        .transform(v => String(v ?? "").replace(/\D+/g, ""))
        .required("Completá el DNI del visitante.")
        .matches(/^\d{8}$/, "DNI inválido: deben ser exactamente 8 dígitos."),
}).required();

/** La lista completa, con cantidad exacta y DNI únicos */
export const listadoSchemaExact = (n: number) =>
    yup.array().of(listadoSchema)
        .min(n, `Debés cargar ${n} visitante${n === 1 ? "" : "s"}.`)
        .max(n, `Debés cargar ${n} visitante${n === 1 ? "" : "s"}.`)
        .test("dni-unique", "Hay DNIs repetidos en la lista.", (arr) => {
            if (!arr) return false;
            const seen = new Set<string>();
            for (const it of arr) {
                // const d = String((it as any)?.dni ?? "");
                const d = it?.dni ?? "";
                if (!d) return false;
                if (seen.has(d)) return false;
                seen.add(d);
            }
            return true;
        })
        .required();