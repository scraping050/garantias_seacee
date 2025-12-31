'use client';

import { useState } from 'react';

function ReportTypeCard({ icon, title, description, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`p-6 rounded-2xl border transition-all duration-300 group relative overflow-hidden text-left w-full h-full flex flex-col items-center justify-center gap-3 ${active
                ? 'border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20 shadow-md transform scale-105'
                : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg hover:-translate-y-1'
                }`}
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors mb-2 ${active ? 'bg-[#0F2C4A] dark:bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                }`}>
                <i className={`fas ${icon} text-2xl`}></i>
            </div>
            <div className="text-center relative z-10">
                <p className={`font-bold text-lg mb-1 ${active ? 'text-[#0F2C4A] dark:text-blue-400' : 'text-gray-900 dark:text-white group-hover:text-[#0F2C4A] dark:group-hover:text-blue-400'}`}>
                    {title}
                </p>
                <p className={`text-sm ${active ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}>{description}</p>
            </div>

            {active && (
                <div className="absolute top-2 right-2 text-blue-500 dark:text-blue-400 animate-pulse">
                    <i className="fas fa-check-circle text-lg"></i>
                </div>
            )}
        </button>
    );
}

function StatCard({ icon, title, value, change, positive, color, bgColor }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bgColor} dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <i className={`fas ${icon} text-2xl ${color} dark:text-opacity-90`}></i>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${positive
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-100 dark:border-green-900/50'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-100 dark:border-red-900/50'}`}>
                    {change}
                    <i className={`fas fa-arrow-${positive ? 'up' : 'down'} ml-1`}></i>
                </span>
            </div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{title}</p>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">{value}</p>
        </div>
    );
}

export default function InformesPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [selectedReport, setSelectedReport] = useState('general');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-full -mr-16 -mt-16 pointer-events-none blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-[#0F2C4A] dark:text-white tracking-tight">
                        Centro de <span className="text-indigo-600 dark:text-indigo-400">Informes</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Reportes detallados y análisis financieros</p>
                </div>

                <div className="relative z-10 flex gap-3 flex-wrap">
                    <div className="relative">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="appearance-none bg-white dark:bg-gray-800 px-6 py-3 pr-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 focus:border-indigo-400 text-gray-700 dark:text-gray-300 font-medium cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors shadow-sm"
                        >
                            <option value="week">Esta Semana</option>
                            <option value="month">Este Mes</option>
                            <option value="quarter">Este Trimestre</option>
                            <option value="year">Este Año</option>
                        </select>
                        <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                    <button className="bg-[#0F2C4A] dark:bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-[#163A5F] dark:hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 flex items-center gap-2 font-semibold">
                        <i className="fas fa-file-pdf"></i>
                        <span className="hidden sm:inline">Exportar PDF</span>
                    </button>
                    <button className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:border-gray-300 dark:hover:border-gray-500">
                        <i className="fas fa-ellipsis-v"></i>
                    </button>
                </div>
            </div>

            {/* Report Type Selector Premium */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-8 bg-indigo-500 dark:bg-indigo-400 rounded-full"></span>
                    Selecciona un Tipo de Informe
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                    <ReportTypeCard
                        icon="fa-chart-bar"
                        title="General"
                        description="Vista 360° del negocio"
                        active={selectedReport === 'general'}
                        onClick={() => setSelectedReport('general')}
                    />
                    <ReportTypeCard
                        icon="fa-money-bill-trend-up"
                        title="Financiero"
                        description="Ingresos, egresos y utilidad"
                        active={selectedReport === 'financial'}
                        onClick={() => setSelectedReport('financial')}
                    />
                    <ReportTypeCard
                        icon="fa-users"
                        title="Clientes"
                        description="Cartera y comportamiento"
                        active={selectedReport === 'clients'}
                        onClick={() => setSelectedReport('clients')}
                    />
                    <ReportTypeCard
                        icon="fa-file-contract"
                        title="Garantías"
                        description="Estado de pólizas y fianzas"
                        active={selectedReport === 'guarantees'}
                        onClick={() => setSelectedReport('guarantees')}
                    />
                </div>
            </div>

            {/* Stats Overview Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    icon="fa-file-invoice-dollar"
                    title="Total Facturado"
                    value="S/ 2,450,000"
                    change="15.3%"
                    positive={true}
                    color="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-50 dark:bg-blue-900/30"
                />
                <StatCard
                    icon="fa-hand-holding-dollar"
                    title="Primas Cobradas"
                    value="S/ 890,000"
                    change="8.2%"
                    positive={true}
                    color="text-green-600 dark:text-green-400"
                    bgColor="bg-green-50 dark:bg-green-900/30"
                />
                <StatCard
                    icon="fa-money-check-dollar"
                    title="Cheques Emitidos"
                    value="S/ 1,120,000"
                    change="3.1%"
                    positive={false}
                    color="text-orange-600 dark:text-orange-400"
                    bgColor="bg-orange-50 dark:bg-orange-900/30"
                />
                <StatCard
                    icon="fa-chart-line"
                    title="Utilidad Neta"
                    value="S/ 430,000"
                    change="12.7%"
                    positive={true}
                    color="text-purple-600 dark:text-purple-400"
                    bgColor="bg-purple-50 dark:bg-purple-900/30"
                />
            </div>

            {/* Charts Section Premium (Placeholders) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Chart 1 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400"><i className="fas fa-chart-area"></i></div>
                            Evolución Mensual
                        </span>
                        <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><i className="fas fa-expand-alt"></i></button>
                    </h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/0 to-blue-50/50 dark:to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="text-center relative z-10">
                            <i className="fas fa-chart-area text-5xl text-blue-200 dark:text-blue-500/50 mb-3 group-hover:scale-110 transition-transform duration-500"></i>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Visualización Gráfica</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Datos interactivos próximamente</p>
                        </div>
                    </div>
                </div>

                {/* Chart 2 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400"><i className="fas fa-chart-pie"></i></div>
                            Distribución por Categoría
                        </span>
                        <button className="text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"><i className="fas fa-expand-alt"></i></button>
                    </h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-50/0 to-green-50/50 dark:to-green-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="text-center relative z-10">
                            <i className="fas fa-chart-pie text-5xl text-green-200 dark:text-green-500/50 mb-3 group-hover:scale-110 transition-transform duration-500"></i>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Gráfico Circular</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Análisis detallado de segmentos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Reports Table Premium */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-700/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <i className="fas fa-history text-gray-400"></i>
                        Historial de Informes Generados
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo de Informe</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Período</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Generado</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            <tr className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
                                            <i className="fas fa-chart-bar"></i>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">Informe General</span>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5 text-sm text-gray-600 dark:text-gray-300 font-medium">Diciembre 2024</td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5 text-sm text-gray-500 dark:text-gray-400">18 Dic 2024 - 08:30</td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5">
                                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-900/50 flex items-center gap-1.5 w-fit">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Completado
                                    </span>
                                </td>
                                <td className="px-4 sm:px-6 lg:px-8 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all" title="Ver">
                                            <i className="fas fa-eye"></i>
                                        </button>
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-all" title="Descargar">
                                            <i className="fas fa-download"></i>
                                        </button>
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all" title="Compartir">
                                            <i className="fas fa-share-nodes"></i>
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
