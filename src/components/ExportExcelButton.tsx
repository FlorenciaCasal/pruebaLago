// components/ExportExcelButton.tsx
"use client";
import { useState } from "react";

export default function ExportExcelButton({ date }: { date: string }) {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            // const res = await fetch(`/api/export?date=${date}`);
                 const res = await fetch(`/api/admin/reservations/export?date=${date}`);
            if (!res.ok) throw new Error("Error al exportar");

            const blob = await res.blob();
            const contentDisposition = res.headers.get("content-disposition");
            const filename = contentDisposition?.split("filename=")[1]?.replace(/"/g, "") || "reservas.xlsx";

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error al descargar el archivo:", err);
            alert("No se pudo exportar el archivo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleExport} disabled={loading} className="btn-export">
            {loading ? "Exportando..." : "Exportar a Excel"}
        </button>
    );
}
