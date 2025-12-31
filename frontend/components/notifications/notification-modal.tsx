'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, Bell, CheckCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/use-notifications';
import { useRouter } from 'next/navigation';

export function NotificationModal({
    open,
    onOpenChange
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const router = useRouter();
    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification
    } = useNotifications(30);

    const handleNotificationClick = async (notification: any) => {
        if (!notification.is_read) {
            await markAsRead(notification.id);
        }
        if (notification.link) {
            onOpenChange(false);
            router.push(notification.link);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'licitacion': return '📋';
            case 'carta_fianza': return '💳';
            case 'adjudicacion': return '🏆';
            default: return '📢';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-50 text-red-600 border-red-100';
            case 'medium': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            default: return 'bg-blue-50 text-blue-600 border-blue-100';
        }
    };

    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

                <DialogPrimitive.Content className={cn(
                    "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-100 bg-white shadow-2xl duration-200",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "rounded-[1.5rem] overflow-hidden max-h-[80vh] flex flex-col p-0"
                )}>
                    {/* Header */}
                    <div className="p-6 pb-4 border-b bg-gradient-to-r from-[#0F2C4A] to-[#163A5F] text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/10 rounded-lg">
                                    <Bell className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <DialogPrimitive.Title className="text-lg font-bold">Notificaciones</DialogPrimitive.Title>
                                    <DialogPrimitive.Description className="text-xs text-blue-100 opacity-80">
                                        {unreadCount > 0 ? `${unreadCount} nuevas alertas` : 'No hay nuevas alertas'}
                                    </DialogPrimitive.Description>
                                </div>
                            </div>
                            <DialogPrimitive.Close className="rounded-full p-2 hover:bg-white/10 transition-colors">
                                <X className="w-5 h-5 text-white" />
                            </DialogPrimitive.Close>
                        </div>
                    </div>

                    {/* Toolbar */}
                    {unreadCount > 0 && (
                        <div className="px-4 py-2 bg-gray-50 border-b flex justify-end">
                            <button
                                onClick={() => markAllAsRead()}
                                className="text-xs flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 rounded-full hover:bg-blue-50 transition-colors"
                            >
                                <CheckCircle className="w-3.5 h-3.5" />
                                Marcar todas leídas
                            </button>
                        </div>
                    )}

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-0 scrollbar-thin">
                        {loading && notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                                <p className="text-sm">Cargando...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-400 text-center px-6">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    <Bell className="w-8 h-8 text-gray-300" />
                                </div>
                                <p className="font-medium text-gray-900">Sin notificaciones</p>
                                <p className="text-sm mt-1">Estás al día con todas tus alertas.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={cn(
                                            "p-4 hover:bg-gray-50 transition-colors cursor-pointer group relative",
                                            !notification.is_read && "bg-blue-50/40 hover:bg-blue-50/70"
                                        )}
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0 text-2xl pt-1">
                                                {getTypeIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-6">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className={cn("text-sm font-semibold", !notification.is_read ? "text-gray-900" : "text-gray-600")}>
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                        {new Date(notification.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>

                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium", getPriorityColor(notification.priority))}>
                                                        {notification.priority === 'high' ? 'Alta' : notification.priority === 'medium' ? 'Media' : 'Baja'}
                                                    </span>
                                                    {!notification.is_read && (
                                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t bg-white">
                        <Button
                            variant="outline"
                            className="w-full rounded-xl"
                            onClick={() => onOpenChange(false)}
                        >
                            Cerrar
                        </Button>
                    </div>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
