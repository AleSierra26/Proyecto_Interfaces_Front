import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { QrCode, ArrowLeftRight, Ticket, ImageOff } from 'lucide-react';
import { getMyTickets, listForResale } from '../api';

function EventSkeleton() {
    return (
        <div className="border border-border rounded-[10px] bg-card overflow-hidden transition-transform duration-200 hover:-translate-y-1">
            <div className="skeleton w-full aspect-[4/3]" />
            <div className="p-3">
                <div className="skeleton h-3.5 w-full rounded mb-1.5" />
                <div className="skeleton h-3 w-1/2 rounded mb-1.5" />
                <div className="skeleton h-3.5 w-1/3 rounded" />
            </div>
        </div>
    );
}

export default function MyTickets() {

    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [showQrModal, setShowQrModal] = useState(false);
    const [showResaleModal, setShowResaleModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [resalePrice, setResalePrice] = useState('');
    const [resaleError, setResaleError] = useState('');
    const [resaleLoading, setResaleLoading] = useState(false);
    const [resaleSuccess, setResaleSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleQrOpen = (ticket) => {
        setSelectedTicket(ticket);
        setShowQrModal(true);
    };

    const handleResaleOpen = (ticket) => {
        setSelectedTicket(ticket);
        setResalePrice('');
        setResaleError('');
        setResaleSuccess(false);
        setShowResaleModal(true);
    };

    const handleResaleSubmit = async () => {
        const numericPrice = Number(resalePrice);
        const maxPrice = selectedTicket?.event_price ?? Infinity;

        if (!resalePrice || numericPrice < 0 || numericPrice > maxPrice) {
            setResaleError(`Ingresa un precio válido menor o igual a ${selectedTicket?.event_price}.`);
            return;
        }

        setResaleLoading(true);
        setResaleError('');

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const data = await listForResale(
            selectedTicket.id,
            currentUser.id,
            selectedTicket.event_id,
            Number(resalePrice)
        );

        setResaleLoading(false);

        if (data.error) {
            setResaleError(data.error);
            return;
        }

        setResaleSuccess(true);
    };

    useEffect(() => {
        const loadTickets = async () => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) return;

            setLoading(true);
            const data = await getMyTickets(currentUser.id);
            setTickets(data.tickets || []);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a short delay for better UX
            setLoading(false);
        };

        loadTickets();
    }, []);

    return (
        <>
            {/* Backdrops */}
            {showQrModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowQrModal(false)} />
            )}
            {showResaleModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55]" onClick={() => setShowResaleModal(false)} />
            )}

            <div className="min-h-screen bg-background max-w-md md:max-w-2xl mx-auto relative pb-24 px-4 animate-fade-in">

                {/* Header */}
                <div className="flex items-end justify-between my-6">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Activos
                        </p>
                        <h3 className="font-sans font-bold text-xl tracking-widest">
                            Mis Tickets
                        </h3>
                    </div>
                    {tickets.length > 0 && (
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <EventSkeleton key={index} />
                        ))}
                    </div>
                ) : (
                    <>
                        {/*
                         * Empty state — Feedback + Affordance: el estado vacío es
                         * informativo y guía al usuario hacia su próxima acción.
                         */}
                        {tickets.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 gap-3">
                                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-1">
                                    <Ticket className="w-6 h-6 text-muted-foreground/40" aria-hidden="true" />
                                </div>
                                <p className="font-sans font-bold text-lg tracking-widest text-foreground">
                                    Sin tickets aún
                                </p>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans text-center max-w-[200px]">
                                    Compra tu primer ticket y aparecerá aquí
                                </p>
                                <button
                                    onClick={() => navigate('/home')}
                                    className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                                >
                                    Explorar eventos
                                </button>
                            </div>
                        )}

                        {tickets.length > 0 && (
                            <div className="space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                                {/*
                                 * Ticket cards — Gestalt Closure: el borde redondeado y
                                 * la línea de puntos entre la imagen y la info evocan
                                 * visualmente la forma de un ticket físico, creando una
                                 * unidad perceptual reconocible.
                                 * Gestalt Similarity: todas las cards comparten la misma
                                 * estructura → el usuario sabe cómo leer cada una.
                                 */}
                                {tickets.map((ticket) => (
                                    <div key={ticket.id} className="border border-border rounded-[10px] bg-card overflow-hidden transition-transform duration-200 hover:-translate-y-1">
                                        {/* Cover image */}
                                        <div
                                            className="relative w-full aspect-[4/3] bg-muted cursor-pointer"
                                            onClick={() => navigate(`/event/${ticket.event_id}`)}
                                        >
                                            {ticket.event_image_url ? (
                                                <img
                                                    src={ticket.event_image_url}
                                                    alt={ticket.event_title}
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <ImageOff className="text-muted-foreground/50" />
                                                    <span className="text-muted-foreground/50 text-sm font-sans">No hay imagen para este evento</span>
                                                </div>
                                            )}
                                        </div>

                                        {/*
                                         * Perforación — Gestalt Closure: la serie de puntos
                                         * imita la línea de corte de un ticket físico. El
                                         * usuario reconoce el patrón sin instrucción verbal.
                                         */}
                                        <div className="flex items-center gap-0">
                                            <div className="w-4 h-4 rounded-full bg-background border border-border -ml-2 flex-shrink-0" />
                                            <div className="flex-1 border-t-2 border-dashed border-border mx-1" />
                                            <div className="w-4 h-4 rounded-full bg-background border border-border -mr-2 flex-shrink-0" />
                                        </div>

                                        {/* Ticket info */}
                                        <div className="p-4">
                                            {/* Title & price */}
                                            <div
                                                onClick={() => navigate(`/event/${ticket.event_id}`)}
                                                className="flex items-start justify-between gap-4 cursor-pointer mb-4"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="font-sans font-bold text-base tracking-widest">
                                                        {ticket.event_title}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground font-sans mt-0.5">
                                                        {ticket.event_venue}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-sans font-bold text-base">
                                                        {ticket.event_price?.toLocaleString()}
                                                    </p>
                                                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                                        Coins
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Cancelled badge */}
                                            {ticket.status === 'cancelled' && (
                                                <div className="flex items-center gap-2 bg-muted rounded-[10px] px-3 py-2 mb-3">
                                                    <p className="text-[10px] uppercase tracking-widest font-sans text-muted-foreground">
                                                        ⚠ Este evento fue cancelado · Ticket inválido
                                                    </p>
                                                </div>
                                            )}

                                            {/* Date & time */}
                                            <div className="flex gap-6 border-t border-border pt-3 mb-4">
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                                        Fecha
                                                    </p>
                                                    <p className="text-xs font-sans text-foreground mt-0.5">
                                                        {ticket.event_date}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                                        Hora
                                                    </p>
                                                    <p className="text-xs font-sans text-foreground mt-0.5">
                                                        {ticket.event_time}
                                                    </p>
                                                </div>
                                            </div>

                                            {/*
                                             * Actions — Visual Hierarchy: Ver QR es la acción
                                             * primaria (lo que el usuario necesita en la entrada),
                                             * Revender es secundaria (contorno).
                                             */}
                                            <div className="flex gap-2 border-t border-border pt-4">
                                                <button
                                                    onClick={() => handleQrOpen(ticket)}
                                                    disabled={ticket.status === 'cancelled'}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] transition-opacity ${
                                                        ticket.status === 'cancelled'
                                                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                                            : 'bg-primary text-primary-foreground hover:opacity-90'
                                                    }`}
                                                >
                                                    <QrCode className="w-3.5 h-3.5" aria-hidden="true" />
                                                    Mi QR
                                                </button>
                                                <button
                                                    onClick={() => handleResaleOpen(ticket)}
                                                    disabled={ticket.status === 'cancelled'}
                                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 border font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] transition-colors ${
                                                        ticket.status === 'cancelled'
                                                            ? 'border-border text-muted-foreground cursor-not-allowed'
                                                            : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                                                    }`}
                                                >
                                                    <ArrowLeftRight className="w-3.5 h-3.5" aria-hidden="true" />
                                                    Revender
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* QR Modal */}
            {showQrModal && selectedTicket && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-card p-6 text-center rounded-[10px] space-y-3 pointer-events-auto w-11/12 max-w-sm animate-fade-in">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Tu entrada
                        </p>
                        <h3 className="font-sans font-bold text-base tracking-widest">
                            {selectedTicket.event_title}
                        </h3>
                        <img
                            src={selectedTicket.qrCodeDataUrl}
                            alt="QR de entrada"
                            className="w-48 h-48 rounded-[10px] mx-auto block"
                        />
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                            Presenta este código QR en la entrada
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                            {selectedTicket.token?.slice(0, 8).toUpperCase()}
                        </p>
                        <button
                            onClick={() => setShowQrModal(false)}
                            className="w-full py-2.5 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}

            {/* Resale Modal */}
            {showResaleModal && selectedTicket && (
                <div className="fixed inset-0 flex items-end justify-center z-[60] pointer-events-none">
                    <div className="bg-card w-full max-w-md rounded-t-[20px] pointer-events-auto max-h-[70vh] overflow-y-auto pb-[max(4.5rem,env(safe-area-inset-bottom))]">

                        {/* Handle — affordance: el pill indica que el sheet es deslizable */}
                        <div className="flex justify-center pt-3 pb-4">
                            <div className="w-10 h-1 rounded-full bg-border" />
                        </div>

                        <div className="px-4">
                            {resaleSuccess ? (
                                <div className="flex flex-col items-center py-8 gap-3 text-center">
                                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-1">
                                        <ArrowLeftRight className="w-6 h-6 text-foreground" aria-hidden="true" />
                                    </div>
                                    <p className="font-sans font-bold text-base tracking-widest">
                                        ¡Ticket publicado!
                                    </p>
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                                        Tu ticket está ahora disponible en el mercado de reventas
                                    </p>
                                    <button
                                        onClick={() => setShowResaleModal(false)}
                                        className="mt-2 w-full py-3 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                                    >
                                        Listo
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                                        Mercado secundario
                                    </p>
                                    <h3 className="font-sans font-bold text-xl tracking-widest mb-1">
                                        Revender ticket
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-sans mb-6">
                                        {selectedTicket.event_title} · {selectedTicket.event_venue}
                                    </p>

                                    <div className="mb-4">
                                        <label className="block text-[10px] uppercase tracking-widest font-sans font-medium text-muted-foreground mb-1.5">
                                            Tu precio de venta (Coins)
                                        </label>
                                        <div className="flex items-center gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-background focus-within:border-foreground transition-colors">
                                            <input
                                                type="number"
                                                min="1"
                                                max={selectedTicket?.event_price ? selectedTicket.event_price - 1 : undefined}
                                                step="50"
                                                value={resalePrice}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;
                                                    const numericValue = Number(inputValue);
                                                    const maxPrice = selectedTicket?.event_price ?? Infinity;

                                                    if (!inputValue || (numericValue >= 0 && numericValue <= maxPrice)) {
                                                        setResalePrice(inputValue);
                                                        setResaleError('');
                                                    } else {
                                                        setResaleError(`El precio debe ser menor o igual a ${selectedTicket?.event_price}`);
                                                    }
                                                }}
                                                placeholder="Ej. 15000"
                                                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
                                            />
                                            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                                                Coins
                                            </span>
                                        </div>
                                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans mt-1.5">
                                            Precio original: {selectedTicket.event_price?.toLocaleString()} Coins
                                        </p>
                                    </div>

                                    {resaleError && (
                                        <p className="text-[10px] uppercase tracking-widest font-sans text-destructive mb-3">
                                            ⚠ {resaleError}
                                        </p>
                                    )}

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowResaleModal(false)}
                                            className="flex-1 py-3 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleResaleSubmit}
                                            disabled={resaleLoading}
                                            className="flex-1 py-3 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-40"
                                        >
                                            {resaleLoading ? 'Publicando...' : 'Publicar'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
