'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function SEACEResumenPage() {
    const [kpis, setKpis] = useState<any>(null);
    const [licitaciones, setLicitaciones] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 30000); // Reload every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const loadData = async () => {
        try {
            // Cargar KPIs desde dashboard (datos reales adaptados)
            const kpisRes = await api.get('/api/dashboard/kpis');

            // Mapear los datos del backend al formato esperado por el frontend
            const dashboardData = kpisRes.data;
            setKpis({
                total_adjudicado: parseFloat(dashboardData.monto_total_estimado || 0),
                cantidad_procesos: dashboardData.total_licitaciones || 0,
                ahorro_total: 0, // No hay datos de adjudicación aún
                porcentaje_ahorro: 0 // No hay datos de adjudicación aún
            });

            // Cargar licitaciones recientes (datos reales)
            const licitRes = await api.get('/api/licitaciones?limit=50');
            setLicitaciones(licitRes.data.items || []);
        } catch (error) {
            console.error('Error loading data:', error);
            // Mostrar error en lugar de datos mock
            setKpis({
                total_adjudicado: 0,
                cantidad_procesos: 0,
                ahorro_total: 0,
                porcentaje_ahorro: 0,
                error: 'No se pudieron cargar los datos. Verifica la conexión con el backend.'
            });
            setLicitaciones([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <i className="fas fa-spinner fa-spin text-2xl sm:text-3xl lg:text-4xl text-[#0F2C4A] mb-4"></i>
                    <p className="text-gray-600">Cargando datos SEACE...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            {/* Header Premium */}
            <div className="mb-6 sm:mb-8 bg-gradient-to-r from-[#0F2C4A] to-[#1a4b7a] dark:from-gray-900 dark:to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl text-white border border-transparent dark:border-gray-700">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 bg-white/20 dark:bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <i className="fas fa-gauge-high text-xl sm:text-2xl lg:text-3xl text-white drop-shadow-lg"></i>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight">
                            Resumen Ejecutivo SEACE
                        </h1>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {kpis?.error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <i className="fas fa-exclamation-triangle text-red-500 mr-3"></i>
                        <div>
                            <p className="text-red-800 font-semibold">Error al cargar datos</p>
                            <p className="text-red-700 text-sm">{kpis.error}</p>
                            <p className="text-red-600 text-xs mt-1">
                                Asegúrate de que el backend esté corriendo en http://localhost:8000 y que la base de datos tenga datos.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Cards Premium */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <KPICard
                    value={`S/ ${(kpis?.total_adjudicado / 1000000).toFixed(1)}M`}
                    label="Monto Adjudicado"
                    color="blue"
                    icon="fa-dollar-sign"
                />
                <KPICard
                    value={kpis?.cantidad_procesos || 0}
                    label="Licitaciones"
                    color="purple"
                    icon="fa-file-contract"
                />
                <KPICard
                    value={`S/ ${(kpis?.ahorro_total / 1000000).toFixed(1)}M`}
                    label="Ahorro Total"
                    color="green"
                    icon="fa-piggy-bank"
                />
                <KPICard
                    value={`${kpis?.porcentaje_ahorro?.toFixed(1)}%`}
                    label="% Ahorro"
                    color="green"
                    icon="fa-percentage"
                />
            </div>

            {/* Recent Licitaciones */}
            <h4 className="text-2xl font-bold text-[#0F2C4A] dark:text-white mb-4 flex items-center gap-3">
                <i className="fas fa-list-ul text-blue-600 dark:text-blue-400"></i>
                Últimos Movimientos
            </h4>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead className="bg-gradient-to-r from-[#0F2C4A] to-[#1a4b7a] dark:from-gray-900 dark:to-gray-800 text-white">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">Nomenclatura</th>
                                <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">Entidad</th>
                                <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">Monto</th>
                                <th className="px-6 py-4 text-left text-sm font-bold tracking-wide">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {licitaciones.map((lic, idx) => (
                                <tr key={idx} className="border-b dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{lic.nomenclatura}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{lic.comprador}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-[#0F2C4A] dark:text-blue-400">
                                        S/ {lic.monto_estimado?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getStatusColor(lic.estado_proceso)}`}>
                                            {lic.estado_proceso}
                                        </span>
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

interface KPICardProps {
    value: string | number;
    label: string;
    color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
    icon: string;
}

function KPICard({ value, label, color, icon }: KPICardProps) {
    const colors: Record<KPICardProps['color'], { bg: string; text: string; icon: string }> = {
        blue: { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600 dark:text-blue-400', icon: 'bg-blue-500' },
        green: { bg: 'from-green-500 to-green-600', text: 'text-green-600 dark:text-green-400', icon: 'bg-green-500' },
        orange: { bg: 'from-orange-500 to-orange-600', text: 'text-orange-600 dark:text-orange-400', icon: 'bg-orange-500' },
        red: { bg: 'from-red-500 to-red-600', text: 'text-red-600 dark:text-red-400', icon: 'bg-red-500' },
        purple: { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600 dark:text-purple-400', icon: 'bg-purple-500' }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group hover:-translate-y-1">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color].bg} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <i className={`fas ${icon} text-white text-xl`}></i>
                    </div>
                </div>
                <div className={`text-3xl md:text-4xl font-black ${colors[color].text} mb-2 tracking-tight`}>{value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 uppercase font-semibold tracking-wide">{label}</div>
            </div>
        </div>
    );
}

function getStatusColor(estado: string) {
    if (estado === 'Contratado') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (estado === 'En Retención') return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (estado === 'Nulo') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
}
