"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Resolver, SubmitHandler } from "react-hook-form";
import { ChevronDown, ChevronUp } from "lucide-react";


interface Acompaniante {
    dni: string;
    nacimiento: string; // cambio a string
}

interface RegisterFormProps {
    fechaSeleccionada: Date | null;
}

const schema = yup.object({
    nombre: yup.string()
        .required("El nombre es obligatorio")
        .min(3, "Mínimo 3 caracteres")
        .matches(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/, "Solo letras y espacios"),
    apellido: yup.string()
        .required("El apellido es obligatorio")
        .min(3, "Mínimo 3 caracteres")
        .matches(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/, "Solo letras y espacios"),
    dni: yup.string()
        .required("El DNI es obligatorio")
        .matches(/^\d{8}$/, "Debe tener 8 dígitos"),
    telefono: yup.string()
        .required("El teléfono es obligatorio")
        .matches(/^\d{10,11}$/, "Ingresá sin 0 ni 15"),
    email: yup.string().required("El email es obligatorio").email(),
    nacimiento: yup
        // .date()
        .string()
        .typeError("Debe ser una fecha válida")
        .matches(/^\d{4}-\d{2}-\d{2}$/, "Debe tener formato YYYY-MM-DD")
        .test("mayor-de-18", "Debes ser mayor de 18 años", (value) => {
            if (!value) return false;
            const fechaNacimiento = new Date(value);
            const hoy = new Date();
            const fecha18 = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
            return fechaNacimiento <= fecha18;
        })
        .required("La fecha es obligatoria"),
    tipoVisitante: yup
        .string<"particular" | "institucionEducativa">()
        .required("Debe seleccionar el tipo de visitante"),

    cantidadAcompaniantes: yup
        .number()
        .typeError("Debe ingresar un número")
        .min(0, "No puede ser negativo")
        .required("Debe ingresar la cantidad de acompañantes"),

    acompaniantes: yup
        .array()
        .of(
            yup.object({
                dni: yup
                    .string()
                    .matches(/^\d{8}$/, "El DNI debe tener 8 dígitos")
                    .required("El DNI del acompañante es obligatorio"),
                nacimiento: yup
                    .string()
                    .typeError("Debe ser una fecha válida")
                    .matches(/^\d{4}-\d{2}-\d{2}$/, "Debe tener formato YYYY-MM-DD")
                    .test("es-fecha-valida", "Fecha inválida", (value) => {
                        if (!value) return false;
                        return !isNaN(Date.parse(value));
                    })
                    .required("La fecha de nacimiento del acompañante es obligatoria"),
            })
        )
        .when(["tipoVisitante", "cantidadAcompaniantes"], {
            is: (tipo: "particular" | "institucionEducativa", cantidad?: number) =>
                tipo === "particular" && (cantidad ?? 0) > 0,
            then: (schema) =>
                schema.required().min(1, "Debe agregar al menos un acompañante"),
            otherwise: (schema) => schema.notRequired(),
        }),
    cantidadEstudiantes: yup.number().when("tipoVisitante", {
        is: "institucionEducativa",
        then: (schema) => schema.required("Cantidad obligatoria").min(1),
        otherwise: (schema) => schema.notRequired(),
    }),
    comentario: yup.string().notRequired(),
});

type BaseFormData = yup.InferType<typeof schema> & { acompaniantes: Acompaniante[] };
type FormData = Omit<BaseFormData, "cantidadEstudiantes"> & {
    cantidadEstudiantes?: number; // la hacemos opcional para evitar conflicto TS
};

// Resolver tipado
const resolver: Resolver<FormData> = yupResolver(schema) as Resolver<FormData>;

