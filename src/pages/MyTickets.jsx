import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMyTickets, listForResale } from '../api';

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
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        getMyTickets(currentUser.id).then((data) => {
            setTickets(data.tickets || []);
        });
    }, []);

    return (
        <>
            {/* Backdrops */}
            {showQrModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowQrModal(false)} />
            )}
            {showResaleModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowResaleModal(false)} />
            )}

            <div className="min-h-screen bg-background max-w-md mx-auto relative pb-20 px-4">
                <div className="flex items-end justify-between my-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Activos
                        </p>
                        <h3 className="font-sans-serif font-bold text-xl tracking-widest">
                            Mis Tickets
                        </h3>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        Tienes {tickets.length} ticket(s)
                    </span>
                </div>

                {/* Empty state */}
                {tickets.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <p className="font-sans font-bold text-lg tracking-widest text-foreground">
                            Sin tickets aún
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans text-center">
                            Compra tu primer ticket y aparecerá aquí
                        </p>
                    </div>
                )}

                {/* Ticket cards */}
                <div className="space-y-6">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="border border-border rounded-[10px] bg-card overflow-hidden">

                            {/* Cover image */}
                            <div
                                onClick={() => navigate(`/event/${ticket.event_id}`)}
                                className="relative w-full aspect-[4/3] bg-muted cursor-pointer"
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-muted-foreground/50 text-sm font-sans">
                                        Imagen Aquí!
                                    </span>
                                </div>
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
                                            ${ticket.event_price?.toLocaleString()}
                                        </p>
                                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                            CLP
                                        </p>
                                    </div>
                                </div>

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

                                {/* Actions */}
                                <div className="flex gap-2 border-t border-border pt-4">
                                    <button
                                        onClick={() => handleQrOpen(ticket)}
                                        disabled={ticket.status === 'cancelled'}
                                        className={`flex-1 py-2.5 font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] transition-opacity ${
                                            ticket.status === 'cancelled'
                                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                                : 'bg-primary text-primary-foreground hover:opacity-90'
                                        }`}
                                    >
                                        📸 Mi QR
                                    </button>
                                    <button
                                        onClick={() => handleResaleOpen(ticket)}
                                        className={`flex-1 py-2.5 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] transition-colors ${
                                            ticket.status === 'cancelled'
                                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                                : 'bg-primary text-primary-foreground hover:border-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Revender
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* QR Modal */}
            {showQrModal && selectedTicket && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-card p-6 text-center rounded-[10px] space-y-3 pointer-events-auto w-11/12 max-w-sm">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Tu entrada
                        </p>
                        <h3 className="font-sans font-bold text-base tracking-widest">
                            {selectedTicket.event_title}
                        </h3>
                        <img
                            src={selectedTicket.qrCodeDataUrl}
                            alt="QR"
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
                <div className="fixed inset-0 flex items-end justify-center z-50 pointer-events-none">
                    <div className="bg-card w-full max-w-md rounded-t-[20px] pointer-events-auto pb-10 mb-16 max-h-[70vh] overflow-y-auto">

                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-4">
                            <div className="w-10 h-1 rounded-full bg-border" />
                        </div>

                        <div className="px-4">
                            {resaleSuccess ? (
                                /* Success state */
                                <div className="flex flex-col items-center py-8 gap-3 text-center">
                                    <p className="text-4xl">✅</p>
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
                                /* Price input state */
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
                                            Tu precio de venta (CLP)
                                        </label>
                                        <div className="flex items-center gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-background focus-within:border-foreground transition-colors">
                                            <span className="text-muted-foreground font-sans text-sm">$</span>
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
                                                CLP
                                            </span>
                                        </div>
                                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans mt-1.5">
                                            Precio original: ${selectedTicket.event_price?.toLocaleString()} CLP
                                        </p>
                                    </div>

                                    {resaleError && (
                                        <p className="text-[10px] uppercase tracking-widest font-sans text-muted-foreground mb-3">
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