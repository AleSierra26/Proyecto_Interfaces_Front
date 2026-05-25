import { useNavigate } from 'react-router-dom';
import { Music } from 'lucide-react';

const events = [
    { id: 1, title: 'Buinazo PUC',        date: 'OCT 25 · Sáb', price: '$150.000', venue: 'Auditorio Nacional' },
    { id: 2, title: 'Torneo Fortnite',     date: 'OCT 25 · Sáb', price: '$1.000',   venue: 'Parque Central' },
    { id: 3, title: 'Cumpleaños de Pablo', date: 'OCT 25 · Sáb', price: '$4.500',   venue: 'Teatro Principal' },
];

function EventSkeleton() {
    return (
        <div className="flex-none w-[72vw] max-w-[240px] snap-start md:w-auto md:max-w-none">
            <div className="skeleton w-full aspect-[3/4] rounded-[10px] mb-2" />
            <div className="skeleton h-3.5 w-3/4 rounded mb-1.5" />
            <div className="skeleton h-3 w-1/2 rounded mb-1.5" />
            <div className="skeleton h-3.5 w-1/3 rounded" />
        </div>
    );
}

export default function TrendingEvents() {
    const navigate = useNavigate();

    return (
        <section className="mt-7 animate-fade-in">

            {/* Section header — Visual Hierarchy: eyebrow (muted/small) + title (bold/large) */}
            <div className="flex items-end justify-between mb-4 px-4">
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        Destacados
                    </p>
                    <h3 className="font-sans font-bold text-xl tracking-zen">
                        En tendencia
                    </h3>
                </div>
                <button className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans hover:text-foreground transition-colors">
                    Ver todo
                </button>
            </div>

            {/*
             * Gestalt Continuity: la card parcialmente visible a la derecha
             * señala implícitamente que hay más contenido (affordance de scroll).
             * Responsive Design: carrusel en mobile → grid 3 columnas en desktop.
             */}
            <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pl-4 scrollbar-hide md:overflow-visible md:snap-none md:grid md:grid-cols-3 md:px-4 md:gap-4 pb-1">
                {events.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => navigate('/event/123456')}
                        /*
                         * Gestalt Similarity: todas las cards comparten
                         * dimensiones, radio y jerarquía interna idénticos.
                         */
                        className="flex-none w-[70vw] max-w-[240px] snap-start cursor-pointer group md:w-auto md:max-w-none transition-transform duration-200 hover:-translate-y-1"
                    >
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

                        {/* Info — Gestalt Proximity: apilado hermético = una sola unidad */}
                        <h4 className="font-sans font-bold text-sm tracking-zen group-hover:text-accent transition-colors truncate">
                            {event.title}
                        </h4>
                        <p className="text-[10px] text-muted-foreground font-sans mt-0.5 truncate">
                            {event.venue} · {event.date}
                        </p>
                        <p className="font-sans font-bold text-sm mt-1">
                            {event.price}
                            <span className="text-[9px] font-normal text-muted-foreground uppercase tracking-widest ml-1">CLP</span>
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
