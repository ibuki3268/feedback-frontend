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
                    <li><Link to="/request">希望図書</Link></li>
                    <li><Link to="/home">ホーム</Link></li>
                    <li><Link to="/lend">貸出</Link></li>
                    <li><Link to="/mypage">マイページ</Link></li>
                    <li><Link to="/book-register">本の登録</Link></li>
                </ul>
            </nav>
        </footer>
    );
}
