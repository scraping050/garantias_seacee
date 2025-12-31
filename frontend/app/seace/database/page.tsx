'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface Filters {
    search: string;
    estado: string;
    fecha_desde: string;
    fecha_hasta: string;
}

export default function SEACEDatabasePage() {
    const [licitaciones, setLicitaciones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(50); // Configurable
    const [filters, setFilters] = useState<Filters>({
        search: '',
        estado: '',
        fecha_desde: '',
        fecha_hasta: ''
    });

    useEffect(() => {
        loadData();
    }, [page, limit]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Construir query params
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString()
            });

            if (filters.search) params.append('search', filters.search);
            if (filters.estado) params.append('estado', filters.estado);
            if (filters.fecha_desde) params.append('fecha_desde', filters.fecha_desde);
            if (filters.fecha_hasta) params.append('fecha_hasta', filters.fecha_hasta);

            const res = await api.get(`/api/licitaciones?${params.toString()}`);
            setLicitaciones(res.data.items || []);
            setTotal(res.data.total || 0);
        } catch (error) {
            console.error('Error loading licitaciones:', error);
            setLicitaciones([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1); // Reset to first page
        loadData();
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            estado: '',
            fecha_desde: '',
            fecha_hasta: ''
        });
        setPage(1);
        setTimeout(() => loadData(), 100);
    };

    return (
        <div className="fade-in">
            {/* Header Premium */}
            <div className="mb-6 sm:mb-8 bg-gradient-to-r from-[#0F2C4A] to-[#1a4b7a] dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4 sm:p-6 md:p-10 shadow-xl text-white border border-transparent dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 dark:bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <i className="fas fa-database text-xl sm:text-3xl text-white drop-shadow-lg"></i>
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight mb-1">
                                Base de Datos SEACE
                            </h1>
                            <p className="text-blue-100 dark:text-gray-300 text-base">
                                Total: <strong className="text-white">{total.toLocaleString()}</strong> licitaciones
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters Panel Premium */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
                <h3 className="text-xl font-bold text-[#0F2C4A] dark:text-white mb-5 flex items-center gap-2">
                    <i className="fas fa-filter text-blue-600 dark:text-blue-400"></i>
                    Filtros de Búsqueda
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Search */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Buscar
                        </label>
                        <div className="relative">
                            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            <input
                                type="text"
                                placeholder="Nomenclatura, entidad..."
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Estado */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Estado
                        </label>
                        <select
                            value={filters.estado}
                            onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        >
                            <option value="">Todos los estados</option>
                            <option value="Contratado">✓ Contratado</option>
                            <option value="En Retención">⏸ En Retención</option>
                            <option value="Desierto">✗ Desierto</option>
                            <option value="Nulo">⊘ Nulo</option>
                            <option value="Cancelado">⊗ Cancelado</option>
                        </select>
                    </div>

                    {/* Fecha Desde */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Fecha Desde
                        </label>
                        <input
                            type="date"
                            value={filters.fecha_desde}
                            onChange={(e) => setFilters({ ...filters, fecha_desde: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Fecha Hasta */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Fecha Hasta
                        </label>
                        <input
                            type="date"
                            value={filters.fecha_hasta}
                            onChange={(e) => setFilters({ ...filters, fecha_hasta: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleSearch}
                        className="group relative overflow-hidden px-6 sm:px-8 py-3 bg-gradient-to-r from-[#0F2C4A] to-[#1a4b7a] text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <i className="fas fa-search relative z-10 group-hover:scale-110 transition-transform"></i>
                        <span className="relative z-10">Buscar</span>
                    </button>
                    <button
                        onClick={handleClearFilters}
                        className="group px-6 sm:px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-times group-hover:rotate-90 transition-transform duration-300"></i>
                        <span>Limpiar</span>
                    </button>

                    {/* Items per page */}
                    <div className="sm:ml-auto flex items-center gap-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Mostrar:
                        </label>
                        <select
                            value={limit}
                            onChange={(e) => {
                                setLimit(Number(e.target.value));
                                setPage(1);
                            }}
                            className="px-4 py-2 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500 cursor-pointer bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold"
                        >
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="500">500</option>
                            <option value="1000">1000</option>
                        </select>
                        <span className="text-sm text-gray-600 font-medium">por página</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <i className="fas fa-spinner fa-spin text-4xl text-[#0F2C4A] dark:text-blue-400 mb-4"></i>
                        <p className="text-gray-600 dark:text-gray-400">Cargando datos reales desde la base de datos...</p>
                    </div>
                </div>
            ) : licitaciones.length === 0 ? (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-8 rounded-2xl shadow-md">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-exclamation-triangle text-white text-xl"></i>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-yellow-900 mb-2">No se encontraron licitaciones</h3>
                            <p className="text-yellow-800 mb-3">
                                No hay datos en la base de datos que coincidan con los filtros aplicados.
                            </p>
                            <p className="text-yellow-700 text-sm flex items-center gap-2">
                                <i className="fas fa-info-circle"></i>
                                Ejecuta el motor ETL para cargar datos desde SEACE.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-[#0F2C4A] to-[#1a4b7a] dark:from-gray-900 dark:to-gray-800 text-white sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Nomenclatura</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Entidad</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Monto</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Estado</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {licitaciones.map((lic) => (
                                        <tr key={lic.id_convocatoria} className="border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">{lic.id_convocatoria}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-[#0F2C4A] dark:text-blue-400">{lic.nomenclatura}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">{lic.comprador}</td>
                                            <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                                                S/ {lic.monto_estimado?.toLocaleString() || '0'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(lic.estado_proceso)}`}>
                                                    {lic.estado_proceso}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{lic.fecha_publicacion || 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Mostrando {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} de {total.toLocaleString()} licitaciones
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center">
                            <button
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                                className="w-10 h-10 bg-gradient-to-r from-[#0F2C4A] to-[#1a4b7a] text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center font-bold"
                            >
                                <i className="fas fa-angle-double-left"></i>
                            </button>
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-[#0F2C4A] to-[#1a4b7a] text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-bold flex items-center gap-2"
                            >
                                <i className="fas fa-chevron-left text-sm"></i> <span className="hidden sm:inline">Anterior</span>
                            </button>
                            <span className="px-3 sm:px-6 py-2.5 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-700 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                                <i className="fas fa-file-alt text-blue-600 dark:text-blue-400 hidden sm:inline"></i>
                                {page}/{Math.ceil(total / limit)}
                            </span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={page >= Math.ceil(total / limit)}
                                className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-[#0F2C4A] to-[#1a4b7a] text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 font-bold flex items-center gap-2"
                            >
                                <span className="hidden sm:inline">Siguiente</span> <i className="fas fa-chevron-right text-sm"></i>
                            </button>
                            <button
                                onClick={() => setPage(Math.ceil(total / limit))}
                                disabled={page >= Math.ceil(total / limit)}
                                className="w-10 h-10 bg-gradient-to-r from-[#0F2C4A] to-[#1a4b7a] text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center font-bold"
                            >
                                <i className="fas fa-angle-double-right"></i>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function getStatusColor(estado: string) {
    if (estado === 'Contratado') return 'bg-green-100 text-green-800';
    if (estado === 'En Retención') return 'bg-orange-100 text-orange-800';
    if (estado === 'Nulo' || estado === 'Desierto') return 'bg-red-100 text-red-800';
    if (estado === 'Cancelado') return 'bg-gray-100 text-gray-800';
    return 'bg-blue-100 text-blue-800';
}
