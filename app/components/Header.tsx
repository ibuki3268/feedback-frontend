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
                    <li><Link to="https://jyogi-hp.pages.dev/">じょぎ</Link></li>
                </ul>
            </nav>
        </header>
    );
}
