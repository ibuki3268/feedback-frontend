import { useState } from 'react';
import BarcodeReader from '~/components/BarcodeReader';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
}

const mockProductDatabase: Record<string, Product> = {
    '123456789012': { id: '123456789012', name: 'Product 1', price: 100, description: 'Description for product 1' },
    '987654321098': { id: '987654321098', name: 'Product 2', price: 200, description: 'Description for product 2' },
};

export const links = () => {
    return [{ rel: 'stylesheet', href: '/styles/home.css' }];
};

export default function Home() {
    const [product, setProduct] = useState<Product | null>(null);
    const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);

    const handleScan = (barcode: string) => {
        console.log('Scanned barcode:', barcode);
        setScannedBarcode(barcode);
        const scannedProduct = mockProductDatabase[barcode];
        setProduct(scannedProduct || null);
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
