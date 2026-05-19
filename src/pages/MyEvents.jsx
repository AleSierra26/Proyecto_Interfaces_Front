import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

export default function MyEvents() {

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    
    const handleModalOpen = () => {
        setShowModal(true);
    };

    return (
        <>
            {/* Blur overlay backdrop */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
            )}
        
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
                        {Object.values(MOCK_EVENTS).map((event) => (
                            <div key={event.code} className="border border-border rounded-[10px] bg-card overflow-hidden">
                                {/* Placeholder image for now */}
                                <div onClick={() => navigate(`/event/${event.code}`)} className="relative w-full aspect-[4/3] rounded-[10px] bg-muted cursor-pointer">
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
                                                ${event.price?.toLocaleString()}
                                            </p>
                                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                                CLP
                                            </p>
                                        </div>
                                    </div>

                                    {/* Date & time row */}
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

                                    <button onClick={() => navigate(`/scanner/${event.code}`)} className='w-full flex-1 py-2.5 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity'>
                                        📸 Escanear Invitados
                                    </button>
                                    
                                </div>


                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Work In Progress Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-card p-4 text-center rounded-[10px] space-y-3 pointer-events-auto w-11/12 max-w-sm">
                        <h2 className='text-[40px]'>⚠️</h2>
                        <h2>
                            ¡Estamos trabajando en esta funcionalidad! Pronto podrás escanear los códigos QR de tus invitados para verificar su asistencia.
                        </h2>
                    </div>
                </div>
            )}
        </>
    );
}
