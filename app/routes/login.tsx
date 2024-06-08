import { useState } from 'react';
import { useNavigate } from '@remix-run/react';

export const links = () => {
    return [{ rel: 'stylesheet', href: '/styles/login.css' }];
};

export default function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const correctPassword = import.meta.env.VITE_PASSWORD;
        if (password === correctPassword) {
            localStorage.setItem('authenticated', 'true');
            navigate('/home');
        } else {
            setError('Incorrect password');
        }
    };

    return (
        <div className="container">
            <h1>じょぎの門</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ぱすわーどを入力してね"
                />
                <button type="submit">入室</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
}
