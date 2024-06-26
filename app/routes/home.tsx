import Header from '~/components/Header';
import Footer from '~/components/Footer';

export const links = () => {
    return [
        { rel: 'stylesheet', href: '/styles/normalize.css' },
        { rel: 'stylesheet', href: '/styles/home.css' },
        { rel: 'stylesheet', href: '/styles/header.css' },
        { rel: 'stylesheet', href: '/styles/footer.css' },
    ];
};

export default function Home() {
    return (
        <div className="page-container">
            <Header />
            <div className="content-container">
                <div className="content">
                    <h1>じょぎの貸し出し</h1>
                    <p>ようこそ！以下のリンクから希望図書や貸出ページに移動できます。</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
