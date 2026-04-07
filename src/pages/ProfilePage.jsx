import { Menu, User, Pencil, Bookmark } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-background max-w-md mx-auto relative pb-20">

            {/* Profile section */}
            <section className="flex flex-col items-center px-4 pt-10 pb-8 border-b border-border">
                {/* Avatar with edit button */}
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground/50 text-xs font-sans">
                            Imagen Aquí!
                        </span>
                    </div>
                    <button
                        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-background"
                        aria-label="Edit photo"
                    >
                        <Pencil className="w-3 h-3 text-primary-foreground" />
                    </button>
                </div>

                {/* Name & meta */}
                <h2 className="font-sans-serif font-bold text-xl tracking-widest">
                    Cristóbal Campos
                </h2>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground font-sans-serif">
                    Miembro desde Oct 2023 · Premium
                </p>

                {/* Action buttons — matches SearchBar.jsx button styles */}
                <div className="flex gap-3 mt-5">
                    <button className="px-6 py-2.5 bg-primary text-primary-foreground font-sans-serif font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity">
                        Editar perfil
                    </button>
                    <button className="px-6 py-2.5 border border-primary text-primary font-sans-serif font-medium text-xs uppercase tracking-widest rounded-[10px] hover:bg-primary hover:text-primary-foreground transition-colors">
                        Ajustes
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
                            Mis Tickets
                        </h3>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        2 activos
                    </span>
                </div>

                {/* Ticket cards */}
                <div className="space-y-5">
                    {[
                        { id: 1, title: 'Concierto de Rock', date: 'Oct 25, 2024', venue: 'Auditorio Nacional', tag: 'Upcoming' },
                        { id: 2, title: 'Festival de Jazz', date: 'Nov 3, 2024', venue: 'Parque Central', tag: 'Upcoming' },
                    ].map((ticket) => (
                        <div key={ticket.id} className="group cursor-pointer border border-border rounded-sm overflow-hidden bg-card">
                            {/* Ticket image placeholder — matches TrendingEvents.jsx */}
                            <div className="relative w-full aspect-[4/3] bg-muted">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-muted-foreground/50 text-sm font-sans">
                                        Imagen Aquí!
                                    </span>
                                </div>
                                {ticket.tag && (
                                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[9px] uppercase tracking-widest font-sans-serif font-medium px-2.5 py-1 rounded-sm">
                                        {ticket.tag}
                                    </span>
                                )}
                                <button
                                    className="absolute top-3 right-3 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-sm flex items-center justify-center"
                                    aria-label="Guardar"
                                >
                                    <Bookmark className="w-4 h-4 text-foreground" />
                                </button>
                            </div>

                            {/* Ticket info — matches UpcomingEvents.jsx list row style */}
                            <div className="p-4">
                                <h4 className="font-sans-serif font-bold text-base tracking-widest group-hover:text-accent transition-colors">
                                    {ticket.title}
                                </h4>
                                <div className="flex gap-6 mt-3">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans font-medium">
                                            Fecha
                                        </p>
                                        <p className="text-xs font-sans mt-0.5 text-foreground">
                                            {ticket.date}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans font-medium">
                                            Lugar
                                        </p>
                                        <p className="text-xs font-sans mt-0.5 text-foreground">
                                            {ticket.venue}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
