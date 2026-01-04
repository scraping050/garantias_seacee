'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an analytics service
        console.error('SEACE Error:', error);
    }, [error]);

    return (
        <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
            <div className="mb-6 rounded-full bg-red-50 p-6 shadow-[0_0_20px_rgba(239,68,68,0.2)] dark:bg-red-900/20">
                <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
            </div>

            <h2 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
                Algo salió mal
            </h2>

            <p className="mb-8 max-w-md text-slate-500 dark:text-slate-400">
                Ha ocurrido un error inesperado en este módulo.
            </p>

            {/* Error Details for Debugging */}
            <div className="rounded-lg bg-slate-50 p-4 mb-8 max-w-lg w-full overflow-auto border border-slate-200 text-left dark:bg-slate-900 dark:border-slate-800">
                <p className="font-mono text-xs text-red-600 dark:text-red-400 break-all">
                    {error.message || "Error desconocido"}
                </p>
                {error.digest && (
                    <p className="mt-2 font-mono text-[10px] text-slate-400">
                        Digest: {error.digest}
                    </p>
                )}
            </div>

            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:scale-105 active:scale-95"
            >
                <RefreshCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
                Intentar de nuevo
            </button>
        </div>
    );
}
