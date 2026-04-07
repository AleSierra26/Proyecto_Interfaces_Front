import { MapPin } from 'lucide-react';

const upcomingEvents = [
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

export default function UpcomingEvents() {
    return (
        <section className="mt-10 px-4 pb-28">
            {/* Section header */}
            <div className="flex items-start justify-between mb-5">
                <h3 className='font-sans-serif font-bold text-lg uppercase tracking-zen'>
                    Próximos cerca de ti
                </h3>
                <div className='flex items-center gap-1 text-muted-foreground'>
                    <MapPin className='w-3.5 h-3.5' />
                    <span className='text-[10px] font-sans-serif uppercase tracking-widest'>
                        New York, NY
                    </span>
                </div>
            </div>

            {/* Events list */}
            <div className='space-y-0 divide-y divide-border'>
                {upcomingEvents.map((event) => (
                    <div key={event.id}
                        className='flex items-start justify-between py-4 cursor-pointer group'
                        >
                    <div className='flex-1 pr-4'>
                        <p className='text-[9px] uppercase tracking-widest text-muted-foreground font-sans font-medium'>
                            {event.dateLabel}
                        </p>
                        <h4 className='font-sans-serif font-bold text-sm mt-1 tracking-zen group-hover:text-accent transition-colors'>
                            {event.title}
                        </h4>
                        <p className='text-[11px] text-muted-foreground font-sans-serif mt-0.5'>
                            {event.venue}
                        </p>
                    </div>
                    
                    <div className='text-right flex-shrink-0'>
                        <span className='font-sans-serif font-bold text-base'>
                            {event.price}
                        </span>
                        {event.priceLabel && (
                            <p className='text-[8px] uppercase tracking-widest text-muted-foreground font-sans'>
                                {event.priceLabel}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </section>
    );
}