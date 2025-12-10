// components/ExportExcelButton.tsx
"use client";
import { useState } from "react";

type ExportFilters = {
    date?: string;
    month?: string;
    year?: string;
    status?: string;
    visitorType?: string;
    dni?: string;
    name?: string;
};

export default function ExportExcelButton({ filters }: { filters: ExportFilters }) {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        try {
            // Construir query string solo con filtros definidos
            const params = new URLSearchParams();
            if (filters.date) params.append("date", filters.date);
            if (filters.month) params.append("month", filters.month);
            if (filters.year) params.append("year", filters.year);
            if (filters.status) params.append("status", filters.status);
            if (filters.visitorType) params.append("visitorType", filters.visitorType);
            if (filters.dni) params.append("dni", filters.dni);
            if (filters.name) params.append("name", filters.name);

            const queryString = params.toString();
            const res = await fetch(`/api/admin/reservations/export${queryString ? `?${queryString}` : ""}`);
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
