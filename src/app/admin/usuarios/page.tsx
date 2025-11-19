"use client";
import { useEffect, useState } from "react";
import { listUsers, createUser, deleteUser, type User } from "@/services/users";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/services/users";

export default function AdminUsersPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    // form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [creating, setCreating] = useState(false);
    const [role, setRole] = useState<"ADMIN" | "MANAGER">("MANAGER");
    const roleLabel =
        role === "ADMIN"
            ? "Admin completo"
            : "Admin limitado (solo reservas)";

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



    async function onCreate(e: React.FormEvent) {
        e.preventDefault();
        if (!email || !pwd || !firstName || !lastName) {
            toast("Completá nombre, apellido, email y contraseña");
            return;
        }
        setCreating(true);
        try {
            const u = await createUser({ firstName, lastName, email, password: pwd, role });
            setUsers((prev) => [u, ...prev]);
            setFirstName("");
            setLastName("");
            setEmail("");
            setPwd("");
            setRole("MANAGER");
            toast("Usuario creado");
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                if (err.code === "EMAIL_EXISTS") toast("Ya existe un usuario con ese email");
                else if (err.code === "CREATE_FAILED") toast("Datos inválidos (revisá longitudes y formato)");
                else toast(`Error: ${err.message}`);
            } else {
                toast("No se pudo crear el usuario");
            }
        } finally {
            setCreating(false);
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
        <div className="space-y-6">
            <h1 className="text-xl sm:text-2xl font-semibold">Usuarios</h1>

            {/* Crear usuario admin */}
            <form onSubmit={onCreate} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
                <div className="font-medium mb-1">Crear usuario</div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                        className="rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 outline-none"
                        placeholder="Nombre"
                        value={firstName} onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        className="rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 outline-none"
                        placeholder="Apellido"
                        value={lastName} onChange={(e) => setLastName(e.target.value)}
                    />
                    <input
                        className="rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 outline-none"
                        placeholder="Email"
                        type="email"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 outline-none"
                        placeholder="Contraseña"
                        type="password"
                        value={pwd} onChange={(e) => setPwd(e.target.value)}
                    />
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
                            <option value="MANAGER" title="Admin limitado (solo reservas)">Admin limitado (solo reservas)</option>
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
                                    <th>Rol</th>
                                    <th>Creado</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="border-t border-neutral-800">
                                        <td className="px-4 py-2">{u.name}</td>
                                        <td className="px-4 py-2">{u.email}</td>
                                        <td className="px-4 py-2">{u.role}</td>
                                        <td className="px-4 py-2">{u.createdAt ? new Date(u.createdAt).toLocaleString() : "-"}</td>
                                        <td className="px-4 py-2 text-right">
                                            <button
                                                onClick={() => onDelete(u.id)}
                                                className="text-sm text-red-300 hover:text-red-200"
                                            >
                                                Eliminar
                                            </button>
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
    );

} 