import { useState, useEffect } from 'react';
import BarcodeReader from '~/components/BarcodeReader';
import Footer from '~/components/Footer';
import Header, { links as headerLinks } from '~/components/Header';
import Papa from 'papaparse';

interface Product {
    code: string;
    title: string;
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

    useEffect(() => {
        fetch('/assets/Bookstore.csv')
            .then(response => response.text())
            .then(text => {
                Papa.parse<Product>(text, {
                    header: true,
                    complete: (results) => {
                        setProducts(results.data);
                    }
                });
            });
    }, []);

    const handleScan = (barcode: string) => {
        console.log('Scanned barcode:', barcode);
        setScannedBarcode(barcode);
        const scannedProduct = products.find(product => product.code === barcode);
        setProduct(scannedProduct || null);
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
                                <p>{product.title}</p>
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
