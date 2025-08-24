"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const userRole = "ADMIN"; // Esto debería venir de tu auth real

//   useEffect(() => {
//     if (userRole !== "ADMIN") {
//       router.push("/"); // Redirige si no es admin
//     }
//   }, [userRole, router]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Panel de Administración</h1>
      <p>Solo admins pueden ver esto.</p>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <Link href="/admin/checkear-visitantes">
          <button style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
            Checkear Visitantes
          </button>
        </Link>

        <Link href="/admin/administrar-visitas">
          <button style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
            Administrar Visitas
          </button>
        </Link>
      </div>
    </div>
  );
}
