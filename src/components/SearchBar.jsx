import { Search } from 'lucide-react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {

    const navigate = useNavigate();
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [code, setCode] = useState('');

    const handleCodeClick = () => {
        setShowCodeInput(true);
    };

    return (
        <>
            {/* Blur overlay backdrop */}
            {showCodeInput && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowCodeInput(false)} />
            )}

            {/* Main content with blur effect when modal is open */}
            <div className={showCodeInput ? 'blur-sm pointer-events-none' : ''}>
                <div className='px-4 mt-5 space-y-3'>
                    {/* Code button */}
                    <button onClick={handleCodeClick} className='w-full py-3 border border-primary text-primary-foreground font-sans-serif font-medium text-xs uppercase tracking-widest rounded-[10px] bg-primary hover:bg-primary-foreground hover:text-primary transition-colors'>
                        Tengo un código
                    </button>
                    {/* Search input */}
                    <div className='flex items-center gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-card'>
                        <Search className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                        <input
                            type='text'
                            placeholder='Buscar eventos, artistas o lugares'
                            className='flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans'
                            />
                    </div>
                </div>
            </div>

            {/* Code input modal */}
            {showCodeInput && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-card p-4 rounded-[10px] space-y-3 pointer-events-auto w-11/12 max-w-sm">
                        <div className='flex items-center gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-card'>
                            <input
                                type='text'
                                placeholder='Ingresa tu código aquí'
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className='flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans'
                                />
                        </div>
                        <div className="space-y-3 pt-2">
                            <button
                                onClick={() => navigate(`/event/${code}`)} // Cambiar a la ruta real del evento
                                disabled={code.trim() === ''}
                                className="w-full py-3 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Buscar evento
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCodeInput(false)}
                                className="w-full py-3 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}