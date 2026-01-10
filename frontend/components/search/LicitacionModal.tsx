import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Trophy, FileText, Calendar, Building2, MapPin, DollarSign, Plus, Trash2, AlertCircle } from 'lucide-react';
import type { Licitacion } from '@/types/licitacion';

interface LicitacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    licitacion?: Licitacion | null;
    onSave: (data: any) => void;
    estadosOptions?: string[];
    tipoGarantiaOptions?: string[];
    aseguradorasOptions?: string[];
    departamentosOptions?: string[];
}

export default function LicitacionModal({
    isOpen,
    onClose,
    licitacion,
    onSave,
    estadosOptions = [],
    tipoGarantiaOptions = [],
    aseguradorasOptions = [],
    departamentosOptions = []
}: LicitacionModalProps) {
    const [activeTab, setActiveTab] = useState<'general' | 'adjudicaciones'>('general');
    const [formData, setFormData] = useState<Partial<Licitacion> & { adjudicaciones?: any[] }>({});
    const [isMounted, setIsMounted] = useState(false);

    // Cascading location options
    const [provinciaOptions, setProvinciaOptions] = useState<string[]>([]);
    const [distritoOptions, setDistritoOptions] = useState<string[]>([]);

    // Ensure we're on the client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Cascading: Load Provincias when Departamento changes
    useEffect(() => {
        const fetchProvincias = async () => {
            setFormData(prev => ({ ...prev, provincia: '', distrito: '' }));
            setProvinciaOptions([]);
            setDistritoOptions([]);

            if (formData.departamento && formData.departamento.trim() !== '') {
                try {
                    const { licitacionService } = await import('@/lib/services/licitacionService');
                    const data = await licitacionService.getLocations(formData.departamento);
                    setProvinciaOptions(data.provincias || []);
                } catch (error) {
                    console.error("Error loading provincias:", error);
                }
            }
        };
        fetchProvincias();
    }, [formData.departamento]);

    // Cascading: Load Distritos when Provincia changes
    useEffect(() => {
        const fetchDistritos = async () => {
            setFormData(prev => ({ ...prev, distrito: '' }));
            setDistritoOptions([]);

            if (formData.provincia && formData.provincia.trim() !== '' && formData.departamento && formData.departamento.trim() !== '') {
                try {
                    const { licitacionService } = await import('@/lib/services/licitacionService');
                    const data = await licitacionService.getLocations(formData.departamento, formData.provincia);
                    setDistritoOptions(data.distritos || []);
                } catch (error) {
                    console.error("Error loading distritos:", error);
                }
            }
        };
        fetchDistritos();
    }, [formData.provincia, formData.departamento]);

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

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

    if (!isOpen || !isMounted) return null;

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    // Render modal using Portal to avoid parent transform issues
    return createPortal(
        <div className="fixed inset-0 z-[99999] overflow-y-auto">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 transition-opacity" onClick={onClose} aria-hidden="true" />

            {/* Modal Container - Optimized for production with better responsiveness */}
            <div className="flex min-h-full items-center justify-center p-2 sm:p-4 md:p-6">
                <div className="bg-white dark:bg-[#111c44] rounded-xl w-full max-w-[95vw] sm:max-w-4xl lg:max-w-5xl border border-slate-300 dark:border-slate-600 flex flex-col max-h-[90vh] sm:max-h-[85vh] relative z-10 shadow-2xl overflow-hidden">

                    {/* Header - Responsive */}
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                        <div>
                            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                                {licitacion ? 'Editar Licitación' : 'Nueva Licitación'}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                                {licitacion ? 'Modifique los detalles y adjudicaciones.' : 'Complete la información.'}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full text-slate-400 transition-colors flex-shrink-0">
                            <X size={20} className="sm:w-6 sm:h-6" />
                        </button>
                    </div>

                    {/* Tabs - Responsive with horizontal scroll */}
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex px-4 sm:px-6 border-b border-slate-100 dark:border-white/10 min-w-max sm:min-w-0">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'general'
                                    ? 'border-[#2563EB] text-[#2563EB]'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                    }`}
                            >
                                <FileText size={14} className="sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Información General</span>
                                <span className="sm:hidden">General</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('adjudicaciones')}
                                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'adjudicaciones'
                                    ? 'border-[#2563EB] text-[#2563EB]'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                    }`}
                            >
                                <Trophy size={14} className="sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Adjudicaciones y Consorcios</span>
                                <span className="sm:hidden">Adjudicaciones</span>
                            </button>
                        </div>
                    </div>

                    {/* Content - Scrollable with proper padding */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6">


                        {/* ===== GENERAL INFO TAB ===== */}
                        {activeTab === 'general' && (
                            <div className="space-y-8 animate-in fade-in duration-300">

                                {/* SECTION 1: IDENTIFICACIÓN */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
                                        <Building2 className="w-4 h-4 text-indigo-500" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Identificación del Proceso</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                        <div className="md:col-span-8 space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">Comprador / Entidad *</label>
                                            <input
                                                type="text"
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                                                value={formData.comprador || ''}
                                                onChange={(e) => setFormData({ ...formData, comprador: e.target.value })}
                                                placeholder="Ej: MUNICIPALIDAD DISTRITAL DE..."
                                            />
                                        </div>
                                        <div className="md:col-span-4 space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">Nomenclatura</label>
                                            <input
                                                type="text"
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300"
                                                value={formData.nomenclatura || ''}
                                                onChange={(e) => setFormData({ ...formData, nomenclatura: e.target.value })}
                                                placeholder="Ej: LP-SM-2024-001"
                                            />
                                        </div>

                                        <div className="md:col-span-12 space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">Descripción *</label>
                                            <textarea
                                                className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/30 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none h-20 placeholder:text-slate-300 leading-relaxed"
                                                value={formData.descripcion || ''}
                                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                                placeholder="Ingrese la descripción detallada del objeto de contratación..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION 2: CLASIFICACIÓN Y ESTADO */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
                                        <Trophy className="w-4 h-4 text-amber-500" />
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Clasificación y Estado</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">ID Convocatoria</label>
                                            <input
                                                type="text"
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-mono text-xs"
                                                value={formData.id_convocatoria || ''}
                                                onChange={(e) => setFormData({ ...formData, id_convocatoria: e.target.value })}
                                                placeholder="Ej: 1184204"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">OCID</label>
                                            <input
                                                type="text"
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-300 font-mono text-xs"
                                                value={formData.ocid || ''}
                                                onChange={(e) => setFormData({ ...formData, ocid: e.target.value })}
                                                placeholder="ocds-..."
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">Tipo Procedimiento</label>
                                            <select
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                                value={formData.tipo_procedimiento || ''}
                                                onChange={(e) => setFormData({ ...formData, tipo_procedimiento: e.target.value })}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="Licitacion Publica">Licitación Pública</option>
                                                <option value="Adjudicacion Simplificada">Adjudicación Simplificada</option>
                                                <option value="Concurso Publico">Concurso Público</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">Categoría</label>
                                            <select
                                                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                                value={formData.categoria || ''}
                                                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="BIENES">BIENES</option>
                                                <option value="SERVICIOS">SERVICIOS</option>
                                                <option value="OBRAS">OBRAS</option>
                                                <option value="CONSULTORÍA">CONSULTORÍA</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">Estado Actual</label>
                                            <select
                                                className={`w-full p-2.5 rounded-lg border dark:border-slate-600 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none
                                                ${formData.estado_proceso === 'CONVOCADO' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        formData.estado_proceso === 'ADJUDICADO' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                            'bg-white text-slate-700 border-slate-200'}
                                            `}
                                                value={formData.estado_proceso || 'CONVOCADO'}
                                                onChange={(e) => setFormData({ ...formData, estado_proceso: e.target.value })}
                                            >
                                                <option value="">Seleccionar...</option>
                                                {estadosOptions.length > 0 ? (
                                                    estadosOptions.map((est: string, i: number) => (
                                                        <option key={i} value={est}>{est}</option>
                                                    ))
                                                ) : (
                                                    <>
                                                        <option value="CONVOCADO">CONVOCADO</option>
                                                        <option value="ADJUDICADO">ADJUDICADO</option>
                                                        <option value="CONTRATADO">CONTRATADO</option>
                                                        <option value="NULO">NULO</option>
                                                        <option value="DESIERTO">DESIERTO</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* SECTION 3: UBICACIÓN */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
                                            <MapPin className="w-4 h-4 text-rose-500" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Ubicación Geográfica</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">Departamento</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                                    value={formData.departamento || ''}
                                                    onChange={(e) => setFormData({ ...formData, departamento: e.target.value.toUpperCase() })}
                                                    placeholder="Ej: LIMA"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">Provincia</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                                        value={formData.provincia || ''}
                                                        onChange={(e) => setFormData({ ...formData, provincia: e.target.value.toUpperCase() })}
                                                        placeholder="Ej: LIMA"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">Distrito</label>
                                                    <input
                                                        type="text"
                                                        className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800/50 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                                        value={formData.distrito || ''}
                                                        onChange={(e) => setFormData({ ...formData, distrito: e.target.value.toUpperCase() })}
                                                        placeholder="Ej: MIRAFLORES"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SECTION 4: DATOS ECONÓMICOS */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
                                            <DollarSign className="w-4 h-4 text-emerald-500" />
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Datos Económicos</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">Monto Estimado</label>
                                                <div className="flex rounded-lg shadow-sm">
                                                    <select
                                                        className="px-3 py-2.5 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-sm font-bold focus:ring-0 outline-none"
                                                        value={formData.moneda || 'PEN'}
                                                        onChange={(e) => setFormData({ ...formData, moneda: e.target.value })}
                                                    >
                                                        <option value="PEN">S/</option>
                                                        <option value="USD">$</option>
                                                    </select>
                                                    <input
                                                        type="number"
                                                        className="flex-1 p-2.5 rounded-r-lg border border-slate-200 font-mono text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                                        value={formData.monto_estimado || 0}
                                                        onChange={(e) => setFormData({ ...formData, monto_estimado: Number(e.target.value) })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">F. Publicación</label>
                                                <input
                                                    type="date"
                                                    className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                                    value={formData.fecha_publicacion?.split('T')[0] || ''}
                                                    onChange={(e) => setFormData({ ...formData, fecha_publicacion: e.target.value })}
                                                />
                                            </div>
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
                                                    <option value="Carta Fianza">Carta Fianza</option>
                                                    <option value="Poliza de Caucion">Póliza de Caución</option>
                                                    <option value="Deposito a Plazo">Depósito a Plazo</option>
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
                    <div className="p-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3 bg-white dark:bg-[#111c44]">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10 transition-colors text-sm"
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
        </div>,
        document.body
    );
}
