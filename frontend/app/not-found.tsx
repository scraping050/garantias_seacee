import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
            <div className="rounded-full bg-blue-50 p-6 mb-6">
                <FileQuestion className="h-12 w-12 text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Página no encontrada</h2>
            <p className="text-gray-600 mb-8 max-w-md">
                Lo sentimos, no pudimos encontrar el recurso que estás buscando.
            </p>
            <Link
                href="/modules"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
            >
                Volver al Inicio
            </Link>
        </div>
    );
}
