'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications, Notification } from '@/hooks/use-notifications';
import { Bell, Filter, Trash2, Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';

export default function AlertasPage() {
    const router = useRouter();
    const [filterType, setFilterType] = useState<string>('all');
    const [filterPriority, setFilterPriority] = useState<string>('all');
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification
    } = useNotifications(30);

    // Filtrar notificaciones
    const filteredNotifications = notifications.filter(notif => {
        if (showUnreadOnly && notif.is_read) return false;
        if (filterType !== 'all' && notif.type !== filterType) return false;
        if (filterPriority !== 'all' && notif.priority !== filterPriority) return false;
        return true;
    });

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
        }
        if (notification.link) {
            router.push(notification.link);
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('¿Eliminar esta notificación?')) {
            await deleteNotification(id);
        }
    };

    const getPriorityBadge = (priority: string) => {
        const styles = {
            high: 'bg-red-100 text-red-800 border-red-300',
            medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            low: 'bg-blue-100 text-blue-800 border-blue-300'
        };
        const labels = { high: 'Alta', medium: 'Media', low: 'Baja' };
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${styles[priority as keyof typeof styles]}`}>
                {labels[priority as keyof typeof labels] || priority}
            </span>
        );
    };

    const getTypeIcon = (type: string) => {
        const icons: Record<string, string> = {
            licitacion: '📋',
            carta_fianza: '💳',
            adjudicacion: '🏆',
            consorcio: '🤝',
            reporte: '📊',
            sistema: '⚙️'
        };
        return icons[type] || '📢';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b122b] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <Bell className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            Centro de Alertas
                        </h1>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">
                        Gestiona tus notificaciones y alertas del sistema
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-[#111c44] rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{notifications.length}</p>
                            </div>
                            <Bell className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111c44] rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Sin Leer</p>
                                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111c44] rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Leídas</p>
                                <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
                            </div>
                            <CheckCheck className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#111c44] rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Filtradas</p>
                                <p className="text-2xl font-bold text-blue-600">{filteredNotifications.length}</p>
                            </div>
                            <Filter className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="bg-white dark:bg-[#111c44] rounded-xl p-4 mb-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-3">
                            {/* Filter by Type */}
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0b122b] text-slate-900 dark:text-white"
                            >
                                <option value="all">Todos los tipos</option>
                                <option value="licitacion">Licitación</option>
                                <option value="carta_fianza">Carta Fianza</option>
                                <option value="adjudicacion">Adjudicación</option>
                                <option value="consorcio">Consorcio</option>
                                <option value="reporte">Reporte</option>
                                <option value="sistema">Sistema</option>
                            </select>

                            {/* Filter by Priority */}
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0b122b] text-slate-900 dark:text-white"
                            >
                                <option value="all">Todas las prioridades</option>
                                <option value="high">Alta</option>
                                <option value="medium">Media</option>
                                <option value="low">Baja</option>
                            </select>

                            {/* Unread Only Toggle */}
                            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0b122b] cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showUnreadOnly}
                                    onChange={(e) => setShowUnreadOnly(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-slate-900 dark:text-white">Solo no leídas</span>
                            </label>
                        </div>

                        {/* Actions */}
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <CheckCheck className="w-4 h-4" />
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>
                </div>

                {/* Notifications List */}
                <div className="bg-white dark:bg-[#111c44] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {loading && notifications.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p>Cargando notificaciones...</p>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <Bell className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                            <p className="text-lg font-medium">No hay notificaciones</p>
                            <p className="text-sm mt-2">
                                {showUnreadOnly ? 'No tienes notificaciones sin leer' : 'Estás al día 😊'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        {/* Icon */}
                                        <div className="flex-shrink-0 text-xl sm:text-2xl lg:text-3xl">
                                            {getTypeIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className={`font-semibold text-lg ${!notification.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    {notification.title}
                                                </h3>
                                                {getPriorityBadge(notification.priority)}
                                            </div>

                                            <p className="text-slate-600 dark:text-slate-400 mb-3">
                                                {notification.message}
                                            </p>

                                            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {formatDate(notification.created_at)}
                                                </span>
                                                <span className="capitalize">
                                                    {notification.type.replace('_', ' ')}
                                                </span>
                                                {!notification.is_read && (
                                                    <span className="flex items-center gap-1 text-blue-600 font-medium">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        No leída
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex-shrink-0 flex gap-2">
                                            {!notification.is_read && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        markAsRead(notification.id);
                                                    }}
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="Marcar como leída"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handleDelete(notification.id, e)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
