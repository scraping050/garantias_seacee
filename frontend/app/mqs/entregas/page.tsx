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

export default function EntregasPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [entregas, setEntregas] = useState([
        {
            id: 'GR-2024-001',
            destinatario: 'Cliente ABC S.A.C.',
            ruc: '20123456789',
            direccion: 'Av. Principal 123, Lima',
            fecha: '18 Dic 2024',
            estado: 'En Tránsito',
            verificado: false
        },
        {
            id: 'GR-2024-002',
            destinatario: 'Constructora del Sur',
            ruc: '20555123456',
            direccion: 'Calle Los Pinos 456, Arequipa',
            fecha: '17 Dic 2024',
            estado: 'Entregado',
            verificado: true
        },
        {
            id: 'GR-2024-003',
            destinatario: 'Gobierno Regional Cusco',
            ruc: '20100100100',
            direccion: 'Plaza de Armas s/n, Cusco',
            fecha: '19 Dic 2024',
            estado: 'Pendiente',
            verificado: false
        },
        {
            id: 'GR-2024-004',
            destinatario: 'Minera Las Bambas',
            ruc: '20600099988',
            direccion: 'Carretera Central Km 50',
            fecha: '20 Dic 2024',
            estado: 'Pendiente',
            verificado: false
        },
        {
            id: 'GR-2024-005',
            destinatario: 'Supermercados Peruanos',
            ruc: '20100070970',
            direccion: 'Av. Arequipa 300, Lima',
            fecha: '16 Dic 2024',
            estado: 'Entregado',
            verificado: true
        }
    ]);

    const handleVerify = (id: string) => {
        setEntregas(prev => prev.map(e =>
            e.id === id ? { ...e, verificado: true } : e
        ));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Entregado':
                return 'bg-green-50 text-green-700 border-green-100';
            case 'En Tránsito':
                return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Pendiente':
                return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'Cancelado':
                return 'bg-red-50 text-red-700 border-red-100';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'Entregado': return 'bg-green-500';
            case 'En Tránsito': return 'bg-blue-500';
            case 'Pendiente': return 'bg-yellow-500';
            case 'Cancelado': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    // ... inside EntregasPage component, before return
    const stats = {
        enTransito: entregas.filter(e => e.estado === 'En Tránsito').length,
        entregadas: entregas.filter(e => e.estado === 'Entregado').length,
        pendientes: entregas.filter(e => e.estado === 'Pendiente').length,
        hoy: entregas.filter(e => {
            // Check if date string matches "Today" loosely or match specific mock dates if needed.
            // For now, let's parse the Spanish date "18 Dic 2024" and compare to today.
            // Or simpler: count all for now as mock data is usually recent? 
            // Better: Let's just check if the date string contains the current day/month.
            // As this is a demo, let's assume 'Hoy' is 0 unless we force a date to be today.
            // Or better yet, let's match the hardcoded dates in the mock data: "18 Dic 2024" etc.
            // To make it dynamic, let's just create a Date object for today and format it to match the mock format if possible, or just parse the mock date.
            const months: { [key: string]: number } = {
                'Ene': 0, 'Feb': 1, 'Mar': 2, 'Abr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Ago': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dic': 11
            };
            const [day, monthStr, year] = e.fecha.split(' ');
            const date = new Date(parseInt(year), months[monthStr], parseInt(day));
            const today = new Date();
            return date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
        }).length
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 dark:bg-blue-900/20 rounded-full -mr-16 -mt-16 pointer-events-none blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-[#0F2C4A] dark:text-white tracking-tight">
                        Control de <span className="text-blue-500 dark:text-blue-400">Entregas</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Seguimiento de despachos y logística</p>
                </div>

                <div className="relative z-10">
                    <button className="bg-[#0F2C4A] text-white px-6 py-3 rounded-xl hover:bg-[#163A5F] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 flex items-center gap-3 font-semibold group">
                        <div className="bg-white/10 p-1 rounded-lg group-hover:bg-white/20 transition-colors">
                            <i className="fas fa-plus text-sm"></i>
                        </div>
                        Nueva Entrega
                    </button>
                </div>
            </div>

            {/* Stats Cards Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    icon="fa-truck-fast"
                    title="En Tránsito"
                    value={stats.enTransito}
                    color="text-blue-600"
                    bgColor="bg-blue-50"
                    borderColor="border-blue-100"
                />
                <StatCard
                    icon="fa-check-circle"
                    title="Entregadas"
                    value={stats.entregadas}
                    color="text-green-600"
                    bgColor="bg-green-50"
                    borderColor="border-green-100"
                />
                <StatCard
                    icon="fa-clock"
                    title="Pendientes"
                    value={stats.pendientes}
                    color="text-yellow-600"
                    bgColor="bg-yellow-50"
                    borderColor="border-yellow-100"
                />
                <StatCard
                    icon="fa-calendar-day"
                    title="Hoy"
                    value={stats.hoy}
                    color="text-purple-600"
                    bgColor="bg-purple-50"
                    borderColor="border-purple-100"
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
                            placeholder="Buscar por guía, cliente o dirección..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all bg-white dark:bg-gray-900 dark:text-white"
                        />
                    </div>
                    <button className="px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200">
                        <i className="fas fa-filter"></i>
                        Filtros Avanzados
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">N° Guía</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Destinatario</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dirección</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Envío</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {entregas.map((entrega) => (
                                <tr key={entrega.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group">
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {entrega.id}
                                            </span>
                                            {entrega.verificado && (
                                                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded w-fit mt-1">
                                                    Verificado
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{entrega.destinatario}</div>
                                        <div className="text-xs text-gray-400">RUC: {entrega.ruc}</div>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                            <i className="fas fa-map-pin text-red-400 text-xs"></i>
                                            <span className="text-sm">{entrega.direccion}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{entrega.fecha}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 w-fit ${getStatusColor(entrega.estado)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(entrega.estado)}`}></span>
                                            {entrega.estado}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleVerify(entrega.id)}
                                                disabled={entrega.verificado}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${entrega.verificado
                                                    ? 'text-white bg-green-500 cursor-default shadow-sm'
                                                    : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                                    }`}
                                                title={entrega.verificado ? "Verificado" : "Verificar"}
                                            >
                                                <i className="fas fa-check-circle"></i>
                                            </button>
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all" title="Ver detalles">
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all" title="Ver Mapa">
                                                <i className="fas fa-map-marker-alt"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
