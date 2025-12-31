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

function FolderItem({ icon, label, count, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${active
                ? 'bg-[#0F2C4A] dark:bg-cyan-600 text-white shadow-md shadow-blue-900/20'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-[#0F2C4A] dark:hover:text-white'
                }`}
        >
            <div className="flex items-center gap-3">
                <i className={`fas ${icon} ${active ? 'text-blue-300 dark:text-cyan-200' : 'text-gray-400 dark:text-gray-500 group-hover:text-[#0F2C4A] dark:group-hover:text-white'}`}></i>
                <span className="text-sm font-medium">{label}</span>
            </div>
            {count > 0 && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${active ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-[#0F2C4A]/10 dark:group-hover:bg-white/10'
                    }`}>
                    {count}
                </span>
            )}
        </button>
    );
}

function LabelItem({ color, label, count }: any) {
    const colorClasses: any = {
        red: 'bg-red-500 shadow-red-500/30',
        blue: 'bg-blue-500 shadow-blue-500/30',
        green: 'bg-green-500 shadow-green-500/30',
        purple: 'bg-purple-500 shadow-purple-500/30'
    };

    return (
        <div className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl cursor-pointer group transition-colors">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full shadow-sm ${colorClasses[color]} group-hover:scale-110 transition-transform`}></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{label}</span>
            </div>
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-600 group-hover:border-gray-200 dark:group-hover:border-gray-500 transition-colors">{count}</span>
        </div>
    );
}

