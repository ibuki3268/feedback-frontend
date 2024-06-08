import { useEffect } from 'react';
import { useNavigate } from '@remix-run/react';

export default function Protected() {
    const navigate = useNavigate();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('authenticated') === 'true';
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div>
            <h1>Protected Content</h1>
            <p>You have access to this protected content.</p>
        </div>
    );
}
