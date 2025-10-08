"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem 2rem",
      backgroundColor: "#1a1a1a",
      color: "white"
    }}>
      {/* Logo o título */}
      <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        Reserva Natural Lago Escondido
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link href="/" style={{ color: "white", textDecoration: "none" }}>
          Home
        </Link>
        {isAdminRoute && (
          <Link href="/admin" style={{ color: "white", textDecoration: "none" }}>
            Panel de Administración
          </Link>
        )}
        <Link href="/login" style={{ color: "white", textDecoration: "none" }}>
          Ingresar
        </Link>
      </div>
    </nav>
  );
}
