import { useState } from 'react';
import { Menu, User, MapPin, Calendar, Clock, Users, ChevronLeft, Share2, Bookmark, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 
// Datos de ejemplo, en un caso real vendrían de una API
const event = {
    title: 'Masivo Casa Dimitri',
    code: '123456',
    date: 'Sábado, 25 de Octubre 2025',
    time: '20:00 hrs',
    venue: 'Auditorio Nacional',
    address: 'Paseo de la Reforma 50, Santiago, Chile',
    price: 45000,
    totalCapacity: 200,
    soldTickets: 173,
    description:
        'Vengan a tener una noche genial, con la mejor música y piscina. No se lo pueden perder, va a ser épico.',
    organizer: {
        name: 'Dimitri Vegas',
        memberSince: 'Mar 2026',
        eventsHosted: 34,
    },
};
 
export default function SpecificEvent() {
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [saved, setSaved] = useState(false);
 
    const ticketsLeft = event.totalCapacity - event.soldTickets;
    const soldOut = ticketsLeft <= 0;
    const almostGone = !soldOut && ticketsLeft <= 15;
    const soldPercent = Math.round((event.soldTickets / event.totalCapacity) * 100);
 
    return (
        <div className="min-h-screen bg-background max-w-md mx-auto py-5 relative">

            {/* Imagen del evento */}
            <div className="relative w-full aspect-[4/3] bg-muted rounded-[10px]">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground/50 text-sm font-sans-serif">Imagen Aquí!</span>
                </div>
                {almostGone && (
                    <span className="absolute top-3 right-3 bg-background text-foreground text-[9px] uppercase tracking-widest font-sans font-medium px-2.5 py-1 rounded-[10px] border border-border">
                        ¡Últimos tickets!
                    </span>
                )}
            </div>
 
            <div className="px-4 pt-6 pb-32">

                {/* Titulo, precio y código de evento */}
                <div className="flex items-start justify-between gap-4 mb-6">
                    <div className="flex flex-col items-left gap-2">
                        <h2 className="font-sans font-bold text-2xl tracking-widest leading-tight flex-1">
                            {event.title}
                        </h2>
                        <p className='text-[11px] uppercase tracking-widest text-muted-foreground font-sans'>
                            Código de evento: {event.code}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-sans font-bold text-2xl">
                            ${event.price}
                        </p>
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                            CLP
                        </p>
                    </div>
                </div>

                <div className="border-t border-border mb-6" />
 
                {/* Datos del evento */}
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
 
                {/* <div className="border-t border-border mb-6" />
 
                Disponibilidad
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Disponibilidad
                        </p>
                        <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-muted-foreground" />
                            {soldOut ? (
                                <span className="text-[10px] uppercase tracking-widest font-sans font-medium text-muted-foreground">
                                    Agotado
                                </span>
                            ) : (
                                <span className="text-[10px] uppercase tracking-widest font-sans font-medium text-foreground">
                                    {ticketsLeft} restantes
                                </span>
                            )}
                        </div>
                    </div>
                    
                    Barra de progreso
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-foreground rounded-full transition-all"
                            style={{ width: `${soldPercent}%` }}
                        />
                    </div>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans mt-1.5">
                        {soldPercent}% vendido · {event.soldTickets} de {event.totalCapacity} tickets
                    </p>
                </div> */}
 
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
                    <div className="flex items-center justify-between">
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
            </div>
 
            {/* Purchase bar — fixed at bottom */}
            <div className="fixed mb-2 bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md bg-background/95 backdrop-blur-sm border-t border-border px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {/* {!soldOut && (
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Cantidad
                        </p>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="w-7 h-7 rounded-sm border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors flex items-center justify-center"
                            >
                                −
                            </button>
                            <span className="font-serif font-bold text-base w-4 text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity((q) => Math.min(ticketsLeft, q + 1))}
                                className="w-7 h-7 rounded-sm border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>
                        <p className="font-sans font-bold text-base">
                            ${(event.price * quantity).toFixed(2)}
                        </p>
                    </div>
                )} */}
 
                <button
                    disabled={soldOut}
                    className={`w-full py-3 font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] transition-all ${
                        soldOut
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-primary text-primary-foreground hover:opacity-90'
                    }`}
                >
                    {/* {soldOut ? 'Agotado' : `Comprar ${quantity > 1 ? `${quantity} tickets` : 'ticket'}`} */}
                    {soldOut ? 'Agotado' : 'Comprar 1 ticket'}
                </button>
            </div>
        </div>
    );
}