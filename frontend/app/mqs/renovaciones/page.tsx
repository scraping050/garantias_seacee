'use client';

import { useState } from 'react';

function StatCard({ icon, title, value, color, bgColor, borderColor }: any) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border ${borderColor} dark:border-gray-700 hover:shadow-md transition-shadow group relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-20 h-20 ${bgColor} dark:bg-opacity-10 rounded-bl-full -mr-6 -mt-6 opacity-50 group-hover:scale-110 transition-transform`}></div>

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{title}</p>
                    <p className={`text-3xl font-extrabold ${color} tracking-tight`}>{value}</p>
                </div>
                <div className={`${bgColor} dark:bg-gray-700 ${color} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <i className={`fas ${icon} text-xl`}></i>
                </div>
            </div>
        </div>
    );
}

export default function RenovacionesPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 dark:bg-orange-900/20 rounded-full -mr-16 -mt-16 pointer-events-none blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-[#0F2C4A] dark:text-white tracking-tight">
                        Gestión de <span className="text-orange-500 dark:text-orange-400">Renovaciones</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Control de vencimientos y extensiones de garantías</p>
                </div>

                <div className="relative z-10">
                    <button className="bg-[#0F2C4A] text-white px-6 py-3 rounded-xl hover:bg-[#163A5F] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 flex items-center gap-3 font-semibold group">
                        <div className="bg-white/10 p-1 rounded-lg group-hover:bg-white/20 transition-colors">
                            <i className="fas fa-plus text-sm"></i>
                        </div>
                        Nueva Renovación
                    </button>
                </div>
            </div>

            {/* Stats Cards Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    icon="fa-clock"
                    title="Pendientes"
                    value="12"
                    color="text-yellow-600"
                    bgColor="bg-yellow-50"
                    borderColor="border-yellow-100"
                />
                <StatCard
                    icon="fa-check-circle"
                    title="Completadas"
                    value="45"
                    color="text-green-600"
                    bgColor="bg-green-50"
                    borderColor="border-green-100"
                />
                <StatCard
                    icon="fa-exclamation-triangle"
                    title="Por Vencer"
                    value="8"
                    color="text-orange-600"
                    bgColor="bg-orange-50"
                    borderColor="border-orange-100"
                />
                <StatCard
                    icon="fa-calendar-alt"
                    title="Este Mes"
                    value="23"
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                    borderColor="border-blue-100"
                />
            </div>

            {/* Table Section Premium */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Search and Filters */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:max-w-md group">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                        <input
                            type="text"
                            placeholder="Buscar por código, obra o estado..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 focus:border-orange-400 transition-all bg-white dark:bg-gray-900 dark:text-white"
                        />
                    </div>
                    <button className="px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium hover:text-orange-600 dark:hover:text-orange-400 hover:border-orange-200">
                        <i className="fas fa-filter"></i>
                        Filtros Avanzados
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Obra</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vencimiento</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            <tr className="hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition-colors group">
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                        REN-2024-001
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Obra Ejemplo 1</div>
                                    <div className="text-xs text-gray-400">Cliente: Ministerio de Vivienda</div>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <i className="far fa-calendar-alt text-orange-400"></i>
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">15 Ene 2025</span>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800 flex items-center gap-1.5 w-fit">
                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                        Pendiente
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Ver detalles">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all" title="Aprobar">
                                            <i className="fas fa-check"></i>
                                        </button>
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Eliminar">
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
