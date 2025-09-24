import { inputBase } from "@/styles/ui";
import type { UseFormRegister } from "react-hook-form";
import type { ReservationFormData } from "@/types/reservation";

export default function InstitucionStep({
    register,
    uxError,
}: {
    register: UseFormRegister<ReservationFormData>;
    uxError: string | null;
}) {
    return (
        <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
                <input {...register("institucion")} placeholder="Nombre de la institución" className={inputBase} />
                <input {...register("institucionLocalidad")} placeholder="Localidad" className={inputBase} />
                <input {...register("institucionEmail")} placeholder="Email" className={inputBase} />
                <input {...register("institucionTelefono")} placeholder="Teléfono" className={inputBase} />
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
                <input {...register("responsableNombre")} placeholder="Nombre (responsable)" className={inputBase} />
                <input {...register("responsableApellido")} placeholder="Apellido (responsable)" className={inputBase} />
                <input {...register("responsableDni")} placeholder="DNI (responsable)" className={inputBase} />
            </div>

            {uxError && <p className="text-red-400 text-sm">{uxError}</p>}
        </div>
    );
}
