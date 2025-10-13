"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function NavbarClient({ isLogged, isAdmin }: { isLogged: boolean; isAdmin: boolean }) {
  const pathname = usePathname();
  const isHome = pathname == "/";
  const showHomeLink = pathname !== "/";
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
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>

        {showHomeLink && (
          <Link href="/" className="text-white no-underline px-3 py-1 rounded hover:bg-neutral-800">
            Home
          </Link>
        )}


        {isHome && isLogged && isAdmin && (
          <Link href="/admin" className="text-white no-underline px-3 py-1 rounded hover:bg-neutral-800">
            Panel de Administración
          </Link>
        )}

        {!isLogged ? (
          <Link href="/login" className="text-white no-underline px-3 py-1 rounded hover:bg-neutral-800">
            Ingresar
          </Link>
        ) : (
          <LogoutButton />
        )}

      </div>
    </nav>
  );
}
