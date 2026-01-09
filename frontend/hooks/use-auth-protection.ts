'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export function useAuthProtection() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Small delay to ensure AuthContext has initialized from localStorage
            await new Promise(resolve => setTimeout(resolve, 100));

            if (!isAuthenticated) {
                router.push('/login');
            }
            setLoading(false);
        };

        checkAuth();
    }, [isAuthenticated, router]);

    return { isAuthenticated, loading };
}
