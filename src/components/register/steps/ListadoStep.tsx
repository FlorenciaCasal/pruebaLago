import { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { inputBase } from "@/styles/ui";
import type {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { ReservationFormData } from "@/types/reservation";
import { visitanteSchema } from "@/schemas/formSchema";
import * as yup from "yup";

export default function ListadoStep({
  fields, register, watch, append, remove, setValue,
  totalEsperado, tipo, uxError, onListChanged, reservaAsiste,
}: {
  fields: FieldArrayWithId<ReservationFormData, "personas", "id">[];
  register: UseFormRegister<ReservationFormData>;
  watch: UseFormWatch<ReservationFormData>;
  append: UseFieldArrayAppend<ReservationFormData, "personas">;
  remove: UseFieldArrayRemove;
  setValue: UseFormSetValue<ReservationFormData>;
  totalEsperado: number;
  reservaAsiste: boolean;
  tipo: "PARTICULAR" | "INSTITUCION_EDUCATIVA" | null;
  uxError: string | null;
  onListChanged?: () => void;
}) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [backup, setBackup] = useState<{ nombre: string; apellido: string; dni: string, telefono: string } | null>(null);
  const canAddMore = fields.length < totalEsperado;

  const [editErrors, setEditErrors] = useState<{
    nombre?: string;
    apellido?: string;
    dni?: string;
    telefono?: string;
  }>({});

  const [localErrors, setLocalErrors] = useState<{
    nombreApe?: string;
    dni?: string;
    telefono?: string;
  }>({});

  const validateVisitor = async (data: { nombre: string; apellido: string; dni: string; telefono?: string }) => {
    try {
      await visitanteSchema.validate(data, { abortEarly: false });
      return {} as Record<string, string>;
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        const out: Record<string, string> = {};
        for (const err of e.inner) {
          if (err.path && !out[err.path]) out[err.path] = err.message;
        }
        return out;
      }
      return { _form: "Revisá los datos." };
    }
  };

  const startEdit = (i: number) => {
    setEditErrors({});
    const nombre = String(watch(`personas.${i}.nombre`) ?? "");
    const apellido = String(watch(`personas.${i}.apellido`) ?? "");
    const dni = String(watch(`personas.${i}.dni`) ?? "");
    const telefono = String(watch(`personas.${i}.telefono`) ?? "");
    setBackup({ nombre, apellido, dni, telefono });
    setEditIndex(i);
  };

  const cancelEdit = () => {
    if (editIndex !== null && backup) {
      setValue(`personas.${editIndex}.nombre`, backup.nombre, { shouldDirty: true });
      setValue(`personas.${editIndex}.apellido`, backup.apellido, { shouldDirty: true });
      setValue(`personas.${editIndex}.dni`, backup.dni, { shouldDirty: true });
      setValue(`personas.${editIndex}.telefono`, backup.telefono, { shouldDirty: true });

    }
    setEditIndex(null);
    setBackup(null);
    setEditErrors({});
  };

  const saveEdit = async () => {

    if (editIndex === null) return;

    const data = {
      nombre: String(watch(`personas.${editIndex}.nombre`) ?? ""),
      apellido: String(watch(`personas.${editIndex}.apellido`) ?? ""),
      dni: String(watch(`personas.${editIndex}.dni`) ?? ""),
      telefono: String(watch(`personas.${editIndex}.telefono`) ?? ""),
    };

    const errs = await validateVisitor(data);

    if (Object.keys(errs).length) {
      setEditErrors(errs);
      return; // ❌ NO cerramos edición
    }

    // OK
    setEditErrors({});
    setEditIndex(null);
    setBackup(null);
    onListChanged?.();
  };


  return (
    <div className="space-y-4">
      {/* {tipo === "PARTICULAR" && ( */}
      <p className="text-sm">
        {reservaAsiste ? (
          <> Cargá a todas las personas que asistirán, excepto al responsable.
            <span className="block text-xs text-gray-600">
              El mismo fue incluido automáticamente en el paso anterior.
            </span>
          </>
        ) : (
          "Cargá a todas las personas que asistirán."
        )}
      </p>
      {/* )} */}

      {/* mini form para agregar */}
      <div className="rounded-lg border border-gray-900 bg-white/5 p-4 space-y-3">
        <input
          {...register("tmpNombreApe")}
          placeholder="Nombre y apellido"
          className={`${inputBase} ${localErrors.nombreApe ? "border-red-500" : ""}`}
          disabled={!canAddMore}
        // maxLength={120}
        />
        {localErrors.nombreApe && (
          <p className="text-xs text-red-500">{localErrors.nombreApe}</p>
        )}
        <input
          {...register("tmpDni", {
            setValueAs: v => String(v ?? "").replace(/\D+/g, "").slice(0, 8),
          })}
          placeholder="DNI (8 dígitos)"
          className={`${inputBase} ${localErrors.dni ? "border-red-500" : ""}`}
          disabled={!canAddMore}
        // inputMode="numeric"
        // pattern="^[0-9]{8}$"
        // maxLength={8}
        />
        {localErrors.dni && (
          <p className="text-xs text-red-500">{localErrors.dni}</p>
        )}
        <input
          {...register("tmpTelefono", {
            setValueAs: v => String(v ?? "").replace(/\D+/g, "").slice(0, 10),
          })}
          placeholder="Teléfono (10 dígitos)"
          className={`${inputBase} ${localErrors.telefono ? "border-red-500" : ""}`}

          disabled={!canAddMore}
        // inputMode="numeric"
        // pattern="^[0-9]{10}$"
        // maxLength={10}
        />
        {localErrors.telefono && (
          <p className="text-xs text-red-500">{localErrors.telefono}</p>
        )}
        <div className="flex justify-end">
          <button
            type="button"
            className={`rounded-md border border-gray-900 hover:bg-gray-100 bg-white text-gray-900 px-4 py-2 ${!canAddMore ? "opacity-50 cursor-not-allowed" : ""
              }`}

            onClick={async () => {
              if (!canAddMore) return;

              const na = (watch("tmpNombreApe") ?? "").toString().trim();
              const parts = na.split(/\s+/).filter(Boolean);

              // si querés mantener el mensaje específico para “nombre y apellido”
              if (parts.length < 2) {
                setLocalErrors({ nombreApe: "Ingresá nombre y apellido completos." });
                return;
              }

              const data = {
                nombre: parts[0],
                apellido: parts.slice(1).join(" "),
                dni: (watch("tmpDni") ?? "").toString(),
                telefono: (watch("tmpTelefono") ?? "").toString(),
              };

              const errs = await validateVisitor(data);

              if (Object.keys(errs).length) {
                setLocalErrors({
                  nombreApe: errs.nombre || errs.apellido,
                  dni: errs.dni,
                  telefono: errs.telefono,
                });
                return;
              }

              setLocalErrors({});
              append({
                nombre: data.nombre,
                apellido: data.apellido,
                dni: data.dni.replace(/\D+/g, "").slice(0, 8),
                telefono: data.telefono.replace(/\D+/g, "").slice(0, 10),
              });

              setValue("tmpNombreApe", "");
              setValue("tmpDni", "");
              setValue("tmpTelefono", "");
              onListChanged?.();
            }}

            disabled={!canAddMore}
          >
            Agregar
          </button>
        </div>

        <p className="text-xs text-neutral-600">
          📌 Recordá cargar el teléfono de los visitantes adultos para facilitar la comunicación.
        </p>


        {!canAddMore && totalEsperado > 0 && (
          <p className="text-xs text-gray-900 mt-2">
            Ya cargaste el total esperado ({totalEsperado}).
            {/* Para agregar más,
            aumentá Adultos/Niños/Bebés en el paso anterior. */}
          </p>
        )}
      </div>

      {/* tabla */}
      <div className="rounded-lg border border-gray-900 overflow-hidden">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-white/10">
            <tr>
              <th className="text-center px-1 md:px-3 py-2">#</th>
              <th className="text-center px-1 md:px-3 py-2">Nombre y apellido</th>
              <th className="text-center px-1 md:px-3 py-2">DNI</th>
              <th className="text-center px-1 md:px-3 py-2">Teléfono</th>
              <th className="text-center px-1 md:px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 && (
              <tr>
                <td className="px-3 py-3 text-gray-900 text-center" colSpan={5}>
                  {tipo === "INSTITUCION_EDUCATIVA" ? "Sin visitantes cargados." : "Sin visitantes cargados."}
                </td>
              </tr>
            )}

            {fields.map((f, i) => {
              const editing = editIndex === i;
              const nombre = String(watch(`personas.${i}.nombre`) ?? "");
              const apellido = String(watch(`personas.${i}.apellido`) ?? "");
              const dni = String(watch(`personas.${i}.dni`) ?? "");
              const telefono = String(watch(`personas.${i}.telefono`) ?? "");

              return (
                <tr key={f.id ?? i} className="border-t border-gray-900">
                  <td className="px-1 md:px-3 py-2 text-center">{i + 1}</td>

                  {/* Nombre y apellido */}
                  <td className="px-1 md:px-3 py-2 text-center">
                    {editing ? (
                      <div className="grid sm:grid-cols-2 gap-2">
                        <div>
                          <input
                            className={`${inputBase} ${editErrors.nombre ? "border-red-500" : ""}`}
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) =>
                              setValue(`personas.${i}.nombre`, e.target.value, { shouldDirty: true })
                            }
                          />
                          {/* {editErrors.nombre && (
                            <p className="text-xs text-red-500">{editErrors.nombre}</p>
                          )} */}
                        </div>

                        <div>
                          <input
                            className={`${inputBase} ${editErrors.apellido ? "border-red-500" : ""}`}
                            placeholder="Apellido"
                            value={apellido}
                            onChange={(e) =>
                              setValue(`personas.${i}.apellido`, e.target.value, { shouldDirty: true })
                            }
                          />
                          {/* {editErrors.apellido && (
                            <p className="text-xs text-red-500">{editErrors.apellido}</p>
                          )} */}
                        </div>
                      </div>
                    ) : (
                      `${nombre} ${apellido}`.trim()
                    )}
                  </td>

                  {/* DNI */}
                  <td className="px-1 md:px-3 py-2 text-center">
                    {editing ? (
                      <div>
                        <input
                          className={`${inputBase} ${editErrors.dni ? "border-red-500" : ""}`}
                          placeholder="DNI (8 dígitos)"
                          value={dni}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/\D+/g, "").slice(0, 8);
                            setValue(`personas.${i}.dni`, cleaned, { shouldDirty: true });
                          }}
                        />
                        {/* {editErrors.dni && (
                          <p className="text-xs text-red-500">{editErrors.dni}</p>
                        )} */}
                      </div>
                    ) : (
                      dni
                    )}
                  </td>

                  {/* TELEFONO */}
                  <td className="px-1 md:px-3 py-2 text-center">
                    {editing ? (
                      <div>
                        <input
                          className={`${inputBase} ${editErrors.telefono ? "border-red-500" : ""}`}
                          placeholder="Teléfono (10 dígitos)"
                          value={telefono}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(/\D+/g, "").slice(0, 10);
                            setValue(`personas.${i}.telefono`, cleaned, { shouldDirty: true });
                          }}
                        />
                        {/* {editErrors.telefono && (
                          <p className="text-xs text-red-500">{editErrors.telefono}</p>
                        )} */}
                      </div>
                    ) : (
                      telefono
                    )}
                  </td>

                  {/* Acciones */}
                  <td className="px-1 md:px-3 py-1 md:py-2">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                      {editing ? (
                        <>
                          <button
                            type="button"
                            onClick={saveEdit}
                            className="rounded p-2 border border-gray-900 hover:bg-gray-400"
                            aria-label="Guardar"
                            title="Guardar"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded p-2 border border-gray-900 hover:bg-gray-400"
                            aria-label="Cancelar"
                            title="Cancelar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(i)}
                            className="rounded p-2 border border-gray-900 hover:bg-gray-400"
                            aria-label="Editar"
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("¿Quitar este registro?")) remove(i);
                            }}
                            className="rounded p-2 border border-gray-900 hover:bg-gray-400 text-red-500"
                            aria-label="Eliminar"
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>

              );
            })}
          </tbody>

        </table>
      </div>

      {/* <p className="mt-2 rounded-md bg-white/5 border border-gray-900 px-3 py-2 text-sm text-gray-900">
        Total esperado: <b>{totalEsperado}</b> — Cargados: <b>{fields.length}</b>
      </p> */}

      {uxError && <p className="text-red-400 text-sm">{uxError}</p>}
      {editErrors.nombre && (
        <p className="text-xs text-red-500">{editErrors.nombre}</p>
      )}
      {editErrors.apellido && (
        <p className="text-xs text-red-500">{editErrors.apellido}</p>
      )}
      {editErrors.dni && (
        <p className="text-xs text-red-500">{editErrors.dni}</p>
      )}
      {editErrors.telefono && (
        <p className=" text-xs text-red-500">{editErrors.telefono}</p>
      )}
    </div>
  );
}

