'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function useAuthProtection() {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Skip check on login page
        if (pathname === '/') {
            setLoading(false);
            return;
        }

        const checkAuth = () => {
            try {
                const token = localStorage.getItem('access_token');
                const userStr = localStorage.getItem('user');

                if (!token || !userStr) {
                    console.warn(`Unauthorized access attempt to ${pathname}. Redirecting to login.`);
                    router.replace('/');
                    return;
                }

                // Optional: Check token expiration if JWT logic exists in frontend
                // For now, presence is enough as a basic guard.

                setIsAuthenticated(true);
            } catch (error) {
                console.error('Auth check error:', error);
                router.replace('/');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router, pathname]);

    return { isAuthenticated, loading };
}
