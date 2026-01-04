"use client";

import React, { useState, useEffect } from "react";
import { LicitacionCard } from "@/components/search/LicitacionCard";
import { AutocompleteSearch } from "@/components/search/AutocompleteSearch";
import type { Licitacion } from "@/types/licitacion";
import { licitacionService } from "@/lib/services/licitacionService";
import {
    Search,
    ChevronUp,
    ChevronDown,
    RotateCcw
} from "lucide-react";

export default function BusquedaLicitacionesPage() {
    // Filter State (Matching Gestion Manual & Reportes)
    const [showFilters, setShowFilters] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Select States - Values
    const [departamento, setDepartamento] = useState("");
    const [estado, setEstado] = useState("");
    const [categoria, setCategoria] = useState("");
    const [anio, setAnio] = useState("");
    const [mes, setMes] = useState("");
    const [provincia, setProvincia] = useState("");
    const [distrito, setDistrito] = useState("");
    const [tipoGarantia, setTipoGarantia] = useState("");
    const [aseguradora, setAseguradora] = useState("");
    const [entidad, setEntidad] = useState("");

    // Select States - Options (Dynamic)
    const [departamentoOptions, setDepartamentoOptions] = useState<string[]>([]);
    const [estadoOptions, setEstadoOptions] = useState<string[]>([]);
    const [categoriaOptions, setCategoriaOptions] = useState<string[]>([]);
    const [anioOptions, setAnioOptions] = useState<string[]>([]);
    const [tipoGarantiaOptions, setTipoGarantiaOptions] = useState<string[]>([]);
    const [aseguradoraOptions, setAseguradoraOptions] = useState<string[]>([]);
    const [entidadOptions, setEntidadOptions] = useState<string[]>([]);

    // Cascading Location Options
    const [provinciaOptions, setProvinciaOptions] = useState<string[]>([]);
    const [distritoOptions, setDistritoOptions] = useState<string[]>([]);

    // Pagination & Data State
    const [licitaciones, setLicitaciones] = useState<Licitacion[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);

    // Initial Load: Fetch Global Filters
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const filters = await licitacionService.getFilters();
                if (filters) {
                    setDepartamentoOptions(filters.departamentos || []);
                    setEstadoOptions(filters.estados || []);
                    setCategoriaOptions(filters.categorias || []);
                    setTipoGarantiaOptions(filters.tipos_garantia || []);
                    setAseguradoraOptions(filters.aseguradoras || []);
                    setEntidadOptions(filters.entidades || []);
                    setAnioOptions(filters.anios || []);
                }
            } catch (error) {
                console.error("Error loading filters:", error);
            }
        };
        loadFilters();
    }, []);

    // Cascading: Load Provincias when Departamento changes
    const handleDepartamentoChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const dept = e.target.value;
        setDepartamento(dept);

        // Reset children
        setProvincia("");
        setDistrito("");
        setProvinciaOptions([]);
        setDistritoOptions([]);

        if (dept) {
            try {
                const data = await licitacionService.getLocations(dept);
                if (data.provincias) {
                    setProvinciaOptions(data.provincias);
                }
            } catch (error) {
                console.error("Error loading provincias:", error);
            }
        }
    };

    // Cascading: Load Distritos when Provincia changes
    const handleProvinciaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const prov = e.target.value;
        setProvincia(prov);

        // Reset children
        setDistrito("");
        setDistritoOptions([]);

        if (prov && departamento) {
            try {
                const data = await licitacionService.getLocations(departamento, prov);
                if (data.distritos) {
                    setDistritoOptions(data.distritos);
                }
            } catch (error) {
                console.error("Error loading distritos:", error);
            }
        }
    };

    const fetchLicitaciones = async () => {
        setLoading(true);
        try {
            const filters: any = {};
            if (searchTerm) filters.search = searchTerm;
            if (departamento) filters.departamento = departamento;
            if (estado) filters.estado = estado;
            if (categoria) filters.categoria = categoria;
            if (anio) filters.anio = anio;
            if (mes) filters.mes = Number(mes);
            if (provincia) filters.provincia = provincia;
            if (distrito) filters.distrito = distrito;
            if (tipoGarantia) filters.tipo_garantia = tipoGarantia;
            if (aseguradora) filters.entidad_financiera = aseguradora;
            if (entidad) filters.comprador = entidad;

            const data = await licitacionService.getAll(currentPage, itemsPerPage, filters);

            if (data.items.length === 0 && currentPage === 1 && !searchTerm) {
                setLicitaciones([]);
                setTotalItems(0);
                setTotalPages(0);
            } else {
                setLicitaciones(data.items);
                setTotalPages(data.total_pages);
                setTotalItems(data.total);
            }

        } catch (error) {
            console.error("Error cargando licitaciones:", error);
            setLicitaciones([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLicitaciones();
    }, [currentPage, itemsPerPage, searchTerm, departamento, estado, categoria, anio, mes, provincia, distrito, tipoGarantia, aseguradora, entidad]);

    const handleClear = () => {
        setSearchTerm("");
        setDepartamento("");
        setEstado("");
        setCategoria("");
        setAnio("");
        setMes("");
        setProvincia("");
        setDistrito("");
        setTipoGarantia("");
        setAseguradora("");
        setEntidad("");
        setProvinciaOptions([]);
        setDistritoOptions([]);
        setCurrentPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b122b] p-4 sm:p-6 lg:p-8 transition-colors duration-300">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* Main Filter Card */}
                <div className="rounded-3xl bg-white shadow-sm border border-slate-200 dark:bg-[#111c44] dark:border-white/5 overflow-hidden">
                    <div className="p-6 md:p-8">

                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
                                    Búsqueda de Licitaciones
                                </h1>
                                <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Encuentra oportunidades de negocio en el estado
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] text-white text-xs font-bold hover:bg-[#4338ca] shadow-lg shadow-indigo-500/30 transition-all"
                                >
                                    {showFilters ? 'Menos Filtros' : 'Más Filtros'}
                                    {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={handleClear}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-600 border border-red-100 text-xs font-bold hover:bg-red-100 transition-all"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Limpiar
                                </button>
                            </div>
                        </div>

                        {/* Search Bar - Replaced with AutocompleteSearch */}
                        <div className="relative mb-8 group z-50">
                            <AutocompleteSearch
                                onSearch={(term) => setSearchTerm(term)}
                                placeholder="Buscar por descripción, comprador, nomenclatura, ganador, banco..."
                                initialValue={searchTerm}
                            />
                        </div>

                        {/* Filters Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4 duration-300">

                            {/* Row 1 - Always Visible */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Departamento</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-0 outline-none dark:bg-[#111c44] dark:border-slate-700 dark:text-slate-300"
                                        value={departamento} onChange={handleDepartamentoChange}
                                    >
                                        <option value="">Todos los departamentos</option>
                                        {departamentoOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Estado del Proceso</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-0 outline-none dark:bg-[#111c44] dark:border-slate-700 dark:text-slate-300"
                                        value={estado} onChange={(e) => setEstado(e.target.value)}
                                    >
                                        <option value="">Todos los estados</option>
                                        {estadoOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Categoría</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-0 outline-none dark:bg-[#111c44] dark:border-slate-700 dark:text-slate-300"
                                        value={categoria} onChange={(e) => setCategoria(e.target.value)}
                                    >
                                        <option value="">Todas las categorías</option>
                                        {categoriaOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Periodo</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-8 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-0 outline-none dark:bg-[#111c44] dark:border-slate-700 dark:text-slate-300"
                                            value={anio} onChange={(e) => setAnio(e.target.value)}
                                        >
                                            <option value="">Año</option>
                                            {["2026", "2025", "2024"].map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-8 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-0 outline-none dark:bg-[#111c44] dark:border-slate-700 dark:text-slate-300"
                                            value={mes} onChange={(e) => setMes(e.target.value)}
                                        >
                                            <option value="">Mes</option>
                                            {/* Static months for now */}
                                            {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((m, i) => (
                                                <option key={i} value={i + 1}>{m}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2 - Collapsible */}
                            {showFilters && (
                                <>
                                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Ubicación Detallada</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="relative">
                                                <select
                                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-8 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-0 outline-none dark:bg-[#111c44] dark:border-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    value={provincia}
                                                    onChange={handleProvinciaChange}
                                                    disabled={!departamento}
                                                >
                                                    <option value="">Provincia</option>
                                                    {provinciaOptions.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                            </div>
                                            <div className="relative">
                                                <select
                                                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-8 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-0 outline-none dark:bg-[#111c44] dark:border-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    value={distrito}
                                                    onChange={(e) => setDistrito(e.target.value)}
                                                    disabled={!provincia}
                                                >
                                                    <option value="">Distrito</option>
                                                    {distritoOptions.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 delay-75">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Tipo de Garantía</label>
                                        <div className="relative">
                                            <select
                                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-0 outline-none dark:bg-[#111c44] dark:border-slate-700 dark:text-slate-300"
                                                value={tipoGarantia} onChange={(e) => setTipoGarantia(e.target.value)}
                                            >
                                                <option value="">Todos los tipos</option>
                                                {tipoGarantiaOptions.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 delay-100">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Aseguradora</label>
                                        <div className="relative">
                                            <select
                                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-0 outline-none dark:bg-[#111c44] dark:border-slate-700 dark:text-slate-300"
                                                value={aseguradora} onChange={(e) => setAseguradora(e.target.value)}
                                            >
                                                <option value="">Todas las aseguradoras</option>
                                                {aseguradoraOptions.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 delay-150">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Entidad o Consorcio</label>
                                        <div className="relative">
                                            <select
                                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-semibold text-slate-700 focus:border-indigo-500 focus:ring-0 outline-none dark:bg-[#111c44] dark:border-slate-700 dark:text-slate-300"
                                                value={entidad} onChange={(e) => setEntidad(e.target.value)}
                                            >
                                                <option value="">Todas las entidades</option>
                                                {entidadOptions.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>

                {/* Results Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {loading ? 'Cargando...' : `${totalItems} Resultados encontrados`}
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Ordenar por:</span>
                            <select
                                className="min-w-[180px] rounded-lg border-0 bg-white py-2 pl-3 pr-8 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 dark:bg-[#111c44] dark:text-slate-200 dark:ring-slate-700"
                            >
                                <option value="recent">Fecha (más reciente)</option>
                                <option value="oldest">Fecha (más antigua)</option>
                                <option value="amount_desc">Monto (mayor)</option>
                                <option value="amount_asc">Monto (menor)</option>
                                <option value="name_asc">Nombre (A-Z)</option>
                                <option value="name_desc">Nombre (Z-A)</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            Página <span className="text-slate-900 dark:text-white font-bold">{currentPage}</span> de <span className="text-slate-900 dark:text-white font-bold">{totalPages || 1}</span>
                        </div>
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