function EmailItem({ from, subject, preview, time, unread, important }: any) {
    return (
        <div className={`p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors border-l-4 group relative ${unread ? 'bg-blue-50/20 dark:bg-blue-900/10 border-blue-500 dark:border-blue-400' : 'border-transparent'
            }`}>
            <div className="flex items-start gap-4">
                <div className="flex flex-col gap-3 pt-1">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-[#0F2C4A] dark:text-cyan-500 focus:ring-[#0F2C4A] dark:focus:ring-cyan-500 dark:bg-gray-700" />
                    <button className="text-gray-300 dark:text-gray-600 hover:text-yellow-400 transition-colors">
                        <i className={`${important ? 'fas text-yellow-500' : 'far'} fa-star`}></i>
                    </button>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm tracking-tight ${unread ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                            {from}
                        </p>
                        <span className={`text-xs ${unread ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-400 dark:text-gray-500'}`}>{time}</span>
                    </div>
                    <p className={`text-sm mb-1 line-clamp-1 ${unread ? 'font-bold text-[#0F2C4A] dark:text-cyan-400' : 'text-gray-800 dark:text-gray-200'}`}>
                        {subject}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate font-light">{preview}</p>
                </div>
            </div>
            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-full text-gray-400 hover:text-red-500 shadow-sm transition-all" title="Eliminar"><i className="fas fa-trash-alt"></i></button>
                <button className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-full text-gray-400 hover:text-[#0F2C4A] dark:hover:text-cyan-400 shadow-sm transition-all" title="Archivar"><i className="fas fa-archive"></i></button>
            </div>
        </div>
    );
}

export default function CorreoAdminPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFolder, setSelectedFolder] = useState('inbox');

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Premium */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50/50 dark:bg-cyan-900/20 rounded-full -mr-16 -mt-16 pointer-events-none blur-3xl"></div>

                <div className="relative z-10">
                    <h1 className="text-4xl font-extrabold text-[#0F2C4A] dark:text-white tracking-tight">
                        Correo <span className="text-cyan-600 dark:text-cyan-400">Admin</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-3 text-lg">Central de comunicaciones administrativas</p>
                </div>

                <div className="relative z-10">
                    <button className="bg-[#0F2C4A] dark:bg-cyan-600 text-white px-6 py-3 rounded-xl hover:bg-[#163A5F] dark:hover:bg-cyan-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 flex items-center gap-3 font-semibold group">
                        <div className="bg-white/10 p-1 rounded-lg group-hover:bg-white/20 transition-colors">
                            <i className="fas fa-plus text-sm"></i>
                        </div>
                        Redactar Nuevo
                    </button>
                </div>
            </div>

            {/* Stats Cards Premium */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard
                    icon="fa-inbox"
                    title="Recibidos"
                    value="456"
                    color="text-blue-600 dark:text-blue-400"
                    bgColor="bg-blue-50 dark:bg-blue-900/30"
                    borderColor="border-blue-100 dark:border-blue-900/50"
                />
                <StatCard
                    icon="fa-paper-plane"
                    title="Enviados"
                    value="289"
                    color="text-green-600 dark:text-green-400"
                    bgColor="bg-green-50 dark:bg-green-900/30"
                    borderColor="border-green-100 dark:border-green-900/50"
                />
                <StatCard
                    icon="fa-envelope"
                    title="Sin Leer"
                    value="34"
                    color="text-orange-600 dark:text-orange-400"
                    bgColor="bg-orange-50 dark:bg-orange-900/30"
                    borderColor="border-orange-100 dark:border-orange-900/50"
                />
                <StatCard
                    icon="fa-star"
                    title="Importantes"
                    value="18"
                    color="text-yellow-600 dark:text-yellow-400"
                    bgColor="bg-yellow-50 dark:bg-yellow-900/30"
                    borderColor="border-yellow-100 dark:border-yellow-900/50"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
                {/* Folders Sidebar Premium */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 border border-gray-100 dark:border-gray-700">
                        <button className="w-full bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-4 py-3 rounded-xl font-bold hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors flex items-center justify-center gap-2 mb-6">
                            <i className="fas fa-filter"></i>
                            Filtrar Mensajes
                        </button>

                        <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-2">Carpetas</h3>
                        <div className="space-y-1">
                            <FolderItem
                                icon="fa-inbox"
                                label="Bandeja de Entrada"
                                count={34}
                                active={selectedFolder === 'inbox'}
                                onClick={() => setSelectedFolder('inbox')}
                            />
                            <FolderItem
                                icon="fa-paper-plane"
                                label="Enviados"
                                count={0}
                                active={selectedFolder === 'sent'}
                                onClick={() => setSelectedFolder('sent')}
                            />
                            <FolderItem
                                icon="fa-star"
                                label="Importantes"
                                count={18}
                                active={selectedFolder === 'starred'}
                                onClick={() => setSelectedFolder('starred')}
                            />
                            <FolderItem
                                icon="fa-file-alt"
                                label="Borradores"
                                count={5}
                                active={selectedFolder === 'drafts'}
                                onClick={() => setSelectedFolder('drafts')}
                            />
                            <FolderItem
                                icon="fa-trash"
                                label="Papelera"
                                count={12}
                                active={selectedFolder === 'trash'}
                                onClick={() => setSelectedFolder('trash')}
                            />
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-2">Etiquetas</h3>
                            <div className="space-y-1">
                                <LabelItem color="red" label="Urgente" count={8} />
                                <LabelItem color="blue" label="Clientes" count={23} />
                                <LabelItem color="green" label="Proveedores" count={15} />
                                <LabelItem color="purple" label="Interno" count={42} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email List Premium */}
                <div className="md:col-span-3">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">
                        {/* Toolbar */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 flex flex-col sm:flex-row gap-4 justify-between items-center sticky top-0 z-10 backdrop-blur-sm">
                            <div className="relative w-full sm:max-w-md group">
                                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                                <input
                                    type="text"
                                    placeholder="Buscar en correos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900/30 focus:border-cyan-400 text-gray-900 dark:text-white transition-all bg-white dark:bg-gray-900 text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-[#0F2C4A] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" title="Actualizar">
                                    <i className="fas fa-sync-alt"></i>
                                </button>
                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">1-20 de 456</span>
                                <div className="flex gap-1">
                                    <button className="p-2 text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50" disabled><i className="fas fa-chevron-left"></i></button>
                                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-[#0F2C4A] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><i className="fas fa-chevron-right"></i></button>
                                </div>
                            </div>
                        </div>

                        {/* List */}
                        <div className="divide-y divide-gray-50 dark:divide-gray-700 overflow-y-auto">
                            <EmailItem
                                from="cliente@empresa.com"
                                subject="Consulta sobre renovación de garantía bancaria"
                                preview="Buenos días, quisiera consultar sobre el proceso de renovación de la fianza vencida..."
                                time="10:30 AM"
                                unread={true}
                                important={true}
                            />
                            <EmailItem
                                from="proveedor@seguros.com"
                                subject="Actualización de póliza - Prima vencida"
                                preview="Le informamos que la prima correspondiente al mes de Diciembre ha vencido. Por favor..."
                                time="09:15 AM"
                                unread={true}
                                important={false}
                            />
                            <EmailItem
                                from="banco@bcp.com.pe"
                                subject="Confirmación de emisión de cheque"
                                preview="Se ha procesado exitosamente la emisión del cheque N° 45892 solicitado el día..."
                                time="Ayer"
                                unread={false}
                                important={false}
                            />
                            <EmailItem
                                from="admin@mqs.com"
                                subject="Reporte mensual de operaciones"
                                preview="Adjunto encontrará el reporte mensual con el detalle de todas las operaciones de..."
                                time="Ayer"
                                unread={false}
                                important={true}
                            />
                            <EmailItem
                                from="soporte@sistema.com"
                                subject="Mantenimiento programado de la plataforma"
                                preview="Le informamos que se realizará un mantenimiento de los servidores el día..."
                                time="Lunes"
                                unread={false}
                                important={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
