"use client";

import React, { useState, useEffect } from "react";
import { SearchFiltersComponent } from "@/components/search/SearchFilters";
import { LicitacionCard } from "@/components/search/LicitacionCard";
import type { Licitacion, SearchFilters } from "@/types/licitacion";

export default function BusquedaLicitacionesPage() {
    const [licitaciones, setLicitaciones] = useState<Licitacion[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [filters, setFilters] = useState<SearchFilters>({});

    const fetchLicitaciones = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            queryParams.append("page", currentPage.toString());
            queryParams.append("limit", itemsPerPage.toString());

            if (filters.search) queryParams.append("search", filters.search);
            if (filters.departamento) queryParams.append("departamento", filters.departamento);
            if (filters.provincia) queryParams.append("provincia", filters.provincia);
            if (filters.distrito) queryParams.append("distrito", filters.distrito);
            if (filters.estado_proceso) queryParams.append("estado", filters.estado_proceso);
            if (filters.categoria) queryParams.append("categoria", filters.categoria);
            if (filters.aseguradora) queryParams.append("entidad_financiera", filters.aseguradora);
            if (filters.year) queryParams.append("year", filters.year);
            if (filters.mes) queryParams.append("mes", filters.mes);
            if (filters.tipo_garantia) queryParams.append("tipo_garantia", filters.tipo_garantia);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/licitaciones?${queryParams.toString()}`);
            if (!response.ok) throw new Error("Error fetching data");

            const data = await response.json();
            setLicitaciones(data.items);
            setTotalPages(data.total_pages);
            setTotalItems(data.total);

        } catch (error) {
            console.error("Error cargando licitaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLicitaciones();
    }, [currentPage, itemsPerPage, filters]);

    const handleFilterChange = (newFilters: SearchFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page
    };

    return (
        // Updated Backgrounds: bg-slate-50 dark:bg-[#0b122b]
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b122b] p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Búsqueda de Licitaciones
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Explora y filtra las licitaciones públicas con nuestra búsqueda avanzada.
                    </p>
                </div>

                {/* Filters */}
                {/* Updated Backgrounds: white/50 -> white, dark:bg-[#111c44] */}
                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#111c44] backdrop-blur-xl">
                    <SearchFiltersComponent onFilterChange={handleFilterChange} />
                </div>

                {/* Results Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {loading ? 'Cargando...' : `${totalItems} Resultados encontrados`}
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Mostrar:</span>
                        <select
                            className="rounded-lg border-0 bg-white py-1.5 pl-3 pr-8 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 dark:bg-[#111c44] dark:text-slate-200 dark:ring-slate-700"
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        >
                            <option value="12">12</option>
                            <option value="24">24</option>
                            <option value="48">48</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 rounded-2xl bg-slate-200/50 animate-pulse dark:bg-slate-800/50"></div>
                        ))}
                    </div>
                ) : licitaciones.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {licitaciones.map((lic) => (
                            <LicitacionCard key={lic.id_convocatoria} licitacion={lic} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 p-12 text-center dark:border-slate-700 dark:bg-[#111c44]/50">
                        <svg className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No se encontraron resultados</h3>
                        <p className="mt-1 text-slate-500 dark:text-slate-400">Intenta ajustar los filtros de búsqueda.</p>
                    </div>
                )}

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-center pt-8">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-slate-700 dark:hover:bg-[#111c44]"
                            >
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 focus:outline-offset-0 dark:text-white dark:ring-slate-700">
                                Página {currentPage} de {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-slate-700 dark:hover:bg-[#111c44]"
                            >
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                )}

            </div>
        </div>
    );
}
