'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Root Error:', error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-white text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Algo salió mal en la página principal</h2>
            <p className="text-gray-600 mb-6 max-w-lg">
                {error.message || "Error inesperado"}
            </p>
            <button
                onClick={() => reset()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
                Intentar de nuevo
            </button>
        </div>
    );
}
