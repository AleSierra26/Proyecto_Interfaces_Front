import { Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// const events = [
//   {
//         id: 1,
//         title: 'Buinazo PUC',
//         date: 'OCT 25 - Sábado',
//         price: '$150000',
//         venue: 'Auditorio Nacional',
//         //image: 'https://source.unsplash.com/random/400x300?concert'
//     },
//     {
//         id: 2,
//         title: 'Torneo Fortnite',
//         date: 'OCT 25 - Sábado',
//         price: '$1000',
//         venue: 'Parque Central',
//         //image: 'https://source.unsplash.com/random/400x300?jazz'
//     },
//     {
//         id: 3,
//         title: 'Cumpleaños de Pablo',
//         date: 'OCT 25 - Sábado',
//         price: '$4500',
//         venue: 'Teatro Principal',
//         //image: 'https://source.unsplash.com/random/400x300?theater'
//     }
// ];

export default function MyTickets() {

    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const handleModalOpen = (ticket) => {
        setSelectedTicket(ticket);
        setShowModal(true);
    };
    const handleModal2Open = (ticket) => {
        setSelectedTicket(ticket);
        setShowModal2(true);
    };

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('myTickets')) || [];
        setTickets(saved);
    }, []);

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

                {/* Ticket cards */}
                <div className="space-y-6">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="border border-border rounded-[10px] bg-card overflow-hidden">
                            {/* Cover image */}
                            <div
                                onClick={() => navigate(`/event/${ticket.eventId}`)}
                                className="relative w-full aspect-[4/3] rounded-[10px] bg-muted cursor-pointer"
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-muted-foreground/50 text-sm font-sans">
                                        Imagen Aquí!
                                    </span>
                                </div>
                            </div>

                            {/* Ticket info */}
                            <div className="p-4">

                                {/* Title & price */}
                                <div
                                    onClick={() => navigate(`/event/${ticket.eventId}`)}
                                    className="flex items-start justify-between gap-4 cursor-pointer mb-4"
                                >
                                    <div className="flex-1">
                                        <h4 className="font-sans font-bold text-base tracking-widest">
                                            {ticket.Title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground font-sans mt-0.5">
                                            {ticket.Venue}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-sans font-bold text-base">
                                            ${ticket.Price?.toLocaleString()}
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
                                            {ticket.Date}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                            Hora
                                        </p>
                                        <p className="text-xs font-sans text-foreground mt-0.5">
                                            {ticket.Time}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 border-t border-border pt-4">
                                    <button
                                        onClick={() => handleModalOpen(ticket)}
                                        className="flex-1 py-2.5 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                                    >
                                        📸 Mi QR
                                    </button>
                                    <button
                                        onClick={() => handleModal2Open(ticket)}
                                        className="flex-1 py-2.5 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                                    >
                                        Revender
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* QR Modal */}
            {showModal && selectedTicket && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-card p-4 text-center rounded-[10px] space-y-3 pointer-events-auto w-11/12 max-w-sm">
                        <img src={selectedTicket.qrCodeDataUrl} alt="QR" className="w-48 h-48 rounded-[10px] mx-auto block" />
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans text-center">
                            Presenta este código QR en la entrada
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                            {selectedTicket.token.slice(0, 8).toUpperCase()}
                        </p>
                    </div>
                </div>
            )}
            {/* Revender Modal */}
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
