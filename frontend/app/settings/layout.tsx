'use client';

import { useAuthProtection } from '@/hooks/use-auth-protection';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuthProtection();

    if (loading || !isAuthenticated) return null;

    return (
        <>
            {children}
        </>
    );
}
