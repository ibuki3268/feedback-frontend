import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

export default function BarcodeReader({ onScan }: { onScan: (result: string) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDecoding, setIsDecoding] = useState(true);

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        let stopDecoding: (() => void) | undefined;

        if (videoRef.current && isDecoding) {
            const videoConstraints = {
                facingMode: 'environment', // 背面カメラを使用
                width: 640,
                height: 480,
            };

            navigator.mediaDevices.getUserMedia({ video: videoConstraints })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                    codeReader.decodeFromStream(stream, videoRef.current!, (result, error) => {
                        if (result) {
                            console.log('Barcode scanned:', result.getText());
                            onScan(result.getText());
                            setIsDecoding(false);
                        }
                        if (error) {
                            console.error('Decode error:', error);
                            setError(error.message);
                        }
                    }).then(result => {
                        console.log('Decoding started');
                        stopDecoding = result?.stop;
                    }).catch(err => {
                        console.error('Setup error:', err);
                        setError(err.message);
                    });
                })
                .catch(err => {
                    console.error('Camera setup error:', err);
                    setError(err.message);
                });

            return () => {
                if (stopDecoding) {
                    console.log('Stopping decoding');
                    stopDecoding();
                }
                if (videoRef.current && videoRef.current.srcObject) {
                    (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                }
            };
        }
    }, [onScan, isDecoding]);

    return (
        <div>
            <video ref={videoRef} width="300" height="200" autoPlay />
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}
