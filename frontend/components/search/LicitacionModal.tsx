import React, { useState, useEffect } from 'react';
import { X, Trophy, FileText, Calendar, Building2, MapPin, DollarSign, Plus, Trash2, AlertCircle } from 'lucide-react';
import type { Licitacion } from '@/types/licitacion';

interface LicitacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    licitacion?: Licitacion | null;
    onSave: (data: any) => void;
}

export default function LicitacionModal({ isOpen, onClose, licitacion, onSave }: LicitacionModalProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'adjudicaciones'>('general');
    const [formData, setFormData] = useState<Partial<Licitacion> & { adjudicaciones?: any[] }>({});

    // Reset form when modal opens or licitacion changes
    useEffect(() => {
        if (isOpen) {
            setFormData(licitacion ? { ...licitacion, adjudicaciones: [] } : {
                descripcion: '',
                comprador: '',
                nomenclatura: '',
                estado_proceso: 'CONVOCADO', // Default per screenshot
                categoria: 'BIENES',
                moneda: 'PEN',
                monto_estimado: 0,
                adjudicaciones: [] // Start empty for new, could populate for edit
            });
            setActiveTab('general');
        }
    }, [isOpen, licitacion]);

    const addAdjudicacion = () => {
        setFormData({
            ...formData,
            adjudicaciones: [
                ...(formData.adjudicaciones || []),
                { id: Date.now(), ganador_nombre: '', ganador_ruc: '', monto_adjudicado: 0, estado_item: 'ADJUDICADO' }
            ]
        });
    };

    const removeAdjudicacion = (index: number) => {
        const newAdj = [...(formData.adjudicaciones || [])];
        newAdj.splice(index, 1);
        setFormData({ ...formData, adjudicaciones: newAdj });
    };

    const addConsorcioMember = (adjIndex: number) => {
        const newAdj = [...(formData.adjudicaciones || [])];
        if (!newAdj[adjIndex].consorcios) {
            newAdj[adjIndex].consorcios = [];
        }
        newAdj[adjIndex].consorcios.push({ id: Date.now(), nombre: '', ruc: '', porcentaje: 0 });
        setFormData({ ...formData, adjudicaciones: newAdj });
    };

    const removeConsorcioMember = (adjIndex: number, memberIndex: number) => {
        const newAdj = [...(formData.adjudicaciones || [])];
        if (newAdj[adjIndex].consorcios) {
            newAdj[adjIndex].consorcios.splice(memberIndex, 1);
            setFormData({ ...formData, adjudicaciones: newAdj });
        }
    };

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#111c44] rounded-2xl w-full max-w-4xl shadow-2xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                            {licitacion ? 'Editar Licitación' : 'Nueva Licitación'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {licitacion ? 'Modifique los detalles y adjudicaciones.' : 'Complete la información para registrar una nueva licitación.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b border-slate-100 dark:border-white/10">
                    <button
                        onClick={() => setActiveTab('general')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'general'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                    >
                        <FileText size={16} />
                        Información General
                    </button>
                    <button
                        onClick={() => setActiveTab('adjudicaciones')}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'adjudicaciones'
                            ? 'border-[#2563EB] text-[#2563EB]'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                    >
                        <Trophy size={16} />
                        Adjudicaciones y Consorcios
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">

                    {/* ===== GENERAL INFO TAB ===== */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Descripción *</label>
                                <textarea
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none h-24 placeholder:text-slate-400"
                                    value={formData.descripcion || ''}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    placeholder="Ej: SERVICIO DE MANTENIMIENTO DE CARRETERAS..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Comprador *</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400"
                                        value={formData.comprador || ''}
                                        onChange={(e) => setFormData({ ...formData, comprador: e.target.value })}
                                        placeholder="Ej: MUNICIPALIDAD DISTRITAL DE..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Nomenclatura</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400"
                                        value={formData.nomenclatura || ''}
                                        onChange={(e) => setFormData({ ...formData, nomenclatura: e.target.value })}
                                        placeholder="Ej: LP-SM-2024-001"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">OCID</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400"
                                        value={formData.ocid || ''}
                                        onChange={(e) => setFormData({ ...formData, ocid: e.target.value })}
                                        placeholder="Ej: ocds-2024-..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Departamento *</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400"
                                        value={formData.departamento || ''}
                                        onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                                        placeholder="Ej: LIMA"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Provincia</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400"
                                            value={formData.provincia || ''}
                                            onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                                            placeholder="Ej: LIMA"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Distrito</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400"
                                            value={formData.distrito || ''}
                                            onChange={(e) => setFormData({ ...formData, distrito: e.target.value })}
                                            placeholder="Ej: MIRAFLORES"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tipo Procedimiento</label>
                                    <div className="relative">
                                        <select
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                            value={formData.tipo_procedimiento || ''}
                                            onChange={(e) => setFormData({ ...formData, tipo_procedimiento: e.target.value })}
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option value="Licitacion Publica">Licitación Pública</option>
                                            <option value="Adjudicacion Simplificada">Adjudicación Simplificada</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Estado Proceso *</label>
                                    <select
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                        value={formData.estado_proceso || 'CONVOCADO'}
                                        onChange={(e) => setFormData({ ...formData, estado_proceso: e.target.value })}
                                    >
                                        <option value="CONVOCADO">CONVOCADO</option>
                                        <option value="ADJUDICADO">ADJUDICADO</option>
                                        <option value="CONTRATADO">CONTRATADO</option>
                                        <option value="NULO">NULO</option>
                                        <option value="DESIERTO">DESIERTO</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Categoría *</label>
                                    <select
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                        value={formData.categoria || 'BIENES'}
                                        onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                    >
                                        <option value="BIENES">BIENES</option>
                                        <option value="SERVICIOS">SERVICIOS</option>
                                        <option value="OBRAS">OBRAS</option>
                                        <option value="CONSULTORIA DE OBRAS">CONSULTORÍA DE OBRAS</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Monto Estimado</label>
                                    <div className="flex gap-2">
                                        <select
                                            className="w-24 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            value={formData.moneda || 'PEN'}
                                            onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}
                                        >
                                            <option value="PEN">PEN</option>
                                            <option value="USD">USD</option>
                                        </select>
                                        <input
                                            type="number"
                                            className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            value={formData.monto_estimado || 0}
                                            onChange={(e) => setFormData({ ...formData, monto_estimado: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Publicación</label>
                                        <input
                                            type="date"
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            value={formData.fecha_publicacion?.split('T')[0] || ''}
                                            onChange={(e) => setFormData({ ...formData, fecha_publicacion: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Adjudicación (Est.)</label>
                                        <input
                                            type="date"
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                            value={formData.fecha_adjudicacion?.split('T')[0] || ''}
                                            onChange={(e) => setFormData({ ...formData, fecha_adjudicacion: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ===== ADJUDICACIONES TAB ===== */}
                    {activeTab === 'adjudicaciones' && (
                        <div className="space-y-6">

                            {/* Empty State or List */}
                            {(formData.adjudicaciones || []).map((adj: any, index: number) => (
                                <div key={index} className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 space-y-4 relative animate-in fade-in slide-in-from-top-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                                            <Trophy size={16} className="text-yellow-500" />
                                            Adjudicación #{index + 1}
                                        </h3>
                                        <button
                                            onClick={() => removeAdjudicacion(index)}
                                            className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1"
                                        >
                                            <Trash2 size={12} /> Eliminar Item
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Ganador</label>
                                            <input
                                                placeholder="Ej: CONSTRUCTORA DEL SUR S.A.C."
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={adj.ganador_nombre}
                                                onChange={(e) => {
                                                    const newAdj = [...(formData.adjudicaciones || [])];
                                                    newAdj[index].ganador_nombre = e.target.value;
                                                    setFormData({ ...formData, adjudicaciones: newAdj });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">RUC</label>
                                            <input
                                                placeholder="Ej: 20601234567"
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={adj.ganador_ruc}
                                                onChange={(e) => {
                                                    const newAdj = [...(formData.adjudicaciones || [])];
                                                    newAdj[index].ganador_ruc = e.target.value;
                                                    setFormData({ ...formData, adjudicaciones: newAdj });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Monto Adjudicado</label>
                                            <input
                                                type="number"
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={adj.monto_adjudicado}
                                                onChange={(e) => {
                                                    const newAdj = [...(formData.adjudicaciones || [])];
                                                    newAdj[index].monto_adjudicado = Number(e.target.value);
                                                    setFormData({ ...formData, adjudicaciones: newAdj });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Estado Item</label>
                                            <select
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={adj.estado_item}
                                                onChange={(e) => {
                                                    const newAdj = [...(formData.adjudicaciones || [])];
                                                    newAdj[index].estado_item = e.target.value;
                                                    setFormData({ ...formData, adjudicaciones: newAdj });
                                                }}
                                            >
                                                <option value="ADJUDICADO">ADJUDICADO</option>
                                                <option value="CONTRATADO">CONTRATADO</option>
                                                <option value="PENDIENTE">PENDIENTE</option>
                                            </select>
                                        </div>

                                        {/* Additional Date Fields matching design screenshot */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Fecha Adjudicación (Item)</label>
                                            <input
                                                type="date"
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={adj.fecha_adjudicacion?.split('T')[0] || ''}
                                                onChange={(e) => {
                                                    const newAdj = [...(formData.adjudicaciones || [])];
                                                    newAdj[index].fecha_adjudicacion = e.target.value;
                                                    setFormData({ ...formData, adjudicaciones: newAdj });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Tipo Garantía</label>
                                            <select
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                                                value={adj.tipo_garantia}
                                                onChange={(e) => {
                                                    const newAdj = [...(formData.adjudicaciones || [])];
                                                    newAdj[index].tipo_garantia = e.target.value;
                                                    setFormData({ ...formData, adjudicaciones: newAdj });
                                                }}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="CARTA_FIANZA">Carta Fianza</option>
                                                <option value="POLIZA_CAUCION">Póliza de Caución</option>
                                                <option value="DEPOSITO_PLAZO">Depósito a Plazo</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">ID Contrato (Opcional)</label>
                                            <input
                                                placeholder="Ej: CTR-001-2024"
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={adj.id_contrato}
                                                onChange={(e) => {
                                                    const newAdj = [...(formData.adjudicaciones || [])];
                                                    newAdj[index].id_contrato = e.target.value;
                                                    setFormData({ ...formData, adjudicaciones: newAdj });
                                                }}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase">Garantía / Banco</label>
                                            <input
                                                placeholder="Ej: BCP"
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                                value={adj.entidad_financiera}
                                                onChange={(e) => {
                                                    const newAdj = [...(formData.adjudicaciones || [])];
                                                    newAdj[index].entidad_financiera = e.target.value;
                                                    setFormData({ ...formData, adjudicaciones: newAdj });
                                                }}
                                            />
                                        </div>

                                    </div>

                                    {/* Placeholder for Consorcios */}
                                    <div className="pt-4 border-t border-slate-100 dark:border-white/5 mt-2">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Miembros del Consorcio (Si aplica)</label>
                                        {(adj.consorcios || []).map((member: any, memberIndex: number) => (
                                            <div key={member.id} className="flex gap-2 items-center mb-2">
                                                <input
                                                    placeholder="Nombre Completo del Socio"
                                                    className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={member.nombre}
                                                    onChange={(e) => {
                                                        const newAdj = [...(formData.adjudicaciones || [])];
                                                        newAdj[index].consorcios[memberIndex].nombre = e.target.value;
                                                        setFormData({ ...formData, adjudicaciones: newAdj });
                                                    }}
                                                />
                                                <input
                                                    placeholder="RUC"
                                                    className="w-32 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                                                    value={member.ruc}
                                                    onChange={(e) => {
                                                        const newAdj = [...(formData.adjudicaciones || [])];
                                                        newAdj[index].consorcios[memberIndex].ruc = e.target.value;
                                                        setFormData({ ...formData, adjudicaciones: newAdj });
                                                    }}
                                                />
                                                <input
                                                    placeholder="%"
                                                    className="w-16 p-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-center"
                                                    value={member.porcentaje}
                                                    onChange={(e) => {
                                                        const newAdj = [...(formData.adjudicaciones || [])];
                                                        newAdj[index].consorcios[memberIndex].porcentaje = Number(e.target.value);
                                                        setFormData({ ...formData, adjudicaciones: newAdj });
                                                    }}
                                                />
                                                <button
                                                    onClick={() => removeConsorcioMember(index, memberIndex)}
                                                    className="text-slate-400 hover:text-red-500"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <div className="pt-2 flex justify-end">
                                            <button
                                                onClick={() => addConsorcioMember(index)}
                                                className="text-xs font-bold text-blue-600 flex items-center gap-1"
                                            >
                                                <Plus size={12} /> Agregar Miembro
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={addAdjudicacion}
                                className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 font-bold text-sm hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={16} />
                                Agregar Adjudicación
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/20">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-white/10 transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 rounded-xl font-bold text-white bg-[#2563EB] hover:bg-[#1d4ed8] shadow-lg shadow-blue-500/30 transition-all text-sm"
                    >
                        Guardar Licitación
                    </button>
                </div>
            </div>
        </div>
    );
}
