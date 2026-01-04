import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import type { Licitacion } from '@/types/licitacion';

interface DeleteLicitacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    licitacion: Licitacion | null;
    onConfirm: (authCode: string) => void;
}

export default function DeleteLicitacionModal({ isOpen, onClose, licitacion, onConfirm }: DeleteLicitacionModalProps) {
    const [authCode, setAuthCode] = useState('');
    const [showAuthCode, setShowAuthCode] = useState(false);

    if (!isOpen || !licitacion) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#111c44] rounded-2xl w-full max-w-md shadow-2xl shadow-red-500/10 border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                            <Trash2 size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                Eliminar Licitación
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Esta acción es irreversible.
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">

                    {/* Warning Box */}
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl p-4 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">¿Estás absolutamente seguro?</h3>
                            <p className="text-xs text-red-700 dark:text-red-400 mt-1 leading-relaxed">
                                Se eliminará la licitación con ID <strong>{licitacion.id_convocatoria}</strong> y todos sus datos asociados.
                            </p>
                        </div>
                    </div>

                    {/* Description Read-only */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Descripción de la Licitación</label>
                        <div className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                            {licitacion.descripcion}
                        </div>
                    </div>

                    {/* Auth Code Input */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Código de Autorización</label>
                        <div className="relative">
                            <input
                                type={showAuthCode ? "text" : "password"}
                                className="w-full p-3 pr-10 rounded-xl border-2 border-slate-900 dark:border-white text-sm focus:outline-none dark:bg-slate-800 dark:text-white font-medium placeholder:font-normal"
                                placeholder="Ingrese el código para confirmar"
                                value={authCode}
                                onChange={(e) => setAuthCode(e.target.value)}
                            />
                            <button
                                onClick={() => setShowAuthCode(!showAuthCode)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                            >
                                {showAuthCode ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/20">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-white/10 transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onConfirm(authCode)}
                        disabled={!authCode}
                        className="px-4 py-2 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Eliminar Licitación
                    </button>
                </div>
            </div>
        </div>
    );
}
