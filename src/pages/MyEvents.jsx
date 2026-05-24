import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Plus, ScanLine, Pencil, Trash2, CalendarDays, AlertTriangle, Link, Check, Users, X } from 'lucide-react';
import { getMyEvents, deleteEvent, getEventAttendees } from '../api';

export default function MyEvents() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [copiedCode, setCopiedCode] = useState(null); // tracks which event was just copied
    const [showAttendees, setShowAttendees] = useState(false);
    const [attendees, setAttendees] = useState([]);
    const [attendeesLoading, setAttendeesLoading] = useState(false);
    const [attendeesEvent, setAttendeesEvent] = useState(null);

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
        if (data.error) { setDeleteError(data.error); return; }
        setEvents((prev) => prev.filter((e) => e.code !== selectedEvent.code));
        setShowDeleteConfirm(false);
        setSelectedEvent(null);
    };

    const handleCopyLink = (e, eventCode) => {
        e.stopPropagation(); // prevent navigating to the event
        const url = `${window.location.origin}/event/${eventCode}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedCode(eventCode);
            setTimeout(() => setCopiedCode(null), 2000); // reset after 2s
        });
    };

    const handleOpenAttendees = async (e, event) => {
        e.stopPropagation();
        setAttendeesEvent(event);
        setShowAttendees(true);
        setAttendeesLoading(true);
        const data = await getEventAttendees(event.code);
        setAttendees(data.attendees || []);
        setAttendeesLoading(false);
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
                    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4">
                        <div className="bg-card w-full max-w-sm rounded-[10px] p-6 pointer-events-auto space-y-4">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                                    <AlertTriangle className="w-5 h-5 text-foreground" />
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
                                <p className="text-[10px] uppercase tracking-widest font-sans text-muted-foreground text-center">
                                    ⚠ {deleteError}
                                </p>
                            )}

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

            {/* Attendees modal */}
            {showAttendees && attendeesEvent && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={() => setShowAttendees(false)}
                    />
                    <div className="fixed inset-0 flex items-end justify-center z-50 pointer-events-none">
                        <div className="bg-card w-full max-w-md rounded-t-[20px] pointer-events-auto pb-10 mb-16 max-h-[70vh] overflow-y-auto">

                            {/* Handle */}
                            <div className="flex justify-center pt-3 pb-2">
                                <div className="w-10 h-1 rounded-full bg-border" />
                            </div>

                            <div className="px-4 pt-2 pb-2">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                                            Lista de asistentes
                                        </p>
                                        <h3 className="font-sans font-bold text-lg tracking-widest">
                                            {attendeesEvent.title}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => setShowAttendees(false)}
                                        className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {attendeesLoading && (
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans py-8 text-center">
                                        Cargando...
                                    </p>
                                )}

                                {!attendeesLoading && attendees.length === 0 && (
                                    <div className="flex flex-col items-center py-10 gap-2">
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-1">
                                            <Users className="w-5 h-5 text-muted-foreground/40" />
                                        </div>
                                        <p className="font-sans font-bold text-base tracking-widest">
                                            Sin asistentes aún
                                        </p>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans text-center">
                                            Nadie ha comprado un ticket todavía
                                        </p>
                                    </div>
                                )}

                                {!attendeesLoading && attendees.length > 0 && (
                                    <>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mb-3">
                                            {attendees.filter(a => a.status !== 'cancelled').length} confirmado{attendees.filter(a => a.status !== 'cancelled').length !== 1 ? 's' : ''}
                                            {/* {attendees.some(a => a.status === 'cancelled') && ` · ${attendees.filter(a => a.status === 'cancelled').length} cancelado${attendees.filter(a => a.status === 'cancelled').length !== 1 ? 's' : ''}`} */}
                                        </p>
                                        <div className="space-y-2">
                                            {attendees.map((attendee) => (
                                                <div
                                                    key={attendee.id}
                                                    className={`flex items-center justify-between p-3 rounded-[10px] border ${
                                                        attendee.status === 'cancelled'
                                                            ? 'border-border bg-muted opacity-50'
                                                            : 'border-border bg-background'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                                            <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <p className="font-sans font-medium text-sm text-foreground">
                                                                {attendee.buyer_name}
                                                            </p>
                                                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                                                                {attendee.buyer_email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`text-[9px] uppercase tracking-widest font-sans font-medium px-2 py-1 rounded-[6px] ${
                                                        attendee.status === 'cancelled'
                                                            ? 'bg-muted text-muted-foreground'
                                                            : attendee.status === 'used'
                                                            ? 'bg-foreground text-background'
                                                            : 'bg-muted text-foreground'
                                                    }`}>
                                                        {attendee.status === 'cancelled' ? 'Cancelado'
                                                            : attendee.status === 'used' ? 'Ingresó'
                                                            : 'Confirmado'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <div className="min-h-screen bg-background max-w-md md:max-w-2xl mx-auto relative pb-24">

                {/* Header */}
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
                        <Plus className="w-3.5 h-3.5" />
                        Nuevo
                    </button>
                </section>

                <section className="mt-6 px-4">
                    {events.length > 0 && (
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mb-4">
                            Tienes {events.length} evento{events.length !== 1 ? 's' : ''}
                        </p>
                    )}

                    {/* Empty state */}
                    {events.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-1">
                                <CalendarDays className="w-6 h-6 text-muted-foreground/40" />
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
                                <Plus className="w-3.5 h-3.5" />
                                Crear evento
                            </button>
                        </div>
                    )}

                    <div className="space-y-5 md:grid md:grid-cols-2 md:gap-5 md:space-y-0">
                        {events.map((event) => (
                            <div key={event.code} className="border border-border rounded-[10px] bg-card overflow-hidden transition-transform duration-200 hover:-translate-y-1">

                                {/* Cover image with copy link button overlaid */}
                                <div
                                    onClick={() => navigate(`/event/${event.code}`)}
                                    className="relative w-full aspect-[4/3] bg-muted cursor-pointer"
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <CalendarDays className="w-10 h-10 text-muted-foreground/20" />
                                    </div>

                                    {/* Copy link button — top right corner of image */}
                                    <button
                                        onClick={(e) => handleCopyLink(e, event.code)}
                                        className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-background/90 backdrop-blur-sm border border-border text-foreground font-sans font-medium text-[9px] uppercase tracking-widest rounded-[10px] hover:bg-background transition-all"
                                        aria-label="Copiar enlace del evento"
                                    >
                                        {copiedCode === event.code ? (
                                            <>
                                                <Check className="w-3 h-3" />
                                                Copiado
                                            </>
                                        ) : (
                                            <>
                                                <Link className="w-3 h-3" />
                                                Compartir
                                            </>
                                        )}
                                    </button>
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

                                    {/* Action buttons */}
                                    <button
                                        onClick={() => navigate(`/scanner/${event.code}`)}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                                    >
                                        <ScanLine className="w-3.5 h-3.5" />
                                        Escanear Invitados
                                    </button>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={(e) => handleOpenAttendees(e, event)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                                        >
                                            <Users className="w-3 h-3" />
                                            Asistentes
                                        </button>
                                        <button
                                            onClick={() => navigate(`/edit-event/${event.code}`)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                                        >
                                            <Pencil className="w-3 h-3" />
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteOpen(event)}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
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