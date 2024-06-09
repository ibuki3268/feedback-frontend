import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import beepSound from '../../public/assets/beep.mp3';

export default function BarcodeReader({ onScan }: { onScan: (result: string) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDecoding, setIsDecoding] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const startScanning = () => {
        setIsDecoding(true);
        setIsScanning(true);
    };

    useEffect(() => {
        const codeReader = new BrowserMultiFormatReader();
        let stopDecoding: (() => void) | undefined;

        if (videoRef.current && isDecoding) {
            const videoConstraints = {
                facingMode: 'environment',
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
                            // スキャン成功時に音を鳴らす
                            // new Audio(beepSound).play();
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
        <div className="video-container">
            <video ref={videoRef} width="640" height="480" autoPlay />
            <div className="frame"></div>
            {/* {error && <p className="error">{error}</p>} */}
            {!isScanning && <button onClick={startScanning} className="scan-button">スキャン開始</button>}
        </div>
    );
}
