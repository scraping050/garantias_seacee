'use client';

import { useState } from 'react';

export default function ChequesPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 dark:bg-blue-900/20 rounded-full -mr-16 -mt-16 pointer-events-none blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-[#0F2C4A] dark:text-white tracking-tight">
                        Gestión de <span className="text-blue-600 dark:text-blue-400">Cheques</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Control y seguimiento de pagos y emisiones</p>
                </div>

                <div className="relative z-10">
                    <button className="bg-[#0F2C4A] dark:bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-[#163A5F] dark:hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 flex items-center gap-3 font-semibold group">
                        <div className="bg-white/10 p-1 rounded-lg group-hover:bg-white/20 transition-colors">
                            <i className="fas fa-plus text-sm"></i>
                        </div>
                        Nuevo Cheque
                    </button>
                </div>
            </div>

            {/* Stats Cards Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    icon="fa-money-bill-wave"
                    title="Total Cheques"
                    value="145"
                    color="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-50 dark:bg-blue-900/30"
                    borderColor="border-blue-100 dark:border-blue-900/50"
                />
                <StatCard
                    icon="fa-check-circle"
                    title="Cobrados"
                    value="98"
                    color="text-green-600 dark:text-green-400"
                    bgColor="bg-green-50 dark:bg-green-900/30"
                    borderColor="border-green-100 dark:border-green-900/50"
                />
                <StatCard
                    icon="fa-clock"
                    title="Pendientes"
                    value="32"
                    color="text-yellow-600 dark:text-yellow-400"
                    bgColor="bg-yellow-50 dark:bg-yellow-900/30"
                    borderColor="border-yellow-100 dark:border-yellow-900/50"
                />
                <StatCard
                    icon="fa-chart-pie"
                    title="Monto Total"
                    value="S/ 850K"
                    color="text-purple-600 dark:text-purple-400"
                    bgColor="bg-purple-50 dark:bg-purple-900/30"
                    borderColor="border-purple-100 dark:border-purple-900/50"
                />
            </div>

            {/* Table Section Premium */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Search and Filters inside Card */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-700/20 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:max-w-md group">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                        <input
                            type="text"
                            placeholder="Buscar por beneficiario, banco o número..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all bg-white dark:bg-gray-900 dark:text-white"
                        />
                    </div>
                    <button className="px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800">
                        <i className="fas fa-filter"></i>
                        Filtros Avanzados
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">N° Cheque</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Banco</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Beneficiario</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monto</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Emisión</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            <tr className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        CHQ-2024-001
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 text-xs font-bold">B</div>
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">BCP</span>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Proveedor ABC S.A.C.</div>
                                    <div className="text-xs text-gray-400">RUC: 20100100100</div>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">S/ 15,000</span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">15 Dic 2024</span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-100 dark:border-yellow-900/50 flex items-center gap-1.5 w-fit">
                                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                        Pendiente
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all" title="Ver detalles">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all" title="Editar">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all" title="Imprimir">
                                            <i className="fas fa-print"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 sm:px-6 lg:px-8 py-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-700/20 flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Mostrando 1 de 145 registros</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50">Anterior</button>
                        <button className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, color, bgColor, borderColor }: any) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border ${borderColor} dark:border-gray-700 hover:shadow-md transition-shadow group relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-20 h-20 ${bgColor} dark:bg-opacity-10 rounded-bl-full -mr-6 -mt-6 opacity-50 group-hover:scale-110 transition-transform`}></div>

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{title}</p>
                    <p className={`text-3xl font-extrabold ${color} tracking-tight`}>{value}</p>
                </div>
                <div className={`${bgColor} dark:bg-opacity-20 ${color} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <i className={`fas ${icon} text-xl`}></i>
                </div>
            </div>
        </div>
    );
}
