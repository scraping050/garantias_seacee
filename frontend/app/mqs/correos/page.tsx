'use client';

import { useState } from 'react';

function StatCard({ icon, title, value, color, bgColor, borderColor }: any) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border ${borderColor} dark:border-gray-700 hover:shadow-md transition-shadow group relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-20 h-20 ${bgColor} rounded-bl-full -mr-6 -mt-6 opacity-50 group-hover:scale-110 transition-transform`}></div>

            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
                    <p className={`text-3xl font-extrabold ${color} tracking-tight`}>{value}</p>
                </div>
                <div className={`${bgColor} ${color} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <i className={`fas ${icon} text-xl`}></i>
                </div>
            </div>
        </div>
    );
}

export default function CorreosPage() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-full -mr-16 -mt-16 pointer-events-none blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-[#0F2C4A] dark:text-white tracking-tight">
                        Gestión de <span className="text-indigo-500 dark:text-indigo-400">Correos</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Administración de correspondencia y comunicaciones</p>
                </div>

                <div className="relative z-10">
                    <button className="bg-[#0F2C4A] dark:bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-[#163A5F] dark:hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 flex items-center gap-3 font-semibold group">
                        <div className="bg-white/10 p-1 rounded-lg group-hover:bg-white/20 transition-colors">
                            <i className="fas fa-plus text-sm"></i>
                        </div>
                        Nuevo Correo
                    </button>
                </div>
            </div>

            {/* Stats Cards Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    icon="fa-inbox"
                    title="Recibidos"
                    value="234"
                    value="234"
                    color="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-50 dark:bg-blue-900/30"
                    borderColor="border-blue-100 dark:border-blue-900/50"
                />
                <StatCard
                    icon="fa-paper-plane"
                    title="Enviados"
                    value="189"
                    value="189"
                    color="text-green-600 dark:text-green-400"
                    bgColor="bg-green-50 dark:bg-green-900/30"
                    borderColor="border-green-100 dark:border-green-900/50"
                />
                <StatCard
                    icon="fa-envelope"
                    title="Sin Leer"
                    value="23"
                    value="23"
                    color="text-orange-600 dark:text-orange-400"
                    bgColor="bg-orange-50 dark:bg-orange-900/30"
                    borderColor="border-orange-100 dark:border-orange-900/50"
                />
                <StatCard
                    icon="fa-star"
                    title="Importantes"
                    value="12"
                    value="12"
                    color="text-yellow-600 dark:text-yellow-400"
                    bgColor="bg-yellow-50 dark:bg-yellow-900/30"
                    borderColor="border-yellow-100 dark:border-yellow-900/50"
                />
            </div>

            {/* Table Section Premium */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {/* Search and Filters */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-700/20 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:max-w-md group">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                        <input
                            type="text"
                            placeholder="Buscar por asunto, remitente o tipo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 transition-all bg-white dark:bg-gray-900 dark:text-white"
                        />
                    </div>
                    <button className="px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800">
                        <i className="fas fa-filter"></i>
                        Filtros Avanzados
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">De/Para</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Asunto</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            <tr className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-bold">JD</div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                                            cliente@empresa.com
                                        </span>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">Consulta sobre renovación</div>
                                    <div className="text-xs text-gray-400 truncate max-w-xs">Buenas tardes, quisiera consultar sobre...</div>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <span className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">Recibido</span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">18 Dic 10:30 AM</span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-100 dark:border-orange-900/50 flex items-center gap-1.5 w-fit">
                                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                        Sin Leer
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all" title="Ver correo">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all" title="Responder">
                                            <i className="fas fa-reply"></i>
                                        </button>
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 transition-all" title="Destacar">
                                            <i className="fas fa-star"></i>
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
