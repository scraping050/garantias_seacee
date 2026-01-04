"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface SalesAreaChartProps {
    data: Array<{ month: string; total: number }>;
    selectedYear: number;
    onYearChange: (year: number) => void;
}

export const SalesAreaChart: React.FC<SalesAreaChartProps> = ({ data = [], selectedYear, onYearChange }) => {
    const categories = data.map(item => item.month);
    const seriesData = data.map(item => item.total);

    const options: ApexOptions = {
        chart: {
            type: "area",
            toolbar: { show: false },
            background: 'transparent',
            fontFamily: 'inherit',
            animations: { enabled: true }
        },
        stroke: {
            curve: "smooth",
            width: 3,
            colors: ["#6366f1"] // Indigo-500
        },
        colors: ["#6366f1"],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.5,
                opacityTo: 0.1,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            categories: categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: "#94a3b8", fontSize: '12px', fontWeight: 500 }, // slate-400
                offsetY: 0
            },
            tooltip: { enabled: false }
        },
        yaxis: {
            show: true,
            labels: {
                style: { colors: "#94a3b8", fontSize: '11px', fontWeight: 500 },
                offsetX: -10,
                formatter: (value) => value.toFixed(0)
            },
        },
        grid: {
            show: true,
            borderColor: "#f1f5f9",
            strokeDashArray: 0,
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
            padding: { top: 0, right: 10, bottom: 0, left: 10 }
        },
        dataLabels: { enabled: false },
        tooltip: {
            theme: 'light',
            y: {
                formatter: function (val) {
                    return val + " Licitaciones"
                }
            },
            marker: { show: true },
        },
        markers: { size: 0, hover: { size: 5, sizeOffset: 3 } }
    };

    const series = [
        { name: "Licitaciones", data: seriesData },
    ];

    const years = [2024, 2025, 2026];

    return (
        <div className="rounded-2xl bg-white dark:bg-[#111c44] p-6 shadow-sm border border-slate-100 dark:border-white/5 transition-colors duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Estadísticas</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Total de licitaciones por mes</p>
                </div>
                <div className="flex bg-slate-50 dark:bg-slate-800 rounded-lg p-1">
                    {years.map(year => (
                        <button
                            key={year}
                            onClick={() => onYearChange(year)}
                            className={`min-w-[50px] px-3 py-1 text-xs font-bold rounded-md transition-all ${selectedYear === year
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5 dark:bg-[#111c44] dark:text-white dark:ring-white/10'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            {year}
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-[320px] w-full -ml-2">
                <ReactApexChart options={options} series={series} type="area" height={300} />
            </div>
        </div>
    );
};
