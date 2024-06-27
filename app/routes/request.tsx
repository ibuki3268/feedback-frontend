import { useState } from 'react';
import Header from '~/components/Header';
import Footer from '~/components/Footer';

export const links = () => {
    return [
        { rel: 'stylesheet', href: '/styles/normalize.css' },
        { rel: 'stylesheet', href: '/styles/request.css' },
        { rel: 'stylesheet', href: '/styles/header.css' },
        { rel: 'stylesheet', href: '/styles/footer.css' },
    ];
};

export default function Wish() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        setMessage('まだ実装してません。ごめんね。リタ子より');
    };

    return (
        <div className="page-container">
            <Header />
            <div className="content-container">
                <div className="content">
                    <h1>図書リクエスト</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">タイトル</label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="author">著者</label>
                            <input
                                type="text"
                                id="author"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">リクエスト送信</button>
                    </form>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
            <Footer />
        </div>
    );
}
