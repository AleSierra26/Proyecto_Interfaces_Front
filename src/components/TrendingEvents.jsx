const events = [
  {
        id: 1,
        title: 'Concierto de Rock',
        date: 'OCT 25 - Sábado',
        price: '$45',
        priceLabel: 'Desde',
        venue: 'Auditorio Nacional',
        //image: 'https://source.unsplash.com/random/400x300?concert'
    },
    {
        id: 2,
        title: 'Festival de Jazz',
        date: 'OCT 25 - Sábado',
        price: '$45',
        priceLabel: 'Desde',
        venue: 'Parque Central',
        //image: 'https://source.unsplash.com/random/400x300?jazz'
    },
    {
        id: 3,
        title: 'Obra de Teatro',
        date: 'OCT 25 - Sábado',
        price: '$45',
        priceLabel: 'Desde',
        venue: 'Teatro Principal',
        //image: 'https://source.unsplash.com/random/400x300?theater'
    }
];

export default function TrendingEvents() {
  return (
    <section className="mt-8 px-4">
        {/* Section header */}
        <div className="flex items-end justify-between mb-4">
            <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                    En vivo
                </p>
                <h3 className="font-sans-serif font-bold text-xl tracking-zen">
                    Eventos en tendencia
                </h3>
            </div>
            <button className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans-serif hover:text-foreground transition-colors">
                Ver todo
            </button>
        </div>

        {/* Events cards */}
        <div className="space-y-5">
            {events.map((event) => (
                <div key={event.id} className="group cursor-pointer">
                    {/* Placeholder image for now */}
                    <div className="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-muted-foreground/50 text-sm font-sans">
                                Imagen Aquí!
                            </span>
                        </div>

                        {event.tag && (
                            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[9px] uppercase tracking-widest font-sans font-medium px-2.5 py-1 rounded-sm">
                                {event.tag}
                            </span>
                        )}
                    </div>

                    {/* Event info */}
                    <div className="mt-2.5 pb-4">
                        <h4 className="font-sans-serif font-bold text-base tracking-zen group-hover:text-accent transition-colors">
                            {event.title}
                        </h4>
                        <p className="text-xs text-muted-foreground font-sans mt-0.5">
                            {event.venue}
                            {event.date ? `- ${event.date}` : ''}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </section>
  );
}