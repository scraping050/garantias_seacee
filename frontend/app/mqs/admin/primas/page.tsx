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
                <div className={`${bgColor} dark:bg-opacity-20 ${color} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <i className={`fas ${icon} text-xl`}></i>
                </div>
            </div>
        </div>
    );
}

export default function PrimasPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [primas, setPrimas] = useState([
        {
            id: 'PRM-2024-001',
            aseguradora: 'Cesce Perú',
            poliza: 'POL-2024-456',
            monto: 'S/ 8,500',
            vencimiento: '25 Ene 2025',
            estado: 'Cancelado',
            verificado: true
        },
        {
            id: 'PRM-2024-002',
            aseguradora: 'Cesce Perú',
            poliza: 'POL-2024-789',
            monto: 'S/ 12,200',
            vencimiento: '10 Feb 2025',
            estado: 'Pendiente',
            verificado: false
        },
        {
            id: 'PRM-2024-003',
            aseguradora: 'Cesce Perú',
            poliza: 'POL-2024-101',
            monto: 'S/ 5,400',
            vencimiento: '05 Ene 2025',
            estado: 'Cancelado',
            verificado: true
        },
        {
            id: 'PRM-2024-004',
            aseguradora: 'Cesce Perú',
            poliza: 'POL-2024-202',
            monto: 'S/ 24,000',
            vencimiento: '15 Mar 2025',
            estado: 'Pendiente',
            verificado: false
        },
        {
            id: 'PRM-2024-005',
            aseguradora: 'Cesce Perú',
            poliza: 'POL-2024-303',
            monto: 'S/ 3,100',
            vencimiento: '01 Feb 2025',
            estado: 'Pendiente',
            verificado: false
        },
        {
            id: 'PRM-2024-006',
            aseguradora: 'Cesce Perú',
            poliza: 'POL-2024-404',
            monto: 'S/ 15,750',
            vencimiento: '20 Abr 2025',
            estado: 'Cancelado',
            verificado: true
        }
    ]);

    const handleVerify = (id: string) => {
        setPrimas(prev => prev.map(p =>
            p.id === id ? { ...p, verificado: true } : p
        ));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Cancelado':
                return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-100 dark:border-green-900/50'; // Cancelado = Pagado usually
            case 'Pendiente':
                return 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-100 dark:border-yellow-900/50';
            default:
                return 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-600';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'Cancelado': return 'bg-green-500';
            case 'Pendiente': return 'bg-yellow-500';
            default: return 'bg-gray-400';
        }
    };

    // ... inside PrimasPage component, before return
    const stats = {
        total: primas.length,
        pagadas: primas.filter(p => p.estado === 'Cancelado').length,
        porPagar: primas.filter(p => p.estado === 'Pendiente').length,
        montoTotal: primas.reduce((acc, curr) => {
            const val = parseFloat(curr.monto.replace('S/ ', '').replace(',', ''));
            return acc + (isNaN(val) ? 0 : val);
        }, 0)
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/50 dark:bg-teal-900/20 rounded-full -mr-16 -mt-16 pointer-events-none blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-[#0F2C4A] dark:text-white tracking-tight">
                        Gestión de <span className="text-teal-600 dark:text-teal-400">Primas</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Control de pólizas y pagos de seguros</p>
                </div>

                <div className="relative z-10">
                    <button className="bg-[#0F2C4A] dark:bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-[#163A5F] dark:hover:bg-teal-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 flex items-center gap-3 font-semibold group">
                        <div className="bg-white/10 p-1 rounded-lg group-hover:bg-white/20 transition-colors">
                            <i className="fas fa-plus text-sm"></i>
                        </div>
                        Nueva Prima
                    </button>
                </div>
            </div>

            {/* Stats Cards Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    icon="fa-hand-holding-dollar"
                    title="Total Primas"
                    value={stats.total}
                    color="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-50 dark:bg-blue-900/30"
                    borderColor="border-blue-100 dark:border-blue-900/50"
                />
                <StatCard
                    icon="fa-check-circle"
                    title="Pagadas"
                    value={stats.pagadas}
                    color="text-green-600 dark:text-green-400"
                    bgColor="bg-green-50 dark:bg-green-900/30"
                    borderColor="border-green-100 dark:border-green-900/50"
                />
                <StatCard
                    icon="fa-clock"
                    title="Por Pagar"
                    value={stats.porPagar}
                    color="text-orange-600 dark:text-orange-400"
                    bgColor="bg-orange-50 dark:bg-orange-900/30"
                    borderColor="border-orange-100 dark:border-orange-900/50"
                />
                <StatCard
                    icon="fa-dollar-sign"
                    title="Monto Total"
                    value={`S/ ${(stats.montoTotal / 1000).toFixed(1)}K`}
                    color="text-purple-600 dark:text-purple-400"
                    bgColor="bg-purple-50 dark:bg-purple-900/30"
                    borderColor="border-purple-100 dark:border-purple-900/50"
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
                            placeholder="Buscar prima, aseguradora o póliza..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/30 focus:border-teal-400 transition-all bg-white dark:bg-gray-900 dark:text-white"
                        />
                    </div>
                    <button className="px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium hover:text-teal-600 dark:hover:text-teal-400 hover:border-teal-200 dark:hover:border-teal-800">
                        <i className="fas fa-filter"></i>
                        Filtros Avanzados
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">N° Prima</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aseguradora</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Póliza</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monto</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vencimiento</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {primas.map((prima) => (
                                <tr key={prima.id} className="hover:bg-teal-50/30 dark:hover:bg-teal-900/10 transition-colors group">
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                                {prima.id}
                                            </span>
                                            {prima.verificado && (
                                                <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded w-fit mt-1">
                                                    Verificado
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{prima.aseguradora}</div>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{prima.poliza}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{prima.monto}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{prima.vencimiento}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 w-fit ${getStatusColor(prima.estado)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(prima.estado)}`}></span>
                                            {prima.estado}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 text-right">
                                            <button
                                                onClick={() => handleVerify(prima.id)}
                                                disabled={prima.verificado}
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${prima.verificado
                                                    ? 'text-white bg-green-500 cursor-default shadow-sm'
                                                    : 'text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30'
                                                    }`}
                                                title={prima.verificado ? "Verificado" : "Verificar"}
                                            >
                                                <i className="fas fa-check-circle"></i>
                                            </button>
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all" title="Ver detalles">
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all" title="Descargar PDF">
                                                <i className="fas fa-file-pdf"></i>
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
