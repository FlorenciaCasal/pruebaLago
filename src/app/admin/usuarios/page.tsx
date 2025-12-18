"use client";
import { useEffect, useState } from "react";
import { listUsers, createUser, deleteUser, updateUser, type User } from "@/services/users";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/services/users";
import { Trash2, Pencil } from "lucide-react";
import { formSchema } from "@/schemas/formSchema";
import * as yup from "yup";

type FieldErrors = {
    nombre?: string;
    apellido?: string;
    correo?: string;
    telefono?: string;
};

const normalizeText = (v: string) => v.trim();

const normalizeEmail = (v: string) =>
    v.trim().toLowerCase();

const normalizePhone = (v: string) =>
    v.replace(/\D+/g, "").slice(0, 10);

export default function AdminUsersPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [errors, setErrors] = useState<FieldErrors>({});

    // form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [creating, setCreating] = useState(false);
    const [role, setRole] = useState<"ADMIN" | "MANAGER">("MANAGER");
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editFirst, setEditFirst] = useState("");
    const [editLast, setEditLast] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editRole, setEditRole] = useState<"ADMIN" | "MANAGER">("MANAGER");
    const [savingEdit, setSavingEdit] = useState(false);
    const [pwdError, setPwdError] = useState<string | null>(null);


    const roleLabel =
        role === "ADMIN"
            ? "Admin completo"
            : "Admin operativo (solo reservas)";

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await listUsers();
                setUsers(data);
            } catch {
                toast("No se pudo obtener la lista de usuarios");
            } finally {
                setLoading(false);
            }
        })();
    }, [toast]);


    function startEdit(u: User) {
        setEditingUser(u);
        setEditFirst(u.firstName);
        setEditLast(u.lastName);
        setEditPhone(u.phone ?? "");
        setEditEmail(u.email);
        setEditRole(u.role);
    }

    async function onSaveEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editingUser) return;

        const dataForValidation = {
            nombre: editFirst,
            apellido: editLast,
            correo: editEmail,
            telefono: editPhone,
        };

        try {
            await formSchema.validateAt("nombre", dataForValidation);
            await formSchema.validateAt("apellido", dataForValidation);
            await formSchema.validateAt("correo", dataForValidation);

            if (editPhone) {
                await formSchema.validateAt("telefono", dataForValidation);
            }

            setSavingEdit(true);

            const updated = await updateUser(editingUser.id, {
                firstName: editFirst.trim(),
                lastName: editLast.trim(),
                email: editEmail.trim().toLowerCase(),
                phone: editPhone || undefined,
                role: editRole,
            });

            // actualizar en UI
            setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));

            toast("Usuario actualizado");
            setEditingUser(null);
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                toast(err.message);
            } else {
                toast("Error actualizando usuario");
            }
        } finally {
            setSavingEdit(false);
        }
    }


    async function onCreate(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});
        setPwdError(null);
        const dataForValidation = {
            nombre: firstName,
            apellido: lastName,
            correo: email,
            telefono: phone,
        };
        try {
            // 👇 validamos SOLO los campos que existen en usuarios
            await formSchema.validateAt("nombre", dataForValidation);
            await formSchema.validateAt("apellido", dataForValidation);
            await formSchema.validateAt("correo", dataForValidation);
            // teléfono es opcional
            if (phone) {
                await formSchema.validateAt("telefono", dataForValidation);
            }

            if (!pwd || pwd.length < 8) {
                setPwdError("La contraseña debe tener al menos 8 caracteres");
                return;
            }

            setCreating(true);
            const u = await createUser({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim().toLowerCase(),
                phone: phone || undefined,
                password: pwd,
                role,
            });
            // setUsers((prev) => [u, ...prev]);
            const normalizedUser: User = {
                ...u,
                name: `${u.firstName} ${u.lastName}`,
            };
            setUsers(prev => [normalizedUser, ...prev]);
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("");
            setPwd("");
            setRole("MANAGER");
            toast("Usuario creado");
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                setErrors({
                    [err.path as keyof FieldErrors]: err.message,
                });
                return;
            }

            if (err instanceof ApiError) {
                if (err.code === "EMAIL_EXISTS") toast("Ya existe un usuario con ese email");
                else toast(err.message);
                return;
            }

            toast("No se pudo crear el usuario");
        }
    }

    async function onDelete(id: string) {
        if (!confirm("¿Eliminar este usuario?")) return;
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            toast("Usuario eliminado");
        } catch {
            toast("No se pudo eliminar");
        }
    }

    return (
        <>
            {
                editingUser && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <form
                            onSubmit={onSaveEdit}
                            className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-full max-w-md space-y-4"
                        >
                            <h2 className="text-lg font-semibold mb-2">Editar usuario</h2>

                            <input
                                className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2"
                                placeholder="Nombre"
                                value={editFirst}
                                onChange={(e) => setEditFirst(normalizeText(e.target.value))}
                            />
                            <input
                                className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2"
                                placeholder="Apellido"
                                value={editLast}
                                onChange={(e) => setEditLast(normalizeText(e.target.value))}
                            />
                            <input
                                className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2"
                                placeholder="Email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(normalizeEmail(e.target.value))}
                            />
                            <input
                                className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2"
                                placeholder="Teléfono"
                                value={editPhone}
                                onChange={(e) => setEditPhone(normalizePhone(e.target.value))}
                            />

                            <select
                                className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2"
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value as "ADMIN" | "MANAGER")}
                            >
                                <option value="ADMIN">Admin completo</option>
                                <option value="MANAGER">Admin operativo</option>
                            </select>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 rounded-md bg-neutral-700"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-md bg-white text-gray-900"
                                    disabled={savingEdit}
                                >
                                    {savingEdit ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                )
            }

            <div className="space-y-6">
                <h1 className="text-xl sm:text-2xl pt-4 font-semibold">Usuarios</h1>
                {/* Crear usuario admin */}
                <form onSubmit={onCreate} noValidate className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
                    <div className="font-medium mb-1">Crear usuario</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                        <div className="flex flex-col">
                            <input
                                className={`rounded-md bg-neutral-900 px-3 py-2 outline-none
    ${errors.nombre ? "border border-red-500" : "border border-neutral-700"}`}
                                placeholder="Nombre"
                                value={firstName} onChange={(e) => {
                                    setFirstName(normalizeText(e.target.value));
                                    setErrors(prev => ({ ...prev, nombre: undefined }));
                                }}
                            />
                            {errors.nombre && (
                                <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <input
                                className={`rounded-md bg-neutral-900 px-3 py-2 outline-none
    ${errors.apellido ? "border border-red-500" : "border border-neutral-700"}`}
                                placeholder="Apellido"
                                value={lastName} onChange={(e) => {
                                    setLastName(normalizeText(e.target.value));
                                    setErrors(prev => ({ ...prev, apellido: undefined }));
                                }}
                            />
                            {errors.apellido && (
                                <p className="text-red-400 text-xs mt-1">{errors.apellido}</p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <input
                                className={`rounded-md bg-neutral-900 px-3 py-2 outline-none
    ${errors.correo ? "border border-red-500" : "border border-neutral-700"}`}
                                placeholder="Email"
                                type="email"
                                value={email} onChange={(e) => {
                                    setEmail(normalizeEmail(e.target.value));
                                    setErrors(prev => ({ ...prev, correo: undefined }));
                                }}
                            />
                            {errors.correo && (
                                <p className="text-red-400 text-xs mt-1">{errors.correo}</p>
                            )}
                        </div>

                        <div className="flex flex-col">
                            <input
                                className={`rounded-md bg-neutral-900 px-3 py-2 outline-none
    ${errors.telefono ? "border border-red-500" : "border border-neutral-700"}`}
                                placeholder="Teléfono"
                                value={phone}
                                onChange={(e) => {
                                    setPhone(normalizePhone(e.target.value));
                                    setErrors(prev => ({ ...prev, telefono: undefined }));
                                }}
                            />
                            {errors.telefono && (
                                <p className="text-red-400 text-xs mt-1">{errors.telefono}</p>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <input
                                className={`rounded-md bg-neutral-900 px-3 py-2 outline-none
    ${pwdError ? "border border-red-500" : "border border-neutral-700"}`}
                                placeholder="Contraseña"
                                type="password"
                                value={pwd} onChange={(e) => {
                                    setPwd(e.target.value);
                                    setPwdError(null);
                                }}
                            />
                            {pwdError && (
                                <p className="text-red-400 text-xs mt-1">{pwdError}</p>
                            )}
                        </div>
                    </div>
                    {/* selector de rol */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-1 mb-1">
                            {/* <label className="block text-sm text-neutral-300 mb-1">Rol</label> */}
                            <select
                                className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-0 sm:px-3 py-2 outline-none cursor-pointer"
                                value={role}
                                onChange={(e) => setRole(e.target.value as "ADMIN" | "MANAGER")}
                                title={roleLabel}
                            >
                                <option value="ADMIN" title="Admin completo">Admin completo</option>
                                <option value="MANAGER" title="Admin operativo (solo reservas)">Admin operativo (solo reservas)</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={creating}
                            className="rounded-md bg-white text-gray-900 px-4 py-2 disabled:opacity-40"
                        >
                            {creating ? "Creando..." : "Crear usuario"}
                        </button>
                    </div>
                </form>

                {/* Tabla de usuarios */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-950">
                    <div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
                        <h2 className="font-medium">Usuarios del sistema</h2>
                    </div>
                    {loading ? (
                        <div className="p-6 text-neutral-400">Cargando…</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-neutral-900/60">
                                    <tr className="[&>th]:px-4 [&>th]:py-2 text-left text-neutral-400">
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Teléfono</th>
                                        <th>Rol</th>
                                        <th>Creado</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id} className="border-t border-neutral-800 items-center">
                                            <td className="px-4 py-2">{u.name}</td>
                                            <td className="px-4 py-2">{u.email}</td>
                                            <td className="px-4 py-2">{u.phone ?? "-"}</td>
                                            <td className="px-4 py-2">{u.role}</td>
                                            <td className="px-4 py-2">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                                            <td className="px-4 py-2">
                                                <div className="flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => startEdit(u)}
                                                        className="text-sm text-blue-300 hover:text-blue-200"
                                                        title="Editar"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => onDelete(u.id)}
                                                        className="text-sm text-red-300 hover:text-red-200"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td className="px-4 py-8 text-center text-neutral-400" colSpan={5}>
                                                No hay usuarios todavía.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
} 