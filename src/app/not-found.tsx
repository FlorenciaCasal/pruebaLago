import Link from "next/link";

export default function NotFoundPage() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white px-6">
            <h1 className="text-3xl font-bold mb-3">Página no encontrada</h1>
            <p className="text-neutral-400 mb-6 text-center max-w-md">
                La página que estás buscando no existe o fue movida.
            </p>
            <Link
                href="/"
                className="px-4 py-2 rounded-lg bg-white text-neutral-900 font-semibold"
            >
                Volver al inicio
            </Link>
        </main>
    );
}