export default function Registro({ fechaSeleccionada }: RegisterFormProps) {
    const [acompaniantes, setAcompaniantes] = useState<Acompaniante[]>([]);
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [dni, setDni] = useState("");
    const [dniError, setDniError] = useState<string | null>(null);
    const [telefono, setTelefono] = useState("");
    const [telefonoError, setTelefonoError] = useState<string | null>(null);
    const [nombreError, setNombreError] = useState<string | null>(null);
    const [apellidoError, setApellidoError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [mostrarAcompaniantes] = useState(false);
    const [acompanianteAbierto, setAcompanianteAbierto] = useState<boolean[]>([]);


    const { register, handleSubmit, watch, control, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver,
        defaultValues: {
            tipoVisitante: "particular",
            cantidadAcompaniantes: 0,
            acompaniantes: [],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "acompaniantes",
    });

    const cantidadAcompaniantes = watch("cantidadAcompaniantes");
    const tipoVisitante = watch("tipoVisitante");

    // Mantener cantidad de acompañantes sincronizada con el array
    useEffect(() => {
        if (tipoVisitante === "particular") {
            const diff = cantidadAcompaniantes - fields.length;
            if (diff > 0) {
                for (let i = 0; i < diff; i++) append({ dni: "", nacimiento: new Date().toISOString().split("T")[0] });
            } else if (diff < 0) {
                for (let i = 0; i < Math.abs(diff); i++) remove(fields.length - 1 - i);
            }
        } else {
            setValue("acompaniantes", []);
        }
    }, [cantidadAcompaniantes, tipoVisitante, append, fields.length, remove, setValue]);


    const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTelefono(value);

        if (!/^\d*$/.test(value)) {
            setTelefonoError("El teléfono solo puede contener números");
        } else if (value.length < 10 || value.length > 11) {
            setTelefonoError("Ingresá el celular sin el 0 y sin el 15 (10-11 dígitos)");
        } else {
            setTelefonoError(null);
        }
        setValue("telefono", value);
    };

    const handleDniChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDni(value);
        if (!/^\d*$/.test(value)) {
            setDniError("El DNI solo puede contener números");
        } else if (value.length !== 8) {
            setDniError("El DNI debe tener exactamente 8 dígitos");
        } else {
            setDniError(null);
        }
    };

    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const onlyLetters = value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, "");

        if (value !== onlyLetters) {
            setNombreError("Solo se permiten letras y espacios");
        } else if (value.length < 3) {
            setNombreError("El nombre debe contener al menos 3 caracteres");
        } else {
            setNombreError(null);
        }
        setValue("nombre", onlyLetters);
    };

    const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const onlyLetters = value.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ\s]/g, "");

        if (value !== onlyLetters) {
            setApellidoError("Solo se permiten letras y espacios");
        } else if (value.length < 3) {
            setApellidoError("El apellido debe contener al menos 3 caracteres");
        } else {
            setApellidoError(null);
        }

        setValue("apellido", onlyLetters)
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Regex básico para validar email en tiempo real
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.length === 0 || emailRegex.test(value)) {
            setEmailError(null);
        } else {
            setEmailError("Debe tener un formato de email válido (ej: usuario@dominio.com)");
        }
        setValue("email", value)
    };



    // const onSubmit = async (data: FormData) => {
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            if (!fechaSeleccionada) {
                throw new Error("No hay fecha seleccionada");
            }

            console.log("Paso 2: creando reserva...");
            const reservationResponse = await fetch("http://localhost:8080/api/reservations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: data.nombre,
                    email: data.email,
                    dni: data.dni,
                    telefono: data.telefono,
                    nacimiento: data.nacimiento,
                    reservationDate: fechaSeleccionada.toISOString().split("T")[0],
                    tipoVisitante: data.tipoVisitante,
                    cantidadAcompaniantes: data.tipoVisitante === "particular" ? data.cantidadAcompaniantes : undefined,
                    acompaniantes: data.tipoVisitante === "particular" ? acompaniantes : undefined,
                    cantidadEstudiantes: data.tipoVisitante === "institucionEducativa" ? data.cantidadEstudiantes : undefined,
                    comentario: data.comentario,
                }),
            });

            if (!reservationResponse.ok) {
                const errorText = await reservationResponse.text();
                throw new Error(`Error creando reserva: ${reservationResponse.status} - ${errorText}`);
            }

            const reservation = await reservationResponse.json();
            console.log("Reserva creada:", reservation);

            setSuccessMsg("Registro y reserva exitosos");
        } catch {
            console.error();
            setServerError("Error inesperado");
        }
    };


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl space-y-6">
            {fechaSeleccionada && (
                <p className="text-lg text-gray-700">
                    Fecha seleccionada: <span className="font-semibold">{fechaSeleccionada.toLocaleDateString()}</span>
                </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* 👇 Acá usamos un grid con 2 columnas en md+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre</label>
                        <input
                            type="text"
                            {...register("nombre")}
                            onChange={handleNombreChange}
                            className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2 transition-all duration-200" />
                        {errors.nombre && <p className="text-sm text-red-500">{errors.nombre.message}</p>}
                        {nombreError && <p className="text-sm text-red-500">{nombreError}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Apellido</label>
                        <input
                            type="text"
                            {...register("apellido")}
                            onChange={handleApellidoChange}
                            className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2 transition-all duration-200" />
                        {errors.apellido && <p className="text-sm text-red-500">{errors.apellido.message}</p>}
                        {apellidoError && <p className="text-sm text-red-500">{apellidoError}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">DNI</label>
                        <input
                            type="text"
                            {...register("dni")}
                            value={dni}
                            onChange={handleDniChange}
                            className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2 transition-all duration-200" />
                        {dniError && <p className="text-sm text-red-500">{dniError}</p>}
                        {!dniError && errors.dni && <p className="text-sm text-red-500">{errors.dni.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Teléfono <span className="text-xs text-gray-500">(sin 0 y sin 15)</span>
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="\d*"
                            {...register("telefono")}
                            value={telefono}
                            onChange={handleTelefonoChange}
                            className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2 transition-all duration-200" />
                        {telefonoError && <p className="text-sm text-red-500">{telefonoError}</p>}
                        {!telefonoError && errors.telefono && <p className="text-sm text-red-500">{errors.telefono.message}</p>}
                    </div>


                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            onChange={handleEmailChange}
                            className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2 transition-all duration-200" />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                        {emailError && <p className="text-sm text-red-500">{emailError}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Fecha de nacimiento</label>
                        <input
                            type="date"
                            {...register("nacimiento")}
                            className="appearance-none w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2 transition-all duration-200" />
                        {errors.nacimiento && <p className="text-sm text-red-500">{errors.nacimiento.message}</p>}
                    </div>

                    <div>
                        <div>
                            <label className="block text-sm font-medium mb-1">¿Qué tipo de visitante sos?</label>
                            <label className="flex items-center space-x-2 text-sm">
                                <input
                                    type="radio"
                                    value="particular"
                                    {...register("tipoVisitante")}
                                    className="form-radio"
                                />
                                <span>Particular</span>
                            </label>
                            <label className="flex items-center space-x-2 text-sm mt-1">
                                <input
                                    type="radio"
                                    value="institucionEducativa"
                                    {...register("tipoVisitante")}
                                    className="form-radio"
                                />
                                <span>Institución educativa</span>
                            </label>
                            {errors.tipoVisitante && <p className="text-sm text-red-500 mt-1">{errors.tipoVisitante.message}</p>}
                        </div>

                        {tipoVisitante === "particular" && (
                            <div>
                                <label className="block text-sm font-medium mt-3">¿Con cuántas personas vas a venir?</label>
                                <input
                                    type="number"
                                    min={0}
                                    {...register("cantidadAcompaniantes", { valueAsNumber: true })}
                                    className="w-full border-b border-gray-300 focus:border-blue-600 py-2"
                                />
                                {errors.cantidadAcompaniantes && <p className="text-sm text-red-500">{errors.cantidadAcompaniantes.message}</p>}
                            </div>
                        )}

                        {tipoVisitante === "particular" && cantidadAcompaniantes > 0 && (
                            <div className="mt-4 space-y-4">
                                {Array.from({ length: cantidadAcompaniantes }).map((_, i) => (
                                    <div key={i} className="border p-4 rounded bg-gray-50">
                                        <h4 className="font-semibold mb-2">Acompañante #{i + 1}</h4>

                                        <div>
                                            <label className="text-sm font-medium">DNI</label>
                                            <input
                                                type="text"
                                                {...register(`acompaniantes.${i}.dni`)}
                                                className="w-full border-b border-gray-300 py-2"
                                            />
                                            {errors.acompaniantes?.[i]?.dni && (
                                                <p className="text-sm text-red-500">{errors.acompaniantes[i]?.dni?.message}</p>
                                            )}
                                        </div>

                                        <div className="mt-2">
                                            <label className="text-sm font-medium">Fecha de nacimiento</label>
                                            <input
                                                type="date"
                                                {...register(`acompaniantes.${i}.nacimiento`)}
                                                className="w-full border-b border-gray-300 py-2"
                                            />
                                            {errors.acompaniantes?.[i]?.nacimiento && (
                                                <p className="text-sm text-red-500">{errors.acompaniantes[i]?.nacimiento?.message}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {mostrarAcompaniantes && acompaniantes.map((acom, i) => (
                            <div key={i} className="border p-4 rounded-md space-y-2 bg-gray-50">
                                <h4 className="font-semibold flex items-center justify-between">
                                    Acompañante #{i + 1}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setAcompanianteAbierto(prev => {
                                                const newState = [...prev];
                                                newState[i] = !newState[i];
                                                return newState;
                                            })
                                        }
                                    >
                                        {acompanianteAbierto[i] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                </h4>
                                {acompanianteAbierto[i] && (
                                    <>
                                        <div>
                                            <label className="text-sm font-medium">DNI</label>
                                            <input
                                                type="text"
                                                value={acom.dni}
                                                // onChange={}
                                                className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Fecha de nacimiento</label>
                                            <input
                                                type="text"
                                                value={acom.nacimiento}
                                                onChange={(e) => {
                                                    const newList = [...acompaniantes];
                                                    newList[i].nacimiento = e.target.value;
                                                    setAcompaniantes(newList);
                                                }}
                                                className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}

                        {tipoVisitante === "institucionEducativa" && (
                            <div>
                                <label className="block text-sm font-medium mt-3">¿Cuántos estudiantes vienen?</label>
                                <input
                                    type="number"
                                    min={1}
                                    {...register("cantidadEstudiantes")}
                                    className="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2"
                                />
                                {errors.cantidadEstudiantes && (
                                    <p className="text-sm text-red-500">{errors.cantidadEstudiantes.message}</p>
                                )}
                            </div>
                        )}

                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Comentario o motivo de la visita (opcional)</label>
                        <textarea
                            {...register("comentario")}
                            rows={4}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.comentario && <p className="text-sm text-red-500">{errors.comentario.message}</p>}
                    </div>
                </div>

                {serverError && <p className="text-red-600 text-sm text-center">{serverError}</p>}
                {successMsg && <p className="text-green-600 text-sm text-center">{successMsg}</p>}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {isSubmitting ? "Reservando..." : "Reservar"}
                </button>
            </form>
        </div>
    );
}
