import { useState } from 'react';
import { useNavigate } from '@remix-run/react';

export default function Login() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const correctPassword = import.meta.env.VITE_PASSWORD;
        if (password === correctPassword) {
            localStorage.setItem('authenticated', 'true');
            navigate('/home'); // ログイン成功後に/homeにリダイレクト
        } else {
            setError('Incorrect password');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                />
                <button type="submit">Submit</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
