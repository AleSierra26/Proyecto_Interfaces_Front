import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight } from 'lucide-react';

const upcomingEvents = [
    { id: 1, title: 'Concierto de Rock', date: 'OCT 25 · Sáb', price: '$2.500', venue: 'Auditorio Nacional' },
    { id: 2, title: 'Festival de Jazz', date: 'NOV 2 · Dom', price: '$5.000', venue: 'Parque Central' },
    { id: 3, title: 'Obra de Teatro', date: 'NOV 10 · Lun', price: '$10.000', venue: 'Teatro Principal' },
];

export default function UpcomingEvents() {
    const navigate = useNavigate();

    return (
        <section className="mt-10 px-4 pb-28 animate-fade-in">

            {/* Section header — Visual Hierarchy: title > location chip */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        Cerca de ti
                    </p>
                    <h3 className="font-sans font-bold text-xl tracking-zen">
                        Próximos eventos
                    </h3>
                </div>
                {/* Location chip — Gestalt Closure: pill shape implies a self-contained datum */}
                <div className="flex items-center gap-1 bg-muted rounded-full px-2.5 py-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" aria-hidden="true" />
                    <span className="text-[9px] font-sans uppercase tracking-widest text-muted-foreground">
                        Santiago
                    </span>
                </div>
            </div>

            {/*
             * Gestalt Continuity: dividers guide the eye down the list.
             * Responsive Design: 2-column grid on md+.
             */}
            <div className="divide-y divide-border md:divide-y-0 md:grid md:grid-cols-2 md:gap-3">
                {upcomingEvents.map((event) => (
                    <div
                        key={event.id}
                        onClick={() => navigate('/event/123456')}
                        /* Gestalt Similarity: all list rows share the same layout and spacing */
                        className="flex items-start justify-between py-4 cursor-pointer group md:border md:border-border md:rounded-[10px] md:p-4 md:hover:border-foreground md:transition-colors"
                    >
                        <div className="flex-1 pr-4">
                            {/* Visual Hierarchy: date (smallest) → title (bold) → venue (muted) */}
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans font-medium">
                                {event.date}
                            </p>
                            <h4 className="font-sans font-bold text-sm mt-1 tracking-zen group-hover:text-accent transition-colors">
                                {event.title}
                            </h4>
                            <p className="text-[11px] text-muted-foreground font-sans mt-0.5">
                                {event.venue}
                            </p>
                        </div>

                        {/* Price — right-aligned secondary info */}
                        <div className="text-right flex-shrink-0 flex items-center gap-1">
                            <div>
                                <span className="font-sans font-bold text-sm">
                                    {event.price}
                                </span>
                                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                    CLP
                                </p>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-1" aria-hidden="true" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
