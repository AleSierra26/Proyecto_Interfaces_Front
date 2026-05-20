import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMyEvents } from '../api';

export default function MyEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const data = await getMyEvents(currentUser.id);
        setEvents(data.events || []);
    }, []);

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto relative pb-20">

            {/* Manage events section */}
            <section className="flex flex-col items-center px-4 py-5 border-b border-border">
                <div className="flex flex-row gap-3 my-3 w-[50%]">
                    <button
                        onClick={() => navigate('/create-event')}
                        className='w-[100%] py-3 border border-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] bg-primary hover:opacity-90 transition-colors'
                    >
                        Crear evento
                    </button>
                </div>
            </section>

            {/* My Events section */}
            <section className="mt-8 px-4">
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Activos
                        </p>
                        <h3 className="font-sans font-bold text-xl tracking-widest">
                            Mis Eventos
                        </h3>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        {events.length} activos
                    </span>
                </div>

                {/* Empty state */}
                {events.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <p className="font-sans font-bold text-lg tracking-widest text-foreground">
                            Sin eventos aún
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans text-center">
                            Crea tu primer evento y aparecerá aquí
                        </p>
                        <button
                            onClick={() => navigate('/create-event')}
                            className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                        >
                            Crear evento
                        </button>
                    </div>
                )}

                {/* Events cards */}
                <div className="space-y-5">
                    {events.map((event) => (
                        <div key={event.code} className="border border-border rounded-[10px] bg-card overflow-hidden">

                            {/* Cover image */}
                            <div
                                onClick={() => navigate(`/event/${event.code}`)}
                                className="relative w-full aspect-[4/3] bg-muted cursor-pointer"
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-muted-foreground/50 text-sm font-sans">
                                        Imagen Aquí!
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">

                                {/* Title & price */}
                                <div
                                    onClick={() => navigate(`/event/${event.code}`)}
                                    className="flex items-start justify-between gap-4 cursor-pointer mb-4"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-sans font-bold text-base tracking-widest">
                                            {event.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground font-sans mt-0.5">
                                            {event.venue}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-sans font-bold text-base">
                                            {event.price === 0 ? 'GRATIS' : `$${event.price?.toLocaleString()}`}
                                        </p>
                                        {event.price > 0 && (
                                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                                CLP
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Date & time */}
                                <div className="flex gap-6 border-t border-border pt-3 mb-4">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                            Fecha
                                        </p>
                                        <p className="text-xs font-sans text-foreground mt-0.5">
                                            {event.date}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                            Hora
                                        </p>
                                        <p className="text-xs font-sans text-foreground mt-0.5">
                                            {event.time}
                                        </p>
                                    </div>
                                </div>

                                {/* Scanner button */}
                                <button
                                    onClick={() => navigate(`/scanner/${event.code}`)}
                                    className='w-full py-2.5 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity'
                                >
                                    📸 Escanear Invitados
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}