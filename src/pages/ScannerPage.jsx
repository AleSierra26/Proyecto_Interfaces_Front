import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { ChevronLeft, QrCode, Keyboard, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { validateTicket } from '../api.js';

function ResultCard({ result, onReset }) {
    const valid = result?.valid;
    return (
        <div className={`w-full rounded-sm border p-6 flex flex-col items-center gap-4 text-center transition-all ${
            valid ? 'bg-card border-foreground' : 'bg-muted border-border'
        }`}>
            {valid
                ? <CheckCircle className="w-12 h-12 text-foreground" />
                : <XCircle className="w-12 h-12 text-muted-foreground" />
            }
            <div>
                <p className={`font-sans font-bold text-2xl tracking-widest ${
                    valid ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                    {valid ? 'Válido' : 'Inválido'}
                </p>
                <p className="text-[10px] uppercase tracking-widest font-sans text-muted-foreground mt-1">
                    {valid ? 'Acceso permitido' : result?.reason}
                </p>
            </div>
            <button
                onClick={onReset}
                className="mt-2 flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:bg-primary hover:text-primary-foreground transition-colors"
            >
                <RotateCcw className="w-3.5 h-3.5" />
                Escanear otro
            </button>
        </div>
    );
}

export default function ScannerPage() {
    const navigate = useNavigate();
    const { eventId } = useParams(); // comes from /scanner/:eventId

    const [mode, setMode] = useState('qr');
    const [result, setResult] = useState(null);
    const [manualCode, setManualCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const scannerRef = useRef(null);

    const handleValidation = async (token) => {
        setLoading(true);
        setError('');
        try {
            const data = await validateTicket(token, eventId);
            setResult(data);
        } catch (e) {
            setError('Error al conectar con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mode !== 'qr' || result) return;

        const scanner = new Html5QrcodeScanner(
            'qr-reader',
            { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
            false
        );

        scanner.render(
            async (token) => {
                await scanner.clear();
                handleValidation(token);
            },
            () => {}
        );

        scannerRef.current = scanner;
        return () => {
            scannerRef.current?.clear().catch(() => {});
        };
    }, [mode, result]);

    const handleReset = () => {
        setResult(null);
        setManualCode('');
        setError('');
    };

    const handleManualSubmit = () => {
        const trimmed = manualCode.trim().toUpperCase();
        if (trimmed.length !== 8) {
            setError('El código debe tener 8 caracteres.');
            return;
        }
        handleValidation(trimmed);
    };

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto">

            <div className="px-4 pt-8 pb-16">

                {/* Header + Page title */}
                 <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-widest font-sans">Volver</span>
                </button>
                <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        Evento #{eventId}
                    </p>
                    <h2 className="font-sans font-bold text-2xl tracking-widest">
                        Escanear ticket
                    </h2>
                </div>

                {/* Mode toggle */}
                {!result && (
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => { setMode('qr'); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs uppercase tracking-widest font-sans font-medium rounded-[10px] border transition-colors ${
                                mode === 'qr'
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-card text-muted-foreground border-border hover:border-foreground'
                            }`}
                        >
                            <QrCode className="w-3.5 h-3.5" />
                            Cámara QR
                        </button>
                        <button
                            onClick={() => { setMode('manual'); setError(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs uppercase tracking-widest font-sans font-medium rounded-[10px] border transition-colors ${
                                mode === 'manual'
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-card text-muted-foreground border-border hover:border-foreground'
                            }`}
                        >
                            <Keyboard className="w-3.5 h-3.5" />
                            Código manual
                        </button>
                    </div>
                )}

                {/* Result */}
                {result && <ResultCard result={result} onReset={handleReset} />}

                {/* QR scanner */}
                {!result && mode === 'qr' && (
                    <div className="flex justify-center">
                        <div id="qr-reader" className="w-full max-w-sm rounded-sm overflow-hidden border border-border" />
                        {loading && (
                            <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground font-sans mt-4">
                                Validando...
                            </p>
                        )}
                    </div>
                )}

                {/* Manual code input */}
                {!result && mode === 'manual' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest font-sans font-medium text-muted-foreground mb-1.5">
                                Código de 8 caracteres
                            </label>
                            <input
                                type="text"
                                maxLength={8}
                                value={manualCode}
                                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                                placeholder="Ej. A3F2C1D4"
                                className="w-full border border-border rounded-[10px] px-3 py-3 bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none font-mono tracking-widest uppercase focus:border-foreground transition-colors"
                            />
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans mt-1.5">
                                Ingresa los primeros 8 caracteres bajo el QR del ticket
                            </p>
                        </div>

                        {error && (
                            <p className="text-[10px] uppercase tracking-widest font-sans text-muted-foreground">
                                ⚠ {error}
                            </p>
                        )}

                        <button
                            onClick={handleManualSubmit}
                            disabled={loading || manualCode.length !== 8}
                            className="w-full py-3 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Validando...' : 'Validar código'}
                        </button>
                    </div>
                )}

                {!result && mode === 'qr' && error && (
                    <p className="text-center text-[10px] uppercase tracking-widest font-sans text-muted-foreground mt-3">
                        ⚠ {error}
                    </p>
                )}

                {!result && (
                    <div className="mt-8 border-t border-border pt-5">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans text-center">
                            {mode === 'qr'
                                ? '¿No puedes escanear? Usa el código manual'
                                : '¿Tienes el QR disponible? Usa la cámara'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}