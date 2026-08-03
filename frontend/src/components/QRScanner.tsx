import { useState, useRef } from 'react';
import { Camera, Upload, ScanLine } from 'lucide-react';
import { cn } from '../utils/cn';

interface QRScannerProps {
  onScan?: (value: string) => void;
  className?: string;
}

export function QRScanner({ onScan, className }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      setTimeout(() => {
        const simulatedValue = `ART-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
        setResult(simulatedValue);
        setIsScanning(false);
        onScan?.(simulatedValue);
      }, 1500);
    }
  };

  const handleCamera = () => {
    setIsScanning(true);
    setTimeout(() => {
      const simulatedValue = `ART-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      setResult(simulatedValue);
      setIsScanning(false);
      onScan?.(simulatedValue);
    }, 2000);
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      <div className="relative aspect-square rounded-2xl border-2 border-dashed border-gold/40 bg-cream/50 flex flex-col items-center justify-center p-8 overflow-hidden">
        {isScanning ? (
          <div className="text-center space-y-4">
            <ScanLine className="w-12 h-12 text-gold mx-auto animate-pulse" />
            <p className="text-obsidian font-medium">Analyse du QR code...</p>
          </div>
        ) : result ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
              <ScanLine className="w-8 h-8 text-gold" />
            </div>
            <p className="text-sm text-muted">Code détecté</p>
            <p className="text-lg font-serif text-obsidian">{result}</p>
            <button
              onClick={() => setResult(null)}
              className="text-sm text-gold hover:text-gold-dark font-medium"
            >
              Scanner à nouveau
            </button>
          </div>
        ) : (
          <>
            <Camera className="w-12 h-12 text-gold/60 mb-4" />
            <p className="text-center text-obsidian/70 mb-6">Positionnez un QR code œuvre devant la caméra ou importez une image.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCamera}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-obsidian text-ivory rounded-full text-sm font-medium hover:bg-stone transition-colors"
              >
                <Camera className="w-4 h-4" />
                Caméra
              </button>
              <button
                onClick={() => inputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-5 py-2.5 border border-obsidian/20 text-obsidian rounded-full text-sm font-medium hover:border-gold transition-colors"
              >
                <Upload className="w-4 h-4" />
                Importer
              </button>
            </div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </>
        )}
      </div>
    </div>
  );
}
