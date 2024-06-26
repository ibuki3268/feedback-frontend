import { useState } from 'react';
import BarcodeReader from '~/components/BarcodeReader';
import Footer from '~/components/Footer';
import Header from '~/components/Header';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
}

export const links = () => {
    return [
        { rel: 'stylesheet', href: '/styles/normalize.css' },
        { rel: 'stylesheet', href: '/styles/header.css' },
        { rel: 'stylesheet', href: '/styles/lend.css' },
        { rel: 'stylesheet', href: '/styles/footer.css' }
    ];
};

export default function Lend() {
    const [product, setProduct] = useState<Product | null>(null);
    const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

    const handleScan = (barcode: string) => {
        console.log('Scanned barcode:', barcode);
        setScannedBarcode(barcode);
        // Product retrieval logic
    };

    return (
        <div className="page-container">
            <Header />
            <div className="content-container">
                <div className="content">
                    <h1>じょぎの貸し出し</h1>
                    <BarcodeReader onScan={handleScan} />
                    {scannedBarcode && <p>Scanned Barcode: {scannedBarcode}</p>}
                    {product ? (
                        <div>
                            <h2>Product Details</h2>
                            <p>Name: {product.name}</p>
                            <p>Price: ${product.price}</p>
                            <p>Description: {product.description}</p>
                        </div>
                    ) : (
                        <p>No product found</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
