"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface StatusChartProps {
    data: Array<{ status: string; count: number }>;
}

export const StatusChart: React.FC<StatusChartProps> = ({ data = [] }) => {
    const categories = data.map(item => item.status);
    const seriesData = data.map(item => item.count);

    const options: ApexOptions = {
        chart: { type: "bar", toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 4, columnWidth: '20%', distributed: true } },
        colors: ["#3B82F6"],
        xaxis: {
            categories: categories,
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: "#64748B", fontSize: '10px' } } // slate-500 matches light/dark reasonably well
        },
        yaxis: {
            labels: { style: { colors: "#64748B" } },
            axisBorder: { show: false }
        },
        grid: { show: false, borderColor: "#334155" },
        dataLabels: { enabled: false },
        legend: { show: false },
        tooltip: { theme: 'dark' }, // Using dark theme tooltip for consistency, or logic to switch
    };

    const series = [{ name: "Licitaciones", data: seriesData }];

    return (
        <div className="rounded-2xl bg-white dark:bg-[#111c44] p-6 shadow-sm border border-slate-100 dark:border-white/5 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Licitaciones por Estado</h3>
                <button className="text-slate-300 hover:text-slate-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    </svg>
                </button>
            </div>
            <div className="h-64 w-full">
                <ReactApexChart options={options} series={series} type="bar" height={250} />
            </div>
        </div>
    );
};
