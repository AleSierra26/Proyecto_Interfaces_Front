import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);

    const handleModalOpen = () => {
        setShowModal(true);
    };
    const handleModal2Open = () => {
        setShowModal2(true);
    };

    return (
        <>
            {/* Blur overlay backdrop */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
            )}
            {showModal2 && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowModal2(false)} />
            )}

            <div className="min-h-screen bg-background max-w-md mx-auto relative pb-20">
                <div className="flex items-end justify-between my-4">
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
                            <div onClick={() => navigate('/event/123456')} className="relative w-full aspect-[4/3] rounded-[10px] overflow-hidden bg-muted">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-muted-foreground/50 text-sm font-sans">
                                        Imagen Aquí!
                                    </span>
                                </div>
                            </div>

                            <button onClick={handleModalOpen} className='w-full mt-3 mb-2 py-3 border border-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] bg-primary hover:opacity-90 transition-colors'>
                                    📸 Mi QR
                            </button>
                            <button onClick={handleModal2Open} className='w-full py-3 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:bg-primary-foreground hover:text-primary hover:border-primary transition-colors'>
                                Revender Ticket
                            </button>

                            {/* Event info */}
                            <div onClick={() => navigate('/event/123456')} className="flex items-start justify-between pt-1 pb-6 cursor-pointer group">
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
            </div>

            {/* Work In Progress Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-card p-4 text-center rounded-[10px] space-y-3 pointer-events-auto w-11/12 max-w-sm">
                        <h2 className='text-[40px]'>⚠️</h2>
                        <h2>
                            ¡Estamos trabajando en esta funcionalidad! Pronto podrás mostros tu código QR del evento para verificar tu asistencia con el organizador.
                        </h2>
                    </div>
                </div>
            )}
            {showModal2 && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-card p-4 text-center rounded-[10px] space-y-3 pointer-events-auto w-11/12 max-w-sm">
                        <h2 className='text-[40px]'>⚠️</h2>
                        <h2>
                            ¡Estamos trabajando en esta funcionalidad! Pronto podrás revender tus tickets.
                        </h2>
                    </div>
                </div>
            )}
        </>
    );
}
