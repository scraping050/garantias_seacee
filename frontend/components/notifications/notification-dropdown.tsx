'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications, Notification } from '@/hooks/use-notifications';
import { useNotificationWebSocket } from '@/hooks/use-notification-websocket';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Hook de notificaciones con polling
    const {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
    } = useNotifications(30); // Poll every 30 seconds

    // Hook de WebSocket para tiempo real
    useNotificationWebSocket();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification: Notification) => {
        try {
            // Marcar como leída
            if (!notification.is_read) {
                await markAsRead(notification.id);
            }

            // Navegar si hay link
            if (notification.link) {
                setIsOpen(false);
                router.push(notification.link);
            }
        } catch (error) {
            console.error('Error handling notification click:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'medium':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return '🔴';
            case 'medium':
                return '🟡';
            case 'low':
                return '🔵';
            default:
                return '⚪';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'licitacion':
                return '📋';
            case 'carta_fianza':
                return '💳';
            case 'adjudicacion':
                return '🏆';
            case 'consorcio':
                return '🤝';
            case 'reporte':
                return '📊';
            case 'sistema':
                return '⚙️';
            default:
                return '📢';
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins}m`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;

        return date.toLocaleDateString('es-PE');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon with Badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="Notificaciones"
            >
                <i className="fas fa-bell text-lg"></i>

                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col animate-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="p-4 border-b bg-gradient-to-r from-[#0F2C4A] to-[#163A5F] text-white rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">Notificaciones</h3>
                                <p className="text-xs text-white/80">
                                    {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
                                </p>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                                >
                                    Marcar todas
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="flex-1 overflow-y-auto scrollable-container">
                        {loading && notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <i className="fas fa-circle-notch fa-spin text-2xl mb-2"></i>
                                <p className="text-sm">Cargando notificaciones...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <i className="fas fa-bell-slash text-4xl mb-3 text-gray-300"></i>
                                <p className="font-medium">No hay notificaciones</p>
                                <p className="text-xs mt-1">Estás al día 😊</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {notifications.map((notification) => {
                                    // Custom rendering for State Change
                                    const isStateChange = notification.message.startsWith("Estado cambiado:");
                                    let oldState = "";
                                    let newState = "";

                                    if (isStateChange) {
                                        const parts = notification.message.replace("Estado cambiado:", "").split("->");
                                        if (parts.length === 2) {
                                            oldState = parts[0].trim();
                                            newState = parts[1].trim();
                                        }
                                    }

                                    return (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50/30' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                {/* Icon/Dot */}
                                                <div className="flex-shrink-0 mt-1">
                                                    {!notification.is_read ? (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                                                    ) : (
                                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                                                            {notification.title}
                                                        </h4>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(notification.id);
                                                            }}
                                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap"
                                                        >
                                                            Marcar
                                                        </button>
                                                    </div>

                                                    {/* Message / State Change Design */}
                                                    {isStateChange && oldState && newState ? (
                                                        <div className="text-xs mb-2">
                                                            <span className="text-gray-500 font-medium">{oldState}</span>
                                                            <span className="mx-2 text-gray-400">→</span>
                                                            <span className="text-red-500 font-bold">{newState}</span>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-[10px] text-gray-400">
                                                            {formatTimeAgo(notification.created_at)}
                                                        </span>
                                                        <button
                                                            onClick={() => handleNotificationClick(notification)}
                                                            className="text-xs text-blue-600 font-bold hover:underline"
                                                        >
                                                            Ver
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t bg-gray-50 rounded-b-xl">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push('/settings/notifications');
                                }}
                                className="w-full text-sm text-[#0F2C4A] hover:text-[#163A5F] font-medium transition-colors"
                            >
                                Ver todas las notificaciones →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
