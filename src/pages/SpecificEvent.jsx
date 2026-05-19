import { useState, useEffect } from 'react';
import { User, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { purchaseTicket } from '../api';

// Mock event database — replace each entry with a real API call later:
// const response = await fetch(`/api/events/${eventId}`);
// const event = await response.json();
const MOCK_EVENTS = {
    '123456': {
        title: 'Masivo Casa Dimitri',
        code: '123456',
        date: 'Sábado, 25 de Octubre 2025',
        time: '20:00 hrs',
        venue: 'Auditorio Nacional',
        address: 'Paseo de la Reforma 50, Santiago, Chile',
        price: 45000,
        totalCapacity: 200,
        soldTickets: 173,
        description: 'Vengan a tener una noche genial, con la mejor música y piscina. No se lo pueden perder, va a ser épico.',
        organizer: { name: 'Dimitri Vegas', memberSince: 'Mar 2026', eventsHosted: 34 },
    },
    '789012': {
        title: 'Torneo Fifa',
        code: '789012',
        date: 'Sábado, 1 de Noviembre 2025',
        time: '15:00 hrs',
        venue: 'Estación Central',
        address: 'Alameda 3322, Santiago, Chile',
        price: 1500,
        totalCapacity: 64,
        soldTickets: 20,
        description: 'El torneo de fútbol virtual más grande de Santiago. Inscríbete y demuestra que eres el mejor.',
        organizer: { name: 'GameZone CL', memberSince: 'Ene 2025', eventsHosted: 8 },
    },
};

export default function SpecificEvent() {
    const navigate = useNavigate();
    const { eventId } = useParams();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        // Simulate async fetch — swap this block for a real fetch() call when ready
        const found = MOCK_EVENTS[eventId];
        if (found) {
            setEvent(found);
        } else {
            setNotFound(true);
        }
        setLoading(false);
    }, [eventId]);

    const handlePurchase = async () => {
        const data = await purchaseTicket('user-123', eventId);

        if (data.tickets) {
            const detailedTickets = data.tickets.map((ticket) => ({
                ...ticket,
                Title: event.title,
                eventId: event.code,
                Date: event.date,
                Time: event.time,
                Venue: event.venue,
                Price: event.price,
                Address: event.address,
            }));

            const existing = JSON.parse(localStorage.getItem('myTickets')) || [];
            localStorage.setItem('myTickets', JSON.stringify([...existing, ...detailedTickets]));
            navigate('/my-tickets');
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-background max-w-md mx-auto flex items-center justify-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                    Cargando...
                </p>
            </div>
        );
    }

    // Not found state
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

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto py-5 relative">

            {/* Event image */}
            <div className="relative w-full aspect-[4/3] bg-muted rounded-[10px]">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground/50 text-sm font-sans">Imagen Aquí!</span>
                </div>
                {almostGone && (
                    <span className="absolute top-3 right-3 bg-background text-foreground text-[9px] uppercase tracking-widest font-sans font-medium px-2.5 py-1 rounded-[10px] border border-border">
                        ¡Últimos tickets!
                    </span>
                )}
            </div>

            <div className="px-4 pt-6 pb-32">

                {/* Title, price & event code */}
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
                            ${event.price.toLocaleString()}
                        </p>
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                            CLP
                        </p>
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

                <div className="border-t border-border mb-6" />

                {/* Description */}
                <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mb-3">
                        Sobre el evento
                    </p>
                    <p className="text-sm font-sans text-foreground leading-relaxed">
                        {event.description}
                    </p>
                </div>

                <div className="border-t border-border mb-6" />

                {/* Organizer */}
                <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mb-3">
                        Organizador
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <p className="font-sans font-bold text-sm tracking-widest">
                                    {event.organizer.name}
                                </p>
                                <CheckCircle className="w-3.5 h-3.5 text-foreground" />
                            </div>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mt-0.5">
                                {event.organizer.eventsHosted} eventos · desde {event.organizer.memberSince}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase bar */}
            <div className="fixed mb-2 bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md bg-background/95 backdrop-blur-sm border-t border-border px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <button
                    disabled={soldOut}
                    onClick={handlePurchase}
                    className={`w-full py-3 font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] transition-all ${
                        soldOut
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-primary text-primary-foreground hover:opacity-90'
                    }`}
                >
                    {soldOut ? 'Agotado' : 'Comprar 1 ticket'}
                </button>
            </div>
        </div>
    );
}