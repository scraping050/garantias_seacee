'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <html>
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center text-gray-900">
                    <div className="rounded-full bg-red-100 p-4 mb-4">
                        <AlertTriangle className="h-10 w-10 text-red-600" />
                    </div>

                    <h1 className="text-3xl font-bold mb-2">Error Crítico del Sistema</h1>
                    <p className="text-gray-600 mb-6 max-w-md">
                        Ha ocurrido un error fatal que impide cargar la aplicación.
                    </p>

                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 max-w-lg w-full text-left overflow-auto mb-6">
                        <p className="font-mono text-sm text-red-600 break-all">
                            {error.message || "Error desconocido"}
                        </p>
                        {/* Digest not always available but good for prod debugging */}
                        {error.digest && (
                            <p className="mt-2 text-xs text-gray-400 font-mono">Digest: {error.digest}</p>
                        )}
                    </div>

                    <button
                        onClick={() => reset()}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        Recargar Aplicación
                    </button>
                </div>
            </body>
        </html>
    );
}
