"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const userRole: "ADMIN" | "USER" = "ADMIN"; // TODO: traer de tu auth real

  useEffect(() => {
    if (userRole !== "ADMIN") {
      router.push("/"); // Redirige si no es admin
    }
  }, [userRole, router]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-2xl font-semibold">Panel de Administración</h1>
      <p className="text-gray-600 mt-1">Solo admins pueden ver esto.</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/checkear-visitantes"
          className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition"
        >
          Checkear Visitantes
        </Link>

        <Link
          href="/admin/administrar-visitas"
          className="px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition"
        >
          Administrar Visitas
        </Link>
      </div>
    </div>
  );
}

