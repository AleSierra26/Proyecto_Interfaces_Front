import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const events = [
  {
        id: 1,
        title: 'Buinazo PUC',
        date: 'OCT 25 - Sábado',
        price: '$150000',
        venue: 'Auditorio Nacional',
        //image: 'https://source.unsplash.com/random/400x300?concert'
    },
    {
        id: 2,
        title: 'Torneo Fortnite',
        date: 'OCT 25 - Sábado',
        price: '$1000',
        venue: 'Parque Central',
        //image: 'https://source.unsplash.com/random/400x300?jazz'
    },
    {
        id: 3,
        title: 'Cumpleaños de Pablo',
        date: 'OCT 25 - Sábado',
        price: '$4500',
        venue: 'Teatro Principal',
        //image: 'https://source.unsplash.com/random/400x300?theater'
    }
];

export default function MyEvents() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto relative pb-20">

            <section className="mt-8 px-4">

                <div className="flex items-end justify-between mb-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Activos
                        </p>
                        <h3 className="font-sans-serif font-bold text-xl tracking-widest">
                            Mis Tickets
                        </h3>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        3 activos
                    </span>
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
                            </div>

                            {/* Event info */}
                            <div className="flex items-start justify-between pt-4 pb-6 cursor-pointer group">
                                <div className="flex-1 pr-4">
                                    <h4 className="font-sans font-bold text-base tracking-zen group-hover:text-accent transition-colors">
                                        {event.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground font-sans mt-0.5">
                                        {event.venue}
                                        {event.date ? `- ${event.date}` : ''}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <span className='font-sans font-bold text-base'>
                                        {event.price}
                                    </span>
                                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                        CLP
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
