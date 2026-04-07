import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const events = [
  {
        id: 1,
        title: 'Ahoguemos las penas',
        date: 'OCT 25 - Sábado',
        price: '$GRATIS',
        venue: 'Auditorio Nacional',
        //image: 'https://source.unsplash.com/random/400x300?concert'
    },
    {
        id: 2,
        title: 'Torneo Fifa',
        date: 'OCT 25 - Sábado',
        price: '$1500',
        venue: 'Estación Central',
        //image: 'https://source.unsplash.com/random/400x300?jazz'
    },
];

export default function MyEvents() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto relative pb-20">

            {/* Manage events section */}
            <section className="flex flex-col items-center px-4 py-5 border-b border-border">

                <div className="flex flex-row gap-3 my-3 w-[50%]">
                    <button onClick={() => navigate('/create-event')} className='w-[100%] py-3 border border-primary text-primary-foreground font-sans-serif font-medium text-xs uppercase tracking-widest rounded-[10px] bg-primary hover:opacity-90 transition-colors'>
                        Crear evento
                    </button>
                </div>
            </section>

            {/* My Tickets section */}
            <section className="mt-8 px-4">
                {/* Section header — matches TrendingEvents.jsx */}
                <div className="flex items-end justify-between mb-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Activos
                        </p>
                        <h3 className="font-sans-serif font-bold text-xl tracking-widest">
                            Mis Eventos
                        </h3>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        2 activos
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
