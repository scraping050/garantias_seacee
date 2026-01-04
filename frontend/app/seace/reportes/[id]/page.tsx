"use client";

import React from "react";
import { useParams } from "next/navigation";
import LicitacionDetail from "@/components/search/LicitacionDetail";

export default function ReportesDetailPage() {
    const params = useParams();
    const id = params.id as string;

    return <LicitacionDetail id={id} basePath="/seace/reportes" />;
}
