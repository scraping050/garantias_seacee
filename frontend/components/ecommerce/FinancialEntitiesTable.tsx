"use client";

import React from "react";
import { YearSelector } from "@/components/dashboard/YearSelector";

interface FinancialEntitiesTableProps {
    data: Array<{ name: string; garantias: number; monto: number; depts: string; cobertura: string }>;
    selectedYear?: number;
    onYearChange?: (year: number) => void;
}

const getEntityColor = (name: string) => {
    const colors = ["bg-blue-600", "bg-indigo-600", "bg-sky-600", "bg-cyan-600", "bg-blue-500", "bg-indigo-500"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const getEntityInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
};

export const FinancialEntitiesTable: React.FC<FinancialEntitiesTableProps> = React.memo(({
    data = [],
    selectedYear = 2024,
    onYearChange = () => { }
}) => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [showAll, setShowAll] = React.useState(false);

    const handleToggleShowAll = () => {
        setShowAll(!showAll);
    };

    const itemsToDisplay = showAll ? data.length : 10;
    const displayData = data.slice(0, itemsToDisplay);

    return (
        <div className="rounded-2xl bg-white dark:bg-[#111c44] p-6 shadow-md dark:shadow-xl border border-slate-100 dark:border-white/5 h-full transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Entidades Financieras</h3>

                <div className="flex items-center gap-2">
                    <YearSelector
                        selectedYear={selectedYear}
                        onYearChange={onYearChange}
                        allowAll={true}
                    />

                    {/* Three-dot menu */}
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                            aria-label="Opciones"
                        >
                            <svg
                                className="w-5 h-5 text-slate-600 dark:text-slate-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <circle cx="10" cy="4" r="1.5" />
                                <circle cx="10" cy="10" r="1.5" />
                                <circle cx="10" cy="16" r="1.5" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            handleToggleShowAll();
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            {showAll ? 'Ver menos' : 'Ver más'}
                                        </div>
                                    </button>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-[#0b122b] text-xs uppercase font-semibold text-slate-500">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Entidad</th>
                            <th className="px-4 py-3 text-center">Garantías</th>
                            <th className="px-4 py-3 text-center">Monto</th>
                            <th className="px-4 py-3 text-center rounded-r-lg">Cobertura</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {displayData.map((entity, index) => (
                            <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg ${getEntityColor(entity.name)} flex items-center justify-center text-white text-[10px] font-bold`}>
                                            {getEntityInitials(entity.name)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">{entity.name}</p>
                                            <p className="text-[10px] text-slate-500">{entity.depts}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">{entity.garantias}</td>
                                <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">{new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', notation: "compact" }).format(entity.monto)}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${entity.cobertura === 'Nacional' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                                        {entity.cobertura}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400">Mostrando {displayData.length} de {data.length} entidades</p>
            </div>
        </div>
    );
});
