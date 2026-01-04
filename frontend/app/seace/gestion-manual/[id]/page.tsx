"use client";

import React from "react";
import { useParams } from "next/navigation";
import LicitacionDetail from "@/components/search/LicitacionDetail";

export default function GestionManualDetailPage() {
    const params = useParams();
    const id = params.id as string;

    return <LicitacionDetail id={id} basePath="/seace/gestion-manual" />;
}
