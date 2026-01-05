"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import { DistributionRadialChart } from "@/components/ecommerce/DistributionRadialChart";

import { SalesAreaChart } from "@/components/ecommerce/SalesAreaChart";
import { DepartmentRanking } from "@/components/ecommerce/DepartmentRanking";
import { FinancialEntitiesTable } from "@/components/ecommerce/FinancialEntitiesTable";

export default function EcommerceDashboardPage() {
    const [data, setData] = useState<any>({
        kpis: null,
        distribution: [],
        statusStats: [],
        monthlyTrend: [],
        departmentRanking: [],
        financialEntities: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(2024);

    useEffect(() => {
        async function fetchData() {
            try {
                const baseUrl = '/api/dashboard';

                // Fetch all endpoints in parallel
                const [kpis, dist, status, trend, dept, finance] = await Promise.all([
                    fetch(`${baseUrl}/kpis`).then(r => r.json()),
                    fetch(`${baseUrl}/distribution-by-type`).then(r => r.json()),
                    fetch(`${baseUrl}/stats-by-status`).then(r => r.json()),
                    fetch(`${baseUrl}/monthly-trend?year=${selectedYear}`).then(r => r.json()),
                    fetch(`${baseUrl}/department-ranking`).then(r => r.json()),
                    fetch(`${baseUrl}/financial-entities-ranking`).then(r => r.json())
                ]);

                // Debug logging
                console.log('=== API RESPONSES ===');
                console.log('KPIs:', kpis);
                console.log('Distribution:', dist);
                console.log('Status:', status);
                console.log('Trend:', trend);
                console.log('Department:', dept);
                console.log('Finance:', finance);

                // Transform Attributes
                const totalLicitaciones = kpis?.total_licitaciones || 1;

                const transformedDistribution = (dist.data || []).map((item: any) => ({
                    type: item.name,
                    total: item.value
                }));

                const transformedStatus = (status.data || []).map((item: any) => ({
                    status: item.name,
                    count: item.value
                }));

                const transformedDept = (dept.data || []).map((item: any, index: number) => ({
                    rank: index + 1,
                    name: item.name,
                    count: item.count,
                    percentage: Math.round((item.count / totalLicitaciones) * 100)
                }));

                const transformedFinance = (finance.data || []).map((item: any) => ({
                    name: item.name,
                    garantias: item.count,
                    monto: item.amount,
                    depts: "Varios",
                    cobertura: "Nacional"
                }));

                const transformedMonthlyTrend = (trend.data || []).map((item: any) => ({
                    month: item.name,
                    total: item.count
                }));

                // Debug transformed data
                console.log('=== TRANSFORMED DATA ===');
                console.log('Distribution:', transformedDistribution);
                console.log('Status:', transformedStatus);
                console.log('Dept:', transformedDept);
                console.log('Finance:', transformedFinance);
                console.log('Monthly Trend:', transformedMonthlyTrend);

                setData({
                    kpis: {
                        ...kpis,
                        monto_total_adjudicado: parseFloat(kpis?.monto_total_estimado || "0") // Use estimated amount if adjudicated is missing/zero
                    },
                    distribution: transformedDistribution,
                    statusStats: transformedStatus,
                    monthlyTrend: transformedMonthlyTrend,
                    departmentRanking: transformedDept,
                    financialEntities: transformedFinance
                });

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [selectedYear]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0b122b] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b122b] p-4 text-slate-800 dark:text-slate-200 font-sans fade-in transition-colors duration-300">
            <div className="mx-auto max-w-[1600px] space-y-6">

                {/* Top Bar */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Ecommerce</h1>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar..."
                                className="h-10 w-64 rounded-full bg-white dark:bg-[#111c44] pl-10 pr-4 text-sm text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-slate-200 dark:border-transparent shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-full hover:bg-white dark:hover:bg-[#111c44] text-slate-500 dark:text-slate-400 transition-colors">
                            <Bell className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* --- Main Dashboard Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Column: Metrics & Statistics Line Chart */}
                    <div className="lg:col-span-8 space-y-6">
                        <EcommerceMetrics
                            licitaciones={data.kpis?.total_licitaciones}
                            monto={data.kpis?.monto_total_adjudicado}
                        />
                        {/* Replaced StatusChart with SalesAreaChart (Line Chart) */}
                        <SalesAreaChart
                            data={data.monthlyTrend}
                            selectedYear={selectedYear}
                            onYearChange={setSelectedYear}
                        />
                    </div>

                    {/* Right Column: Distribution (Full Height) */}
                    <div className="lg:col-span-4">
                        <DistributionRadialChart data={data.distribution} />
                    </div>
                </div>

                {/* --- ROW 4: Department Ranking + Financial Entities --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <DepartmentRanking data={data.departmentRanking} />
                    </div>
                    <div className="lg:col-span-8">
                        <FinancialEntitiesTable data={data.financialEntities} />
                    </div>
                </div>

            </div>
        </div>
    );
}
