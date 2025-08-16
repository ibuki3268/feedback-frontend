import { Link } from '@remix-run/react';

export const links = () => {
    return [
        { rel: 'stylesheet', href: '/styles/normalize.css' },
        { rel: 'stylesheet', href: '/styles/header.css' }];
};

export default function Header() {
    return (
        <header className="header">
            <nav>
                <ul>
                    <li><Link to="https://feedback-frontend-ce8.pages.dev/home">じょぎ</Link></li>
                </ul>
            </nav>
        </header>
    );
}
