import { useState } from 'react';
import BarcodeReader from '~/components/BarcodeReader';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
}



export const links = () => {
    return [{ rel: 'stylesheet', href: '/styles/home.css' }];
};

export default function Home() {
    const [product, setProduct] = useState<Product | null>(null);
    const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

    const handleScan = (barcode: string) => {
        console.log('Scanned barcode:', barcode);
        setScannedBarcode(barcode);

    };

    return (
        <div className="container">
            <h1>じょぎの貸し出し</h1>
            <BarcodeReader onScan={handleScan} />
            {scannedBarcode && <p>Scanned Barcode: {scannedBarcode}</p>}
            {product ? (
                <div className="product-details">
                    <h2>Product Details</h2>
                    <p>Name: {product.name}</p>
                    <p>Price: ${product.price}</p>
                    <p>Description: {product.description}</p>
                </div>
            ) : (
                <p>No product found</p>
            )}
        </div>
    );
}
