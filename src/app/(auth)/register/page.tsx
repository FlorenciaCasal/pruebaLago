"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


// Regex Unicode para nombres propios: letras (con tildes), espacios, apóstrofes, puntos y guiones
// - Requiere flag "u" para \p{L} y \p{M}

const NAME_RE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '’-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
const LETTERS_LEN = (s: string) => s.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "").length;

const schema = yup.object({
    firstname: yup.string().transform(v => String(v ?? "").trim())
        .required("Completá tu nombre.")
        .matches(NAME_RE, "Nombre inválido: No se aceptan números ni carateres especiales.")
        .test("min-letters", "Nombre inválido: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3),
    lastname: yup.string().transform(v => String(v ?? "").trim())
        .required("Completá tu apellido.")
        .matches(NAME_RE, "Apellido inválido: No se aceptan números ni carateres especiales.")
        .test("min-letters", "Apellido inválido: mínimo 3 letras.", v => LETTERS_LEN(v || "") >= 3),
    email: yup.string().transform(v => String(v ?? "").trim())
        .required("Completá tu email.")
        .email("Email inválido."),
    password: yup.string()
        .min(6, "Mínimo 6 caracteres")
        .max(100, "Máximo 100 caracteres")
        .required("La contraseña es obligatoria"),
    confirmPassword: yup.string()
        .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
        .required("Repetí tu contraseña"),
});

type FormValues = yup.InferType<typeof schema>;

export default function RegisterPage() {
    const [showPwd, setShowPwd] = useState(false);
    const [showPwd2, setShowPwd2] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormValues>({ resolver: yupResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        // TODO: Reemplazar por tu llamada real al backend / proveedor de auth.
        // Ejemplo genérico:
        // const res = await fetch("/api/register", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(values),
        // });
        // if (!res.ok) {
        //   const e = await res.json();
        //   // mostrar notificación de error
        //   return;
        // }
        // Opcional: auto-login o redirigir a /login
        await new Promise((r) => setTimeout(r, 600));
        alert("Registro enviado\n" + JSON.stringify(values, null, 2));
        reset();
    };

    return (
        <main className="min-h-[calc(100dvh-4rem)] w-full bg-neutral-950 text-neutral-100 grid place-items-center px-4">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 shadow-2xl backdrop-blur p-6 sm:p-8">
                    <div className="mb-6 text-center">
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Crear cuenta</h1>
                        <p className="mt-2 text-sm text-neutral-400">
                            ¿Ya tenés cuenta? {" "}
                            <Link href="/login" className="text-white underline-offset-4 hover:underline">
                                Ingresá
                            </Link>
                            .
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-neutral-300">
                                Nombre
                            </label>
                            <input
                                id="name"
                                type="text"
                                autoComplete="name"
                                className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-0 placeholder:text-neutral-500"
                                placeholder="Tu nombre"
                                {...register("firstname")}
                            />
                            {errors.firstname && (
                                <p className="mt-1 text-xs text-red-400">{errors.firstname.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="lastname" className="block text-sm font-medium text-neutral-300">
                                Apellido
                            </label>
                            <input
                                id="lastname"
                                type="text"
                                autoComplete="lastname"
                                className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-0 placeholder:text-neutral-500"
                                placeholder="Tu apellido"
                                {...register("lastname")}
                            />
                            {errors.lastname && (
                                <p className="mt-1 text-xs text-red-400">{errors.lastname.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                                Correo electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-0 placeholder:text-neutral-500"
                                placeholder="tu@correo.com"
                                {...register("email")}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-neutral-300">
                                    Contraseña
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPwd((v) => !v)}
                                    className="text-xs text-neutral-400 hover:text-neutral-200"
                                    aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPwd ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                            <input
                                id="password"
                                type={showPwd ? "text" : "password"}
                                autoComplete="new-password"
                                className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-0 placeholder:text-neutral-500"
                                placeholder="••••••••"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300">
                                    Repetir contraseña
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowPwd2((v) => !v)}
                                    className="text-xs text-neutral-400 hover:text-neutral-200"
                                    aria-label={showPwd2 ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPwd2 ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>
                            <input
                                id="confirmPassword"
                                type={showPwd2 ? "text" : "password"}
                                autoComplete="new-password"
                                className="mt-1 w-full rounded-xl bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-0 placeholder:text-neutral-500"
                                placeholder="••••••••"
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-2 w-full rounded-xl bg-white/95 text-neutral-900 py-2 text-sm font-semibold hover:bg-white focus:outline-none disabled:opacity-70"
                        >
                            {isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
                        </button>
                    </form>
                </div>

                {/* <p className="mt-4 text-center text-xs text-neutral-500">
          Al continuar aceptás nuestros <Link href="/terminos" className="underline underline-offset-2">Términos</Link> y la {" "}
          <Link href="/privacidad" className="underline underline-offset-2">Política de privacidad</Link>.
        </p> */}
            </div>
        </main>
    );
}
