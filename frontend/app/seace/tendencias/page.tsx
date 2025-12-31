'use client'

import { useTendencias } from '@/hooks/use-tendencias'
import { KPICards } from '@/components/trends/kpi-cards'
import { GeographicHeatmap } from '@/components/trends/geographic-heatmap'


import { ConsortiumTree } from '@/components/trends/consortium-tree'
import { FilterPanel } from '@/components/trends/filter-panel'

export default function TendenciasPage() {
    const {
        kpis,
        geographicHeatmap,


        consortiumBreakdown,
        filterOptions,
        filters,
        selectedDepartamento,
        consortiumSearch,
        updateFilters,
        resetFilters,
        setSelectedDepartamento,
        setConsortiumSearch
    } = useTendencias()

    return (
        <div className="fade-in">
            {/* Header Premium con Gradiente */}
            <div className="mb-8 bg-gradient-to-r from-[#0F2C4A] to-[#1a4b7a] dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 md:p-10 shadow-xl text-white border border-transparent dark:border-gray-700">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 bg-white/20 dark:bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <i className="fas fa-chart-line text-xl sm:text-2xl lg:text-3xl text-white drop-shadow-lg"></i>
                    </div>
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                            Análisis de Tendencias
                        </h1>
                    </div>
                </div>
                <p className="text-blue-100 dark:text-gray-300 text-base md:text-lg ml-[72px]">
                    Visualización avanzada de patrones y tendencias en contrataciones públicas
                </p>
            </div>

            {/* Filter Panel */}
            <FilterPanel
                filters={filters}
                filterOptions={filterOptions.data}
                onFilterChange={updateFilters}
                onReset={resetFilters}
            />

            {/* KPI Cards */}
            <KPICards
                data={kpis.data}
                isLoading={kpis.isLoading}
            />

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                {/* Geographic Heat Map */}
                <div className="lg:col-span-2">
                    <GeographicHeatmap
                        data={geographicHeatmap.data}
                        isLoading={geographicHeatmap.isLoading}
                        onDrillDown={setSelectedDepartamento}
                        onDrillUp={() => setSelectedDepartamento(null)}
                    />
                </div>





            </div>

            {/* Consortium Breakdown - Full Width */}
            <div className="mb-6">
                <ConsortiumTree
                    data={consortiumBreakdown.data}
                    isLoading={consortiumBreakdown.isLoading}
                    searchValue={consortiumSearch}
                    onSearchChange={setConsortiumSearch}
                />
            </div>

            {/* Footer Info Premium */}
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-blue-200/50 dark:border-gray-700 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                        <i className="fas fa-info-circle text-white text-lg"></i>
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-bold text-blue-900 dark:text-white mb-3 flex items-center gap-2">
                            Guía de Uso de Gráficos
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex gap-2">
                                <i className="fas fa-map-marked-alt text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"></i>
                                <p className="text-sm text-blue-800 dark:text-gray-300"><strong>Mapa de Calor:</strong> Haz clic en un departamento para ver el desglose por provincias</p>
                            </div>

                            <div className="flex gap-2">
                                <i className="fas fa-project-diagram text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"></i>
                                <p className="text-sm text-blue-800 dark:text-gray-300"><strong>Consorcios:</strong> Usa el buscador para encontrar consorcios específicos por RUC o nombre</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
