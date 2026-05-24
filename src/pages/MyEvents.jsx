import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Plus, ScanLine, Pencil, Trash2, CalendarDays, AlertTriangle } from 'lucide-react';
import { getMyEvents, deleteEvent } from '../api';

export default function MyEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        const loadEvents = async () => {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const data = await getMyEvents(currentUser.id);
            setEvents(data.events || []);
        };
        loadEvents();
    }, []);

    const handleDeleteOpen = (event) => {
        setSelectedEvent(event);
        setDeleteError('');
        setShowDeleteConfirm(true);
    };

    const handleDelete = async () => {
        setDeleting(true);
        setDeleteError('');

        const data = await deleteEvent(selectedEvent.code);
        setDeleting(false);

        if (data.error) {
            setDeleteError(data.error);
            return;
        }

        setEvents((prev) => prev.filter((e) => e.code !== selectedEvent.code));
        setShowDeleteConfirm(false);
        setSelectedEvent(null);
    };

    return (
        <>
            {/* Delete confirmation modal */}
            {showDeleteConfirm && selectedEvent && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={() => setShowDeleteConfirm(false)}
                    />
                    {/*
                     * Modal centrado — Gestalt Figure/Ground: overlay oscuro
                     * empuja el modal al frente, reduciendo la carga cognitiva.
                     * Progressive Disclosure: sólo muestra los detalles del
                     * evento afectado cuando el usuario quiere eliminar.
                     */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4">
                        <div className="bg-card w-full max-w-sm rounded-[10px] p-6 pointer-events-auto space-y-4 animate-fade-in">
                            <div className="text-center">
                                {/* Gestalt Common Region: icono delimitado = señal de advertencia */}
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                                    <AlertTriangle className="w-5 h-5 text-foreground" aria-hidden="true" />
                                </div>
                                <p className="font-sans font-bold text-lg tracking-widest">
                                    ¿Eliminar evento?
                                </p>
                                <p className="text-sm font-sans text-foreground mt-2">
                                    {selectedEvent.title}
                                </p>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mt-2">
                                    Esta acción no se puede deshacer. Todos los tickets comprados quedarán inválidos.
                                </p>
                            </div>

                            {deleteError && (
                                <p className="text-[10px] uppercase tracking-widest font-sans text-destructive text-center">
                                    ⚠ {deleteError}
                                </p>
                            )}

                            {/* Visual Hierarchy: cancelar secundario, eliminar primario-destructivo */}
                            <div className="flex gap-2 pt-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-2.5 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 py-2.5 bg-foreground text-background font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-80 transition-opacity disabled:opacity-40"
                                >
                                    {deleting ? 'Eliminando...' : 'Sí, eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="min-h-screen bg-background max-w-md md:max-w-2xl mx-auto relative pb-24 animate-fade-in">

                {/*
                 * Header + CTA — Visual Hierarchy: título a la izquierda,
                 * botón de acción principal a la derecha (patrón F-scan).
                 * Gestalt Proximity: título y contador agrupados = misma
                 * unidad semántica.
                 */}
                <section className="flex items-center justify-between px-4 pt-6 pb-5 border-b border-border">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Organiza
                        </p>
                        <h3 className="font-sans font-bold text-xl tracking-widest">
                            Mis Eventos
                        </h3>
                    </div>
                    <button
                        onClick={() => navigate('/create-event')}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                    >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        Nuevo
                    </button>
                </section>

                <section className="mt-6 px-4">
                    {events.length > 0 && (
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mb-4">
                            Tienes {events.length} evento{events.length !== 1 ? 's' : ''}
                        </p>
                    )}

                    {/*
                     * Empty state — Affordance + Feedback: si no hay datos,
                     * se muestra un estado vacío con icono, mensaje claro y
                     * el mismo CTA primario para guiar la siguiente acción
                     * (no se deja al usuario sin camino).
                     */}
                    {events.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-1">
                                <CalendarDays className="w-6 h-6 text-muted-foreground/40" aria-hidden="true" />
                            </div>
                            <p className="font-sans font-bold text-lg tracking-widest text-foreground">
                                Sin eventos aún
                            </p>
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans text-center max-w-[200px]">
                                Crea tu primer evento y aparecerá aquí
                            </p>
                            <button
                                onClick={() => navigate('/create-event')}
                                className="mt-2 flex items-center gap-1.5 px-6 py-2.5 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                            >
                                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                Crear evento
                            </button>
                        </div>
                    )}

                    {/*
                     * Gestalt Similarity: todas las cards comparten la misma
                     * estructura (imagen → info → acciones), el usuario
                     * aprende el patrón en el primer card y lo aplica al resto.
                     */}
                    <div className="space-y-5 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
                        {events.map((event) => (
                            <div key={event.code} className="border border-border rounded-[10px] bg-card overflow-hidden transition-transform duration-200 hover:-translate-y-1">

                                {/* Cover image */}
                                <div
                                    onClick={() => navigate(`/event/${event.code}`)}
                                    className="relative w-full aspect-[4/3] bg-muted cursor-pointer"
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <CalendarDays className="w-10 h-10 text-muted-foreground/20" aria-hidden="true" />
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
                                                {event.price === 0 ? 'GRATIS' : `$${event.price?.toLocaleString()}`}
                                            </p>
                                            {event.price > 0 && (
                                                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                                    CLP
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date & time */}
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

                                    {/*
                                     * Acciones — Visual Hierarchy: escanear es la acción
                                     * primaria (botón relleno), editar/eliminar son
                                     * secundarias (botón contorno).
                                     * Lucide icons mejoran la affordance vs emojis.
                                     */}
                                    <button
                                        onClick={() => navigate(`/scanner/${event.code}`)}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                                    >
                                        <ScanLine className="w-3.5 h-3.5" aria-hidden="true" />
                                        Escanear Invitados
                                    </button>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => navigate(`/edit-event/${event.code}`)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                                        >
                                            <Pencil className="w-3 h-3" aria-hidden="true" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOpen(event)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-destructive hover:text-destructive transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" aria-hidden="true" />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
