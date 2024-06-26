import { Link } from '@remix-run/react';

export const links = () => {
    return [
        { rel: 'stylesheet', href: '/styles/normalize.css' },
        { rel: 'stylesheet', href: '/styles/footer.css' }];
};

export default function Footer() {
    return (
        <footer className="footer">
            <nav>
                <ul>
                    <li><Link to="/wish">希望</Link></li>
                    <li><Link to="/lend">Lend</Link></li>
                    <li><Link to="/home">Home</Link></li>
                </ul>
            </nav>
        </footer>
    );
}
