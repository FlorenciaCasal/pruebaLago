"use client";

export default function Footer() {
 
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
      {/* <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        Reserva Natural Lago Escondido
      </div> */}
 <div className="font-bold leading-tight">
            <span className="text-base md:text-lg">Reserva Natural Lago Escondido</span>
          </div>
    
    </nav>
  );
}