'use client'

import { Badge } from '@/components/ui/badge'
import { getBankColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface BankBadgeProps {
    bank: string | null
    className?: string
}

/**
 * Smart badge component that displays bank names with specific colors
 * 
 * Color mapping:
 * - SCOTIABANK: Red background, white text
 * - BCP: Dark blue background, white text
 * - BBVA: Blue background, white text
 * - INTERBANK: Light blue background, white text
 * - FOGAPI/SECREX: Amber background, black text (liquid guarantee indicator)
 * - null/unknown: Gray badge "Sin Garantía"
 */
export function BankBadge({ bank, className }: BankBadgeProps) {
    if (!bank) {
        return (
            <Badge
                variant="outline"
                className={cn(
                    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300",
                    className
                )}
            >
                Sin Garantía
            </Badge>
        )
    }

    const colorClass = getBankColor(bank)

    return (
        <Badge
            className={cn(
                colorClass,
                "border-0 font-medium",
                className
            )}
        >
            {bank.toUpperCase()}
        </Badge>
    )
}
