"use client";

import React, { useEffect, useState } from "react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import { DistributionRadialChart } from "@/components/ecommerce/DistributionRadialChart";

import { SalesAreaChart } from "@/components/ecommerce/SalesAreaChart";
import { PeruInteractiveMap } from "@/components/ecommerce/PeruInteractiveMap";
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
    const [filterDept, setFilterDept] = useState<string | null>(null);
    const [provinceRanking, setProvinceRanking] = useState<any[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const baseUrl = '/api/dashboard';
                const deptParam = filterDept ? `&department=${encodeURIComponent(filterDept)}` : '';

                // Fetch all endpoints in parallel
                // UPDATED: Financial Entities now uses filters (Year + Dept)
                const [kpis, dist, status, trend, dept, finance] = await Promise.all([
                    fetch(`${baseUrl}/kpis?year=${selectedYear}`).then(r => r.json()),
                    fetch(`${baseUrl}/distribution-by-type?year=${selectedYear}`).then(r => r.json()),
                    fetch(`${baseUrl}/stats-by-status`).then(r => r.json()),
                    fetch(`${baseUrl}/monthly-trend?year=${selectedYear}`).then(r => r.json()),
                    fetch(`${baseUrl}/department-ranking`).then(r => r.json()),
                    fetch(`${baseUrl}/financial-entities-ranking?year=${selectedYear}${deptParam}`).then(r => r.json())
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
                    depts: `${item.dept_count || 0} Depts.`,
                    cobertura: "Nacional"
                }));

                const transformedMonthlyTrend = (trend.data || []).map((item: any) => ({
                    month: item.month || item.name,
                    total: item.total || item.count || item.value || 0
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
    }, [selectedYear, filterDept]);

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

                {/* --- Main Dashboard Grid --- */}
                <div className="space-y-6">

                    {/* ROW 1: Key Metrics (Full Width) */}
                    <div>
                        <EcommerceMetrics
                            licitaciones={data.kpis?.total_licitaciones}
                            monto={data.kpis?.monto_total_adjudicado}
                        />
                    </div>

                    {/* ROW 2: Charts (Trend + Distribution) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        {/* Left: Monthly Trend (Main Chart) */}
                        <div className="lg:col-span-8 h-[500px]">
                            <SalesAreaChart
                                data={data.monthlyTrend}
                                selectedYear={selectedYear}
                                onYearChange={setSelectedYear}
                            />
                        </div>

                        {/* Right: Distribution (Radial) */}
                        <div className="lg:col-span-4 h-[500px]">
                            <DistributionRadialChart
                                data={data.distribution}
                                selectedYear={selectedYear}
                                onYearChange={setSelectedYear}
                            />
                        </div>
                    </div>

                    {/* ROW 3: Detailed Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left: Peru Interactive Map (Narrower) */}
                        <div className="lg:col-span-5">
                            <PeruInteractiveMap
                                data={data.departmentRanking}
                                provinceData={provinceRanking}
                                onDepartmentClick={async (deptName) => {
                                    setFilterDept(deptName); // Update filter state to trigger useEffect
                                    if (deptName) {
                                        try {
                                            const res = await fetch(`/api/dashboard/province-ranking?department=${encodeURIComponent(deptName)}`);
                                            const json = await res.json();
                                            setProvinceRanking(json.data || []);
                                        } catch (e) {
                                            console.error("Error fetching provinces", e);
                                            setProvinceRanking([]);
                                        }
                                    } else {
                                        setProvinceRanking([]);
                                    }
                                }}
                            />
                        </div>

                        {/* Right: Financial Entities (Wider) */}
                        <div className="lg:col-span-7">
                            <FinancialEntitiesTable data={data.financialEntities} />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
