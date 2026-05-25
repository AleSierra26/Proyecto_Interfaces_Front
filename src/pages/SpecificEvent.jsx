import { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { purchaseTicket, getEvent, getEventResales, purchaseResale, getMyTickets } from '../api';

export default function SpecificEvent() {
    const navigate = useNavigate();
    const { eventId } = useParams();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [showResales, setShowResales] = useState(false);
    const [resales, setResales] = useState([]);
    const [resalesLoading, setResalesLoading] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [hasTicket, setHasTicket] = useState(false);
    const [descExpanded, setDescExpanded] = useState(false);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        getEvent(eventId).then((data) => {
            if (data.event) setEvent(data.event);
            else setNotFound(true);
            setLoading(false);
        });

        getMyTickets(currentUser.id).then((data) => {
            const fetched = data.tickets || [];
            setTickets(fetched);
            const match = fetched.some((t) => String(t.event_id) === String(eventId));
            setHasTicket(match);
        });

        
    }, [eventId]);

    const handleOpenResales = async () => {
        setShowResales(true);
        setResalesLoading(true);
        const data = await getEventResales(eventId);
        setResales(data.resales || []);
        setResalesLoading(false);
    };

    const handlePurchase = async () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/auth');
            return;
        }

        navigate('/payment', {
            state: {
                eventId,
                eventTitle: event.title,
                eventVenue: event.venue,
                eventDate: event.date,
                price: event.price,
            }
        });
        // const data = await purchaseTicket(currentUser.id, eventId);

        // if (data.tickets) {
        //     const detailedTickets = data.tickets.map((ticket) => ({
        //         ...ticket,
        //         Title: event.title,
        //         eventId,
        //         Date: event.date,
        //         Time: event.time,
        //         Venue: event.venue,
        //         Price: event.price,
        //         Address: event.address,
        //     }));

        //     const existing = JSON.parse(localStorage.getItem('myTickets')) || [];
        //     localStorage.setItem('myTickets', JSON.stringify([...existing, ...detailedTickets]));
        //     navigate('/my-tickets');
        // }
    };

    const handlePurchaseResale = async (resaleId) => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/auth');
            return;
        }

        navigate('/payment', {
            state: {
                eventId,
                eventTitle: event.title,
                eventVenue: event.venue,
                eventDate: event.date,
                price: resales.find((r) => r.id === resaleId)?.price,
                resaleId,
            }
        });
        // const data = await purchaseResale(resaleId, currentUser.id);
        // if (data.ticket) {
        //     setShowResales(false);

        //     const detailedTicket = {
        //         ...data.ticket,
        //         Title: event.title,
        //         eventId,
        //         Date: event.date,
        //         Time: event.time,
        //         Venue: event.venue,
        //         Price: data.resale.price,
        //     };

        //     const existing = JSON.parse(localStorage.getItem('myTickets')) || [];
        //     localStorage.setItem('myTickets', JSON.stringify([...existing, detailedTicket]));
        //     navigate('/my-tickets');
        // }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background max-w-md md:max-w-2xl mx-auto px-4 pt-6 space-y-4">
                {/* Skeleton loading — Feedback: user knows content is arriving */}
                <div className="skeleton w-full aspect-[4/3] rounded-[10px]" />
                <div className="skeleton h-7 w-2/3 rounded" />
                <div className="skeleton h-4 w-1/3 rounded" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-5/6 rounded" />
            </div>
        );
    }

    if (notFound || !event) {
        return (
            <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col items-center justify-center gap-4 px-4">
                <p className="font-sans font-bold text-2xl tracking-widest">Evento no encontrado</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans text-center">
                    El evento que buscas no existe o ya no está disponible.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-2 px-6 py-2.5 border border-primary text-primary font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                    Volver
                </button>
            </div>
        );
    }

    const ticketsLeft = event.totalCapacity - event.soldTickets;
    const soldOut = ticketsLeft <= 0;
    const almostGone = !soldOut && ticketsLeft <= 15;
    const soldPct = event.totalCapacity > 0
        ? Math.min(100, Math.round((event.soldTickets / event.totalCapacity) * 100))
        : 0;
    const descLong = event.description && event.description.length > 180;

    return (
        <>
            {/* Resales modal */}
            {showResales && (
                <>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowResales(false)} />
                    <div className="fixed inset-0 flex items-end justify-center z-50 pointer-events-none">
                        <div className="bg-card w-full max-w-md rounded-t-[20px] pointer-events-auto pb-10 mb-16 max-h-[70vh] overflow-y-auto">

                            {/* Handle */}
                            <div className="flex justify-center pt-3 pb-4">
                                <div className="w-10 h-1 rounded-full bg-border" />
                            </div>

                            <div className="px-4 pb-2">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                                    ¡Reventas!
                                </p>
                                <h3 className="font-sans font-bold text-xl tracking-widest mb-4">
                                    Tickets en reventa
                                </h3>

                                {resalesLoading && (
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans py-8 text-center">
                                        Cargando...
                                    </p>
                                )}

                                {!resalesLoading && resales.length === 0 && (
                                    <div className="flex flex-col items-center py-10 gap-2">
                                        <p className="font-sans font-bold text-base tracking-widest">Sin reventas</p>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans text-center">
                                            No hay tickets en reventa para este evento
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {resales.map((resale) => (
                                        <div key={resale.id} className="flex items-center justify-between border border-border rounded-sm p-3 bg-background">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                                    <User className="w-4 h-4 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-sans font-medium text-sm text-foreground">
                                                        {resale.seller_name}
                                                    </p>
                                                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                                        Vendedor verificado
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="font-sans font-bold text-base">
                                                        ${resale.price.toLocaleString()}
                                                    </p>
                                                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                                        CLP
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handlePurchaseResale(resale.id)}
                                                    className="px-3 py-2 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                                                >
                                                    Comprar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

        <div className="min-h-screen bg-background max-w-md md:max-w-2xl mx-auto py-5 relative animate-fade-in">

            {/* Event image */}
            <div className="relative w-full aspect-[4/3] bg-muted rounded-[10px]">
                <div className="relative w-full aspect-[4/3] bg-muted cursor-pointer">
                    {event.image_url ? (
                        <img
                            src={event.image_url}
                            alt={event.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-muted-foreground/50 text-sm font-sans">Imagen Aquí!</span>
                        </div>
                    )}
                </div>
                {almostGone && (
                    <span className="absolute top-3 right-3 bg-background text-foreground text-[9px] uppercase tracking-widest font-sans font-medium px-2.5 py-1 rounded-[10px] border border-border">
                        ¡Últimos tickets!
                    </span>
                )}
                {event.status === 'finished' && (
                    <span className="absolute top-3 left-3 bg-muted text-muted-foreground text-[9px] uppercase tracking-widest font-sans font-medium px-2.5 py-1 rounded-[10px] border border-border">
                        Evento finalizado
                    </span>
                )}
            </div>

            <div className="px-4 pt-6 pb-40">

                {/* Title & price */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-sans font-bold text-2xl tracking-widest leading-tight">
                            {event.title}
                        </h2>
                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-sans">
                            Código de evento: {event.code}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-sans font-bold text-2xl">
                            {event.price === 0 ? 'GRATIS' : `$${event.price.toLocaleString()}`}
                        </p>
                        {event.price > 0 && (
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                CLP
                            </p>
                        )}
                    </div>
                </div>

                <div className="border-t border-border mb-6" />

                {/* Event details */}
                <div className="space-y-3 mb-6">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        Detalles
                    </p>
                    <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-sans text-foreground">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-sans text-foreground">{event.time}</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-sans text-foreground">{event.venue}</p>
                            <p className="text-xs font-sans text-muted-foreground mt-0.5">{event.address}</p>
                        </div>
                    </div>
                </div>

                {/*
                 * Availability progress bar — Visual Hierarchy + Feedback semántico:
                 * el color del bar cambia según urgencia (verde → amarillo → rojo)
                 * reforzando el mensaje sin necesidad de leer el texto.
                 * Gestalt Figure/Ground: la barra rellena contrasta con el fondo muted.
                 */}
                {event.totalCapacity > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-1.5">
                            <p className={`text-[10px] uppercase tracking-widest font-sans font-medium ${
                                soldOut ? 'text-destructive' :
                                almostGone ? 'text-foreground' :
                                'text-muted-foreground'
                            }`}>
                                {soldOut ? 'Agotado' : almostGone ? `¡Solo quedan ${ticketsLeft}!` : `${ticketsLeft} disponibles`}
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                                {soldPct}% vendido
                            </p>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                    soldOut     ? 'bg-destructive' :
                                    almostGone  ? 'bg-foreground'  :
                                    soldPct > 50 ? 'bg-foreground/70' :
                                    'bg-foreground/50'
                                }`}
                                style={{ width: `${soldPct}%` }}
                                role="progressbar"
                                aria-valuenow={soldPct}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`${soldPct}% de tickets vendidos`}
                            />
                        </div>
                    </div>
                )}

                <div className="border-t border-border mb-6" />

                {/* Description — Progressive Disclosure: truncate long text, reveal on demand */}
                <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mb-3">
                        Sobre el evento
                    </p>
                    <p className={`text-sm font-sans text-foreground leading-relaxed transition-all ${
                        descLong && !descExpanded ? 'line-clamp-3' : ''
                    }`}>
                        {event.description}
                    </p>
                    {descLong && (
                        <button
                            onClick={() => setDescExpanded((s) => !s)}
                            className="mt-2 flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground font-sans hover:text-foreground transition-colors"
                        >
                            {descExpanded ? (
                                <><ChevronUp className="w-3 h-3" aria-hidden="true" /> Leer menos</>
                            ) : (
                                <><ChevronDown className="w-3 h-3" aria-hidden="true" /> Leer más</>
                            )}
                        </button>
                    )}
                </div>

                <div className="border-t border-border mb-6" />

                {/* Organizer */}
                <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mb-3">
                        Organizador
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center flex-shrink-0">
                            {event.organizer_avatar ? (
                                <img
                                    src={event.organizer_avatar}
                                    alt={event.organizer_name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-4 h-4 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <p className="font-sans font-bold text-sm tracking-widest">
                                    {event.organizer_name}
                                </p>
                                <CheckCircle className="w-3.5 h-3.5 text-foreground" />
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mt-0.5">
                                Organiza eventos desde {event.organizer_since}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase bar */}
            <div className="fixed mb-2 bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md bg-background/95 backdrop-blur-sm border-t border-border px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {event.status === 'finished' ? (
                    /* Event finished state — both buttons replaced */
                    <div className="space-y-2">
                        <div className="w-full py-3 bg-muted text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] text-center">
                            Este evento ya finalizó
                        </div>
                        <div className="w-full py-3 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] text-center">
                            Este evento ya finalizó
                        </div>
                    </div>
                ) : (
                    /* Normal purchase state */
                    <div className="flex gap-2">
                        <button
                            disabled={soldOut || hasTicket}
                            onClick={handlePurchase}
                            className={`flex-1 py-3 font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] transition-all ${
                                soldOut || hasTicket
                                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                    : 'bg-primary text-primary-foreground hover:opacity-90'
                            }`}
                        >
                            {soldOut ? 'Agotado' : hasTicket ? 'Ya tienes un ticket' : 'Comprar ticket'}
                        </button>
                        <button
                            onClick={handleOpenResales}
                            disabled={hasTicket}
                            className={`flex-1 py-3 border border-border font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] transition-colors ${
                                hasTicket
                                    ? 'text-muted-foreground cursor-not-allowed'
                                    : 'text-muted-foreground hover:border-foreground hover:text-foreground'
                            }`}
                        >
                            Ver reventas
                        </button>
                    </div>
                )}
            </div>
        </div>
    </>
    );
}