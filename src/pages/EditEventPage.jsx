import { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Users, DollarSign, Tag, AlignLeft, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEvent, updateEvent } from '../api';
import EventImageUpload from '../components/EventImageUpload';

function FieldLabel({ htmlFor, children }) {
    return (
        <label htmlFor={htmlFor} className="block text-[12px] uppercase tracking-widest font-sans font-medium text-muted-foreground mb-1.5">
            {children}
        </label>
    );
}

function InputField({ icon: Icon, ...props }) {
    return (
        <div className="flex items-center gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-card focus-within:border-foreground transition-colors">
            {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />}
            <input
                id={props.id ?? props.name}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
                {...props}
            />
        </div>
    );
}

function TextAreaField({ icon: Icon, ...props }) {
    return (
        <div className="flex items-start gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-card focus-within:border-foreground transition-colors">
            {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" aria-hidden="true" />}
            <textarea
                id={props.id ?? props.name}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans resize-none"
                rows={3}
                {...props}
            />
        </div>
    );
}

export default function EditEventPage() {
    const navigate = useNavigate();
    const { eventId } = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        address: '',
        capacity: '',
        price: '',
        priceLabel: 'paid',
    });

    useEffect(() => {
        getEvent(eventId).then((data) => {
            if (!data.event) { navigate(-1); return; }
            const e = data.event;
            setForm({
                title: e.title || '',
                description: e.description || '',
                date: e.date || '',
                time: e.time || '',
                venue: e.venue || '',
                address: e.address || '',
                capacity: e.total_capacity || '',
                price: e.price || '',
                priceLabel: e.price === 0 ? 'free' : 'paid',
            });
            setLoading(false);
        });
    }, [eventId]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        const data = await updateEvent(eventId, {
            title: form.title,
            description: form.description,
            date: form.date,
            time: form.time,
            venue: form.venue,
            address: form.address,
            price: form.priceLabel === 'free' ? 0 : Number(form.price),
            totalCapacity: Number(form.capacity),
        });

        setSaving(false);

        if (data.error) {
            setError(data.error);
            return;
        }

        navigate('/my-events');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background max-w-md mx-auto flex items-center justify-center">
                <p className="text-[12px] uppercase tracking-widest text-muted-foreground font-sans">
                    Cargando...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto relative">
            <form onSubmit={handleSubmit} className="px-4 pt-6 pb-32">

                {/* Back + title */}
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-[12px] uppercase tracking-widest font-sans">Volver</span>
                </button>

                <EventImageUpload
                    eventCode={eventId}
                    currentImageUrl={form.imageUrl}
                    onUpload={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
                />

                <div className="mb-6">
                    <p className="text-[12px] uppercase tracking-widest text-muted-foreground font-sans">
                        Editar
                    </p>
                    <h2 className="font-sans font-bold text-2xl tracking-widest">
                        Tu evento
                    </h2>
                </div>

                <div className="border-t border-border mb-6" />

                {/* Basic info */}
                <div className="space-y-4 mb-6">
                    <div>
                        <FieldLabel htmlFor="title">Título del evento</FieldLabel>
                        <InputField
                            icon={Tag}
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Ej. Concierto de Jazz en Vivo"
                            required
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor="description">Descripción corta</FieldLabel>
                        <TextAreaField
                            icon={AlignLeft}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe tu evento en pocas palabras..."
                        />
                    </div>
                </div>

                <div className="border-t border-border mb-6" />

                {/* Date & time */}
                <div className="mb-2">
                    <p className="text-[12px] uppercase tracking-widest text-muted-foreground font-sans mb-4">
                        Fecha y hora
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FieldLabel htmlFor="date">Fecha</FieldLabel>
                            <InputField
                                icon={Calendar}
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <FieldLabel htmlFor="time">Hora</FieldLabel>
                            <InputField
                                icon={Clock}
                                type="time"
                                name="time"
                                value={form.time}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="border-t border-border my-6" />

                {/* Location */}
                <div className="space-y-4 mb-6">
                    <p className="text-[12px] uppercase tracking-widest text-muted-foreground font-sans">
                        Ubicación
                    </p>
                    <div>
                        <FieldLabel htmlFor="venue">Nombre del lugar</FieldLabel>
                        <InputField
                            icon={MapPin}
                            name="venue"
                            value={form.venue}
                            onChange={handleChange}
                            placeholder="Ej. Auditorio Nacional"
                            required
                        />
                    </div>
                    <div>
                        <FieldLabel htmlFor="address">Dirección</FieldLabel>
                        <InputField
                            icon={MapPin}
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Calle, ciudad, país"
                        />
                    </div>
                </div>

                <div className="border-t border-border mb-6" />

                {/* Tickets */}
                <div className="space-y-4 mb-6">
                    <p className="text-[12px] uppercase tracking-widest text-muted-foreground font-sans">
                        Tickets
                    </p>
                    <div>
                        <span id="ticket-type-label" className="block text-[12px] uppercase tracking-widest font-sans font-medium text-muted-foreground mb-1.5">
                            Tipo de entrada
                        </span>
                        <div className="flex gap-2" role="group" aria-labelledby="ticket-type-label">
                            {['paid', 'free'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setForm((p) => ({ ...p, priceLabel: type }))}
                                    aria-pressed={form.priceLabel === type}
                                    className={`flex-1 py-2.5 text-xs uppercase tracking-widest rounded-[10px] font-sans font-medium border transition-colors ${
                                        form.priceLabel === type
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-card text-muted-foreground border-border hover:border-foreground'
                                    }`}
                                >
                                    {type === 'paid' ? 'De pago' : 'Gratuito'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FieldLabel htmlFor="price">Precio (CLP)</FieldLabel>
                            <InputField
                                icon={DollarSign}
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                step="50"
                                disabled={form.priceLabel === 'free'}
                            />
                        </div>
                        <div>
                            <FieldLabel htmlFor="capacity">Cupos disponibles</FieldLabel>
                            <InputField
                                icon={Users}
                                type="number"
                                name="capacity"
                                value={form.capacity}
                                onChange={handleChange}
                                placeholder="100"
                                min="1"
                                required
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <p role="alert" className="text-[12px] uppercase tracking-widest font-sans font-medium text-destructive mb-4 flex items-center gap-1">
                        <span aria-hidden="true">⚠</span> {error}
                    </p>
                )}

                {/* Submit buttons */}
                <div className="space-y-3 pt-2">
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full py-3 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}