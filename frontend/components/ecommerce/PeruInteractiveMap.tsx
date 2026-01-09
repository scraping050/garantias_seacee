"use client";

import React, { useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup
} from "react-simple-maps";

interface PeruMapProps {
    data: Array<{ name: string; count: number; percentage?: number }>;
    provinceData?: Array<{ name: string; count: number; amount?: number }>;
    onDepartmentClick?: (department: string | null) => void;
}

export const PeruInteractiveMap: React.FC<PeruMapProps> = ({ data = [], provinceData = [], onDepartmentClick }) => {
    const [hoveredDept, setHoveredDept] = useState<string | null>(null);
    const [selectedDept, setSelectedDept] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [showAll, setShowAll] = useState(false);

    // Create a map of department data for quick lookup
    const dataMap = new Map(
        data.map(d => [d.name.toUpperCase(), d])
    );

    const handleMouseEnter = (geo: any) => {
        const deptName = geo.properties.NOMBDEP || geo.properties.NOMDEP || geo.properties.name;
        setHoveredDept(deptName);
    };

    const handleMouseLeave = () => {
        setHoveredDept(null);
    };

    const handleClick = (geo: any) => {
        const deptName = geo.properties.NOMBDEP || geo.properties.NOMDEP || geo.properties.name;

        if (selectedDept === deptName) {
            setSelectedDept(null);
            if (onDepartmentClick) {
                onDepartmentClick(null);
            }
        } else {
            setSelectedDept(deptName);
            if (onDepartmentClick) {
                onDepartmentClick(deptName);
            }
        }
    };

    const handleToggleShowAll = () => {
        setShowAll(!showAll);
    };

    // Calculate how many items to display
    const itemsToDisplay = showAll ? data.length : Math.min(10, data.length);
    const displayData = data.slice(0, itemsToDisplay);

    return (
        <div className="rounded-2xl bg-white dark:bg-[#111c44] p-6 shadow-md dark:shadow-xl border border-slate-100 dark:border-white/5 h-full flex flex-col transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="transition-all duration-300">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">
                        {hoveredDept || selectedDept || "Licitaciones por Departamento"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        {(hoveredDept || selectedDept) ? (
                            <>
                                <span className="text-blue-600 dark:text-blue-400 font-bold">
                                    {new Intl.NumberFormat('es-PE').format(
                                        (dataMap.get((hoveredDept || selectedDept)?.toUpperCase() || '')?.count || 0)
                                    )}
                                </span> Licitaciones encontradas
                            </>
                        ) : (
                            "Distribución nacional de licitaciones"
                        )}
                    </p>
                </div>

                {/* Three-dot menu */}
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
                        aria-label="Opciones"
                    >
                        <svg
                            className="w-5 h-5 text-slate-600 dark:text-slate-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <circle cx="10" cy="4" r="1.5" />
                            <circle cx="10" cy="10" r="1.5" />
                            <circle cx="10" cy="16" r="1.5" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        handleToggleShowAll();
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {showAll ? 'Ver menos' : 'Ver más'}
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        console.log('Exportar datos');
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Exportar datos
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setSelectedDept(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Restablecer selección
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative flex items-center justify-center bg-slate-50 dark:bg-[#0b122b]/50 rounded-2xl p-4">
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        center: [-75, -9.5],
                        scale: 1800
                    }}
                    width={460}
                    height={700}
                    className="w-full h-full max-w-[400px] max-h-[600px]"
                    style={{ width: "100%", height: "100%" }}
                >
                    <ZoomableGroup
                        center={[-75, -9.5]}
                        zoom={1}
                        minZoom={1}
                        maxZoom={1}
                        filterZoomEvent={(evt) => {
                            // Disable wheel/scroll zoom completely
                            if (evt.type === 'wheel') return false;
                            return true;
                        }}
                    >
                        <Geographies geography="/peru-departments.geojson">
                            {({ geographies }: { geographies: any[] }) =>
                                geographies.map((geo) => {
                                    const deptName = geo.properties.NOMBDEP || geo.properties.NOMDEP || geo.properties.name;
                                    const isHovered = hoveredDept === deptName;
                                    const isSelected = selectedDept === deptName;

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onMouseEnter={() => handleMouseEnter(geo)}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={() => handleClick(geo)}
                                            style={{
                                                default: {
                                                    fill: isSelected ? "#FF6B35" : "#3B5A7D",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 1.5,
                                                    outline: "none",
                                                    transition: "all 200ms ease-in-out",
                                                },
                                                hover: {
                                                    fill: "#FF8C42",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 1.5,
                                                    outline: "none",
                                                    filter: "drop-shadow(0 4px 12px rgba(255, 140, 66, 0.4))",
                                                    cursor: "pointer",
                                                },
                                                pressed: {
                                                    fill: "#FF6B35",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 1.5,
                                                    outline: "none",
                                                },
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>
            </div>

            {/* Department/Province Ranking List */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                    {selectedDept ? `Provincias de ${selectedDept}` : `Top ${itemsToDisplay} Departamentos`}
                </h4>
                <div
                    className={`space-y-2.5 transition-all duration-300 ${showAll || selectedDept ? 'overflow-y-auto' : ''}`}
                    style={{ maxHeight: (showAll || selectedDept) ? '600px' : 'auto' }}
                >
                    {(selectedDept && provinceData.length > 0 ? provinceData : displayData).map((item, index) => {
                        // Calculate percentage for provinces if not present
                        let percentage = 0;
                        if (selectedDept && provinceData.length > 0) {
                            const totalProvinces = provinceData.reduce((acc, curr) => acc + curr.count, 0);
                            percentage = totalProvinces > 0 ? Math.round((item.count / totalProvinces) * 100) : 0;
                        } else {
                            percentage = (item as any).percentage || 0;
                        }

                        return (
                            <div key={index} className="group">
                                <div className="flex items-center gap-2.5 mb-1.5">
                                    {/* Rank Badge */}
                                    <div className="flex-shrink-0 w-7 h-7 rounded-md bg-blue-500 text-white flex items-center justify-center font-bold text-[11px]">
                                        #{index + 1}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide truncate">
                                            {item.name}
                                        </p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                            {new Intl.NumberFormat('es-PE').format(item.count)} Licitaciones
                                        </p>
                                    </div>

                                    {/* Percentage */}
                                    <span className="text-xs font-bold text-slate-900 dark:text-white flex-shrink-0">
                                        {percentage}%
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-1 w-full bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}

                    {selectedDept && provinceData.length === 0 && (
                        <div className="text-center py-4 text-slate-500 text-sm">
                            Cargando provincias...
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Mostrando {(selectedDept && provinceData.length > 0 ? provinceData : displayData).length} de {selectedDept && provinceData.length > 0 ? provinceData.length : data.length} {selectedDept ? 'provincias' : 'departamentos'}
                    </p>
                </div>
            </div>
        </div>
    );
};
