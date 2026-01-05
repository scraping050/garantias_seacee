"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Bell,
    CheckCheck,
    Trash2,
    Check,
    MapPin,
    DollarSign,
    Box,
    Briefcase,
    ArrowRight
} from "lucide-react";
import { type Notificacion, type EstadoLicitacion } from "@/types/notificacion";
import { useNotifications } from "@/hooks/use-notifications"; // Import hook

export default function NotificacionesPage() {
    const [filter, setFilter] = useState<'TODOS' | 'NO_LEIDOS' | 'LEIDOS'>('NO_LEIDOS');

    // Use the real hook
    const {
        notifications: realNotifications,
        markAsRead: apiMarkAsRead,
        markAllAsRead: apiMarkAllAsRead,
        deleteNotification: apiDeleteNotification
    } = useNotifications(5); // Refresh every 5s

    // Transform API notification to UI format if needed, or use directly
    // The UI uses: id, titulo, mensaje, fecha, estado ('NO_LEIDO'|'LEIDO'), metadata fields
    const items = realNotifications.filter((n: any) => {
        if (filter === 'TODOS') return true;
        if (filter === 'NO_LEIDOS') return !n.is_read;
        if (filter === 'LEIDOS') return n.is_read;
        return true;
    }).map((n: any) => ({
        ...n,
        // Map hook 'is_read' to local 'estado' string just for compatibility with existing UI logic below
        estado: n.is_read ? 'LEIDO' : 'NO_LEIDO',
        // Extract metadata
        categoria: n.metadata?.categoria || 'GENERAL',
        ubicacion: n.metadata?.ubicacion || 'PERU',
        monto: n.metadata?.monto || 0,
        estadoAnterior: n.metadata?.estadoAnterior || null,
        estadoNuevo: n.metadata?.estadoNuevo || null,
        licitacionId: n.metadata?.licitacionId || '#',
        orcid: n.metadata?.orcid || ''
    }));

    const markAllAsRead = () => {
        apiMarkAllAsRead();
    };

    const markAsRead = (id: number) => {
        apiMarkAsRead(id);
    };

    const deleteNotification = (id: number) => {
        apiDeleteNotification(id);
    };

    const formatCurrency = (val?: number) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 0 }).format(val || 0);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('es-PE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    const getStatusBadge = (status?: EstadoLicitacion) => {
        if (!status) return null;
        let styles = "bg-slate-100 text-slate-500 border-slate-200";
        if (status === 'CONTRATADO') styles = "bg-emerald-50 text-emerald-600 border-emerald-200";
        if (status === 'NULO') styles = "bg-red-50 text-red-600 border-red-200";

        return (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${styles} uppercase`}>
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 dark:bg-[#0b122b]">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notificaciones</h1>
                        <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">Historial de cambios en licitaciones</p>
                    </div>
                    <button
                        onClick={markAllAsRead}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Marcar todos leídos
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilter('TODOS')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'TODOS' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('NO_LEIDOS')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'NO_LEIDOS' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'}`}
                    >
                        No leídos
                    </button>
                    <button
                        onClick={() => setFilter('LEIDOS')}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'LEIDOS' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'bg-white text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'}`}
                    >
                        Leídos
                    </button>
                </div>

                {/* List Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden dark:bg-[#111c44] dark:border-white/5">

                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider dark:border-white/5">
                        <div className="col-span-5">Licitación</div>
                        <div className="col-span-2">Detalles</div>
                        <div className="col-span-3 text-center">Cambio de Estado</div>
                        <div className="col-span-1 text-center">Fecha</div>
                        <div className="col-span-1 text-right">Acciones</div>
                    </div>

                    {/* Items */}
                    {items.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-white/5">
                            {items.map((notif) => (
                                <div key={notif.id} className={`p-4 md:grid md:grid-cols-12 md:gap-4 items-center group transition-colors hover:bg-slate-50/50 ${notif.estado === 'NO_LEIDO' ? 'bg-blue-50/10 dark:bg-blue-900/10' : ''}`}>

                                    {/* Licitacion Info */}
                                    <div className="col-span-5 flex gap-3 mb-4 md:mb-0">
                                        <div className="pt-1.5 shrink-0">
                                            {notif.estado === 'NO_LEIDO' ? (
                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
                                            ) : (
                                                <div className="w-2.5 h-2.5 rounded-full border border-slate-300"></div>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">
                                                {notif.titulo}
                                            </h3>
                                            <p className="text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
                                                {notif.mensaje}
                                            </p>

                                            {notif.orcid && (
                                                <Link href={`/seace/busqueda/${notif.licitacionId}`} className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline mt-1">
                                                    Ver Orcid: {notif.orcid}
                                                </Link>
                                            )}
                                        </div>
                                    </div>

                                    {/* Detalles Mini Grid */}
                                    <div className="col-span-2 space-y-2 mb-4 md:mb-0 pl-6 border-l md:border-l-0 border-slate-100 md:pl-0 dark:border-white/5">
                                        <div className="flex items-center gap-2">
                                            {notif.categoria === 'OBRAS' ? <Briefcase className="w-3.5 h-3.5 text-orange-500" /> : <Box className="w-3.5 h-3.5 text-orange-500" />}
                                            <span className="text-[10px] font-bold text-slate-600 uppercase dark:text-slate-300">{notif.categoria}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                            <span className="text-[10px] font-bold text-slate-600 uppercase dark:text-slate-300">{notif.ubicacion}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                                            <span className="text-[10px] font-bold text-emerald-600">{formatCurrency(notif.monto)}</span>
                                        </div>
                                    </div>

                                    {/* Cambio de Estado */}
                                    <div className="col-span-3 flex items-center justify-center gap-3 mb-4 md:mb-0">
                                        {getStatusBadge(notif.estadoAnterior)}
                                        <ArrowRight className="w-3 h-3 text-slate-300" />
                                        {getStatusBadge(notif.estadoNuevo)}
                                    </div>

                                    {/* Fecha */}
                                    <div className="col-span-1 text-center mb-4 md:mb-0">
                                        <p className="text-[10px] font-semibold text-slate-500 whitespace-pre-line leading-tight">
                                            {formatDate(notif.fecha).replace(" ", "\n")}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 flex items-center justify-end gap-2">
                                        {notif.estado === 'NO_LEIDO' && (
                                            <button
                                                onClick={() => markAsRead(notif.id)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Marcar como leído"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteNotification(notif.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        // Empty State Match
                        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 dark:bg-slate-800">
                                <Bell className="w-6 h-6 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1 dark:text-white">Sin Notificaciones</h3>
                            <p className="text-sm text-slate-500 max-w-sm mx-auto dark:text-slate-400">
                                Te avisaremos cuando haya cambios importantes en tus licitaciones seguidas o procesos relevantes.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
