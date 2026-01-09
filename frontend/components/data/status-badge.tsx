'use client'

import { Badge } from '@/components/ui/badge'
import { getStatusColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
    status: string | null
    className?: string
}

/**
 * Badge component for displaying process status with semantic colors
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
    if (!status) {
        return (
            <Badge variant="outline" className={cn("bg-gray-100 text-gray-800", className)}>
                N/A
            </Badge>
        )
    }

    const colorClass = getStatusColor(status)

    return (
        <Badge className={cn(colorClass, "border-0", className)}>
            {status}
        </Badge>
    )
}
