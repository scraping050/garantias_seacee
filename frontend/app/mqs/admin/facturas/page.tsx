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

export default function FacturasPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [facturas] = useState([
        {
            id: 'F001-00123',
            cliente: 'Empresa XYZ S.A.C.',
            ruc: '20543210987',
            tipo: 'emitida',
            monto: 'S/ 25,000',
            fechaEmision: '10 Dic 2024',
            vencimiento: '10 Ene 2025',
            estado: 'pendiente'
        },
        {
            id: 'F001-00124',
            cliente: 'Corporación ABC',
            ruc: '20100055588',
            tipo: 'anulada',
            monto: 'S/ 1,500',
            fechaEmision: '12 Dic 2024',
            vencimiento: '-',
            estado: 'cancelado'
        },
        {
            id: 'F001-00125',
            cliente: 'Inversiones Global',
            ruc: '20600044433',
            tipo: 'emitida',
            monto: 'S/ 12,800',
            fechaEmision: '15 Dic 2024',
            vencimiento: '15 Ene 2025',
            estado: 'pendiente'
        },
        {
            id: 'F001-00126',
            cliente: 'Constructora Norte',
            ruc: '20555566677',
            tipo: 'cambiada',
            monto: 'S/ 45,000',
            fechaEmision: '18 Dic 2024',
            vencimiento: '18 Ene 2025',
            estado: 'cancelado'
        },
        {
            id: 'F001-00127',
            cliente: 'Servicios Integrales',
            ruc: '20100099900',
            tipo: 'emitida',
            monto: 'S/ 3,200',
            fechaEmision: '20 Dic 2024',
            vencimiento: '20 Ene 2025',
            estado: 'pendiente'
        },
        {
            id: 'F001-00128',
            cliente: 'Tech Solutions',
            ruc: '20601234567',
            tipo: 'anulada',
            monto: 'S/ 8,900',
            fechaEmision: '21 Dic 2024',
            vencimiento: '-',
            estado: 'cancelado'
        }
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'cancelado':
                return 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-100 dark:border-green-900/50';
            case 'pendiente':
                return 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-100 dark:border-yellow-900/50';
            default:
                return 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-600';
        }
    };

    const getStatusDot = (status: string) => {
        switch (status) {
            case 'cancelado': return 'bg-green-500';
            case 'pendiente': return 'bg-yellow-500';
            default: return 'bg-gray-400';
        }
    };

    const getTypeColor = (tipo: string) => {
        switch (tipo) {
            case 'emitida': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-900/50';
            case 'anulada': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-900/50';
            case 'cambiada': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-900/50';
            default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-600';
        }
    };

    // ... inside FacturasPage component, before return
    const stats = {
        total: facturas.length,
        pagadas: facturas.filter(f => f.estado === 'cancelado').length,
        pendientes: facturas.filter(f => f.estado === 'pendiente').length,
        vencidas: facturas.filter(f => {
            if (f.estado !== 'pendiente' || f.vencimiento === '-') return false;
            // Simple date parsing for "DD MMM YYYY"
            const months: { [key: string]: number } = {
                'Ene': 0, 'Feb': 1, 'Mar': 2, 'Abr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Ago': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dic': 11
            };
            const [day, monthStr, year] = f.vencimiento.split(' ');
            const date = new Date(parseInt(year), months[monthStr], parseInt(day));
            return date < new Date();
        }).length
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50/50 dark:bg-rose-900/20 rounded-full -mr-16 -mt-16 pointer-events-none blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-[#0F2C4A] dark:text-white tracking-tight">
                        Gestión de <span className="text-rose-500 dark:text-rose-400">Facturas</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Control de facturación y comprobantes</p>
                </div>

                <div className="relative z-10">
                    <button className="bg-[#0F2C4A] dark:bg-rose-600 text-white px-6 py-3 rounded-xl hover:bg-[#163A5F] dark:hover:bg-rose-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 flex items-center gap-3 font-semibold group">
                        <div className="bg-white/10 p-1 rounded-lg group-hover:bg-white/20 transition-colors">
                            <i className="fas fa-plus text-sm"></i>
                        </div>
                        Nueva Factura
                    </button>
                </div>
            </div>

            {/* Stats Cards Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    icon="fa-file-invoice-dollar"
                    title="Total Facturas"
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
                    title="Pendientes"
                    value={stats.pendientes}
                    color="text-yellow-600 dark:text-yellow-400"
                    bgColor="bg-yellow-50 dark:bg-yellow-900/30"
                    borderColor="border-yellow-100 dark:border-yellow-900/50"
                />
                <StatCard
                    icon="fa-exclamation-triangle"
                    title="Vencidas"
                    value={stats.vencidas}
                    color="text-red-600 dark:text-red-400"
                    bgColor="bg-red-50 dark:bg-red-900/30"
                    borderColor="border-red-100 dark:border-red-900/50"
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
                            placeholder="Buscar por número, cliente o monto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-900/30 focus:border-rose-400 transition-all bg-white dark:bg-gray-900 dark:text-white"
                        />
                    </div>
                    <button className="px-5 py-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-gray-600 dark:text-gray-300 font-medium hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800">
                        <i className="fas fa-filter"></i>
                        Filtros Avanzados
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">N° Factura</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente/Proveedor</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monto</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha Emisión</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vencimiento</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                                <th className="px-4 sm:px-6 lg:px-8 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {facturas.map((factura) => (
                                <tr key={factura.id} className="hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-colors group">
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                            {factura.id}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{factura.cliente}</div>
                                        <div className="text-xs text-gray-400">RUC: {factura.ruc}</div>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <span className={`px-2 py-1 text-xs rounded border font-medium capitalize ${getTypeColor(factura.tipo)}`}>
                                            {factura.tipo}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">{factura.monto}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{factura.fechaEmision}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{factura.vencimiento}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 lg:px-8 py-5">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full border flex items-center gap-1.5 w-fit capitalize ${getStatusColor(factura.estado)}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(factura.estado)}`}></span>
                                            {factura.estado}
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
                                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all" title="Descargar">
                                                <i className="fas fa-download"></i>
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
