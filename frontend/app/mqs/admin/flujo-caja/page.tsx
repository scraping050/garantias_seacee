'use client';

import { useState } from 'react';

function StatCard({ icon, title, value, subtitle, color, bgColor, borderColor }: any) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border ${borderColor} dark:border-gray-700 hover:shadow-md transition-shadow group relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-20 h-20 ${bgColor} dark:bg-opacity-10 rounded-bl-full -mr-6 -mt-6 opacity-50 group-hover:scale-110 transition-transform`}></div>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{title}</p>
                    <p className={`text-3xl font-extrabold ${color} mb-2 tracking-tight`}>{value}</p>
                    <p className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 inline-block px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-600">{subtitle}</p>
                </div>
                <div className={`${bgColor} dark:bg-opacity-20 ${color} w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                    <i className={`fas ${icon} text-2xl`}></i>
                </div>
            </div>
        </div>
    );
}

function CategoryItem({ name, amount, percentage, color, icon }: any) {
    return (
        <div className="group p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} bg-opacity-10 dark:bg-opacity-20 text-${color.split('-')[1]}-600 dark:text-${color.split('-')[1]}-400`}>
                        <i className={`fas ${icon} text-sm`}></i>
                    </div>
                    <div>
                        <span className="text-gray-900 dark:text-white font-semibold block">{name}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{percentage} del total</span>
                    </div>
                </div>
                <span className="font-bold text-gray-900 dark:text-white text-lg">{amount}</span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                <div className={`${color} h-2 rounded-full transition-all duration-1000 ease-out group-hover:scale-x-105 origin-left`} style={{ width: percentage }}></div>
            </div>
        </div>
    );
}

export default function FlujoCajaPage() {
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-full -mr-16 -mt-16 pointer-events-none blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-[#0F2C4A] dark:text-white tracking-tight">
                        Flujo de <span className="text-emerald-600 dark:text-emerald-400">Caja</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Análisis en tiempo real de ingresos y egresos</p>
                </div>

                <div className="relative z-10 flex gap-3">
                    <div className="relative">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="appearance-none bg-white dark:bg-gray-800 px-6 py-3 pr-10 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-400 text-gray-700 dark:text-gray-300 font-medium cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors shadow-sm"
                        >
                            <option value="week">Esta Semana</option>
                            <option value="month">Este Mes</option>
                            <option value="quarter">Este Trimestre</option>
                            <option value="year">Este Año</option>
                        </select>
                        <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                    </div>
                    <button className="bg-[#0F2C4A] dark:bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-[#163A5F] dark:hover:bg-emerald-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 flex items-center gap-2 font-semibold">
                        <i className="fas fa-download"></i>
                        <span className="hidden sm:inline">Exportar Reporte</span>
                    </button>
                </div>
            </div>

            {/* Summary Cards Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <StatCard
                    icon="fa-arrow-trend-up"
                    title="Ingresos Totales"
                    value="S/ 1,250,000"
                    subtitle="+12% vs mes anterior"
                    color="text-emerald-600 dark:text-emerald-400"
                    bgColor="bg-emerald-50 dark:bg-emerald-900/30"
                    borderColor="border-emerald-100 dark:border-emerald-900/50"
                />
                <StatCard
                    icon="fa-arrow-trend-down"
                    title="Egresos Totales"
                    value="S/ 890,000"
                    subtitle="-5% vs mes anterior"
                    color="text-rose-600 dark:text-rose-400"
                    bgColor="bg-rose-50 dark:bg-rose-900/30"
                    borderColor="border-rose-100 dark:border-rose-900/50"
                />
                <StatCard
                    icon="fa-wallet"
                    title="Balance Neto"
                    value="S/ 360,000"
                    subtitle="Flujo de caja saludable"
                    color="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-50 dark:bg-blue-900/30"
                    borderColor="border-blue-100 dark:border-blue-900/50"
                />
            </div>

            {/* Chart Placeholder Premium */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Evolución Financiera</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Comparativa de ingresos vs egresos</p>
                    </div>
                    <button className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 text-sm font-semibold hover:underline">Ver detalle completo</button>
                </div>

                <div className="h-80 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 dark:opacity-5"></div>
                    <div className="text-center relative z-10 transition-transform group-hover:scale-105 duration-500">
                        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <i className="fas fa-chart-line text-2xl sm:text-3xl lg:text-4xl text-emerald-300 dark:text-emerald-500"></i>
                        </div>
                        <p className="text-gray-900 dark:text-white font-bold text-lg">Visualización de Datos</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">Pronto podrás visualizar gráficos interactivos detallados de tu flujo de caja en este espacio.</p>
                    </div>
                </div>
            </div>

            {/* Detailed Breakdown Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Ingresos */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                            <i className="fas fa-arrow-up text-emerald-600 dark:text-emerald-400"></i>
                        </div>
                        Ingresos por Categoría
                    </h3>
                    <div className="space-y-4">
                        <CategoryItem
                            name="Servicios de Garantías"
                            amount="S/ 850,000"
                            percentage="68%"
                            color="bg-emerald-500"
                            icon="fa-shield-alt"
                        />
                        <CategoryItem
                            name="Renovaciones"
                            amount="S/ 280,000"
                            percentage="22%"
                            color="bg-teal-400"
                            icon="fa-sync-alt"
                        />
                        <CategoryItem
                            name="Otros Servicios"
                            amount="S/ 120,000"
                            percentage="10%"
                            color="bg-green-300"
                            icon="fa-plus-circle"
                        />
                    </div>
                </div>

                {/* Egresos */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                            <i className="fas fa-arrow-down text-rose-600 dark:text-rose-400"></i>
                        </div>
                        Egresos por Categoría
                    </h3>
                    <div className="space-y-4">
                        <CategoryItem
                            name="Primas de Seguros"
                            amount="S/ 420,000"
                            percentage="47%"
                            color="bg-rose-500"
                            icon="fa-file-invoice-dollar"
                        />
                        <CategoryItem
                            name="Gastos Operativos"
                            amount="S/ 310,000"
                            percentage="35%"
                            color="bg-red-400"
                            icon="fa-cogs"
                        />
                        <CategoryItem
                            name="Otros Gastos"
                            amount="S/ 160,000"
                            percentage="18%"
                            color="bg-orange-300"
                            icon="fa-receipt"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
