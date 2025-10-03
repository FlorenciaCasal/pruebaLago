"use client";

import Link from "next/link";

export default function Navbar() {
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
        {/* <Link href="/admin" style={{ color: "white", textDecoration: "none" }}>
          Panel Admin
        </Link> */}
        <Link href="/login" style={{ color: "white", textDecoration: "none" }}>
          Ingresar
        </Link>
      </div>
    </nav>
  );
}
