import { useState, useEffect } from 'react';
import BarcodeReader from '~/components/BarcodeReader';
import Footer from '~/components/Footer';
import Header, { links as headerLinks } from '~/components/Header';

interface Product {
    ISBN: string;
    Title: string;
}

interface User {
    displayName: string;
    username: string;
}

export const links = () => {
    return [
        ...headerLinks(),
        { rel: 'stylesheet', href: '/styles/normalize.css' },
        { rel: 'stylesheet', href: '/styles/lend.css' },
        { rel: 'stylesheet', href: '/styles/footer.css' }
    ];
};

export default function Lend() {
    const [product, setProduct] = useState<Product | null>(null);
    const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    useEffect(() => {
        fetch('https://book-lending-back.jyogi.workers.dev/books.json')
            .then(response => response.json())
            .then((data: unknown) => {
                setProducts(data as Product[]);
            })
            .catch(error => console.error('Error fetching books:', error));
        
        fetch('https://book-lending-back.jyogi.workers.dev/users.json')
            .then(response => response.json())
            .then((data: unknown) => {
                setUsers(data as User[]);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const handleScan = (barcode: string) => {
        console.log('Scanned barcode:', barcode);
        setScannedBarcode(barcode);
        const scannedProduct = products.find(product => product.ISBN.trim() === barcode);
        setProduct(scannedProduct || null);
    };

    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const username = event.target.value;
        const user = users.find(user => user.username === username) || null;
        setSelectedUser(user);
    };

    const handleLend = (action: 'borrow' | 'return') => {
        if (selectedUser && product) {
            const data = {
                user: selectedUser.username,
                book: product.Title,
                action: action
            };

            fetch('https://book-lending-back.jyogi.workers.dev/api/lend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.text())
            .then(result => {
                console.log('Success:', result);
                // ここに貸し出しが成功したときの処理を追加
            })
            .catch(error => {
                console.error('Error:', error);
                // ここに貸し出しが失敗したときの処理を追加
            });
        }
    };

    return (
        <div className="page-container">
            <Header />
            <div className="content">
                <h1>じょぎの貸し出し</h1>
                <BarcodeReader onScan={handleScan} />
                {scannedBarcode && (
                    <div className="product-details">
                        {product ? (
                            <>
                                <h2>貸出する本</h2>
                                <p>{product.Title}</p>
                                <label htmlFor="user-select">ユーザーを選択</label>
                                <select id="user-select" onChange={handleUserChange}>
                                    <option value="">ユーザーを選択してください</option>
                                    {users.map(user => (
                                        <option key={user.username} value={user.username}>
                                            {user.displayName}
                                        </option>
                                    ))}
                                </select>
                                <div className="button-group">
                                    <button onClick={() => handleLend('borrow')} disabled={!selectedUser}>
                                        貸し出す
                                    </button>
                                    <button onClick={() => handleLend('return')} disabled={!selectedUser}>
                                        返す
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p>No product found</p>
                        )}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
