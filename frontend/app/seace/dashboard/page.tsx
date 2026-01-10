"use client";

import React, { useEffect, useState, useCallback } from "react";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import { DistributionRadialChart } from "@/components/ecommerce/DistributionRadialChart";

import { SalesAreaChart } from "@/components/ecommerce/SalesAreaChart";
import { PeruInteractiveMap } from "@/components/ecommerce/PeruInteractiveMap";
import { FinancialEntitiesTable } from "@/components/ecommerce/FinancialEntitiesTable";

export default function EcommerceDashboardPage() {
    // --- Data States ---
    const [kpisLic, setKpisLic] = useState<any>(null); // For Lictaciones card
    const [kpisMonto, setKpisMonto] = useState<any>(null); // For Monto card
    const [distribution, setDistribution] = useState<any[]>([]);
    const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
    const [financialEntities, setFinancialEntities] = useState<any[]>([]);
    const [departmentRanking, setDepartmentRanking] = useState<any[]>([]);
    const [statusStats, setStatusStats] = useState<any[]>([]);

    const [provinceRanking, setProvinceRanking] = useState<any[]>([]);

    // --- Filter States (Independent) ---
    const [yearTrend, setYearTrend] = useState(0);
    const [yearDist, setYearDist] = useState(0);
    const [yearFinance, setYearFinance] = useState(0);

    // Independent States for KPIs
    const [yearLic, setYearLic] = useState(0);
    const [yearMonto, setYearMonto] = useState(0);

    const [filterDept, setFilterDept] = useState<string | null>(null);

    // --- Loading States ---
    const [loadingKpis, setLoadingKpis] = useState(true);
    const [loadingMap, setLoadingMap] = useState(false);

    // 1. Initial Load (Static Data + First Fetch)
    useEffect(() => {
        async function fetchStatic() {
            try {
                const baseUrl = '/api/dashboard';
                const [status] = await Promise.all([
                    fetch(`${baseUrl}/stats-by-status`).then(r => r.json())
                ]);

                // Transform Status
                const transformedStatus = (status.data || []).map((item: any) => ({
                    status: item.name,
                    count: item.value
                }));
                setStatusStats(transformedStatus);

            } catch (error) {
                console.error("Error static:", error);
            }
        }
        fetchStatic();
    }, []);


    // 2a. KPIs - Licitaciones
    useEffect(() => {
        async function fetchKpisLic() {
            try {
                setLoadingKpis(true);
                const res = await fetch(`/api/dashboard/kpis?year=${yearLic}`).then(r => r.json());
                setKpisLic(res);
            } catch (e) {
                console.error("KPI Lic error", e);
            } finally {
                setLoadingKpis(false);
            }
        }
        fetchKpisLic();
    }, [yearLic]);

    // 2b. KPIs - Monto
    useEffect(() => {
        async function fetchKpisMonto() {
            try {
                const res = await fetch(`/api/dashboard/kpis?year=${yearMonto}`).then(r => r.json());
                setKpisMonto({
                    ...res,
                    monto_total_adjudicado: parseFloat(res?.monto_total_estimado || "0")
                });
            } catch (e) {
                console.error("KPI Monto error", e);
            }
        }
        fetchKpisMonto();
    }, [yearMonto]);
    // 4a. Map Data - Department Ranking (Initial Load Only)
    useEffect(() => {
        async function fetchDepartmentRanking() {
            setLoadingMap(true);
            try {
                const mapYear = 0; // Hardcoded to All Years
                const baseUrl = '/api/dashboard';
                const deptRes = await fetch(`${baseUrl}/department-ranking?year=${mapYear}`).then(r => r.json());
                setDepartmentRanking(deptRes.data || []);
            } catch (error) {
                console.error("Error dept data:", error);
            } finally {
                setLoadingMap(false);
            }
        }
        fetchDepartmentRanking();
    }, []);

    // 4b. Map Data - Province Ranking (On Selection, Silent Update)
    useEffect(() => {
        async function fetchProvinceRanking() {
            if (!filterDept) {
                setProvinceRanking([]);
                return;
            }
            try {
                const mapYear = 0;
                const baseUrl = '/api/dashboard';
                const cleanDept = filterDept.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
                const provRes = await fetch(`${baseUrl}/province-ranking?department=${cleanDept}&year=${mapYear}`).then(r => r.json());
                setProvinceRanking(provRes.data || []);
            } catch (error) {
                console.error("Error prov data:", error);
                setProvinceRanking([]);
            }
        }
        fetchProvinceRanking();
    }, [filterDept]);


    // 3. Monthly Trend (Independent)
    useEffect(() => {
        async function fetchTrend() {
            try {
                const res = await fetch(`/api/dashboard/monthly-trend?year=${yearTrend}`).then(r => r.json());
                const transformed = (res.data || []).map((item: any) => ({
                    month: item.month || item.name,
                    total: item.total || item.count || item.value || 0
                }));
                setMonthlyTrend(transformed);
            } catch (e) {
                console.error("Trend error", e);
            }
        }
        fetchTrend();
    }, [yearTrend]);

    // 4. Distribution (Independent)
    useEffect(() => {
        async function fetchDist() {
            try {
                const res = await fetch(`/api/dashboard/distribution-by-type?year=${yearDist}`).then(r => r.json());
                const transformed = (res.data || []).map((item: any) => ({
                    type: item.name,
                    total: item.value
                }));
                setDistribution(transformed);
            } catch (e) {
                console.error("Dist error", e);
            }
        }
        fetchDist();
    }, [yearDist]);

    // 5. Financial Entities (Independent)
    // 5. Financial Entities (Independent)
    useEffect(() => {
        async function fetchFinance() {
            try {
                // Independent: Do NOT filter by Dept
                const res = await fetch(`/api/dashboard/financial-entities-ranking?year=${yearFinance}`).then(r => r.json());

                const transformed = (res.data || []).map((item: any) => ({
                    name: item.name,
                    garantias: item.count,
                    monto: item.amount,
                    depts: `${item.dept_count || 0} Depts.`,
                    cobertura: "Nacional"
                }));
                setFinancialEntities(transformed);
            } catch (e) {
                console.error("Finance error", e);
            }
        }
        fetchFinance();
    }, [yearFinance]);

    // Stable callback references with useCallback (MUST be before any conditional returns)
    const handleYearLicChange = useCallback((year: number) => setYearLic(year), []);
    const handleYearMontoChange = useCallback((year: number) => setYearMonto(year), []);
    const handleYearTrendChange = useCallback((year: number) => setYearTrend(year), []);
    const handleYearDistChange = useCallback((year: number) => setYearDist(year), []);
    const handleYearFinanceChange = useCallback((year: number) => setYearFinance(year), []);
    const handleDepartmentClick = useCallback((dept: string | null) => setFilterDept(dept), []);

    if (loadingKpis && !kpisLic) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#0b122b] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // Prep Dept Ranking with percentages
    const totalMapLicitaciones = departmentRanking.reduce((acc: number, item: any) => acc + (item.count || 0), 0) || 1;
    const finalDeptRanking = departmentRanking.map((item: any, index: number) => ({
        rank: index + 1,
        name: item.name,
        count: item.count,
        percentage: Math.round((item.count / totalMapLicitaciones) * 100)
    }));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b122b] p-4 text-slate-800 dark:text-slate-200 font-sans fade-in transition-colors duration-300">
            <div className="mx-auto max-w-[1600px] space-y-6">

                {/* --- Main Dashboard Grid --- */}
                <div className="space-y-6">

                    {/* ROW 1: Key Metrics (Driven by Main Trend Year) */}
                    <div>
                        <EcommerceMetrics
                            licitaciones={kpisLic?.total_licitaciones}
                            monto={kpisMonto?.monto_total_adjudicado}
                            yearLic={yearLic}
                            onYearLicChange={handleYearLicChange}
                            yearMonto={yearMonto}
                            onYearMontoChange={handleYearMontoChange}
                        />
                    </div>

                    {/* ROW 2: Charts (Trend + Distribution) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        {/* Left: Monthly Trend (Main Chart) */}
                        <div className="lg:col-span-8 h-[500px]">
                            <SalesAreaChart
                                data={monthlyTrend}
                                selectedYear={yearTrend}
                                onYearChange={handleYearTrendChange}
                            />
                        </div>

                        {/* Right: Distribution (Radial) */}
                        <div className="lg:col-span-4 h-[500px]">
                            <DistributionRadialChart
                                data={distribution}
                                selectedYear={yearDist}
                                onYearChange={handleYearDistChange}
                            />
                        </div>
                    </div>

                    {/* ROW 3: Detailed Tables */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left: Peru Interactive Map (Narrower) */}
                        <div className="lg:col-span-5">
                            <PeruInteractiveMap
                                departmentRanking={finalDeptRanking}
                                provinceRanking={provinceRanking}
                                selectedDepartment={filterDept}
                                onDepartmentClick={handleDepartmentClick}
                                loading={loadingMap}
                            />
                        </div>

                        {/* Right: Financial Entities (Wider) */}
                        <div className="lg:col-span-7">
                            <FinancialEntitiesTable
                                data={financialEntities}
                                selectedYear={yearFinance}
                                onYearChange={handleYearFinanceChange}
                            />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
