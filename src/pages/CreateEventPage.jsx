import { useState } from 'react';
import { MapPin, Calendar, Clock, Users, DollarSign, Tag, AlignLeft, CircleDollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { createEvent } from '../api';
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

export default function CreateEventPage() {
    const navigate = useNavigate();
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

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const [newEventCode, setNewEventCode] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Build both the display date and the raw ISO timestamp
        const rawDate = new Date(`${form.date}T${form.time}`);

        const newEvent = {
            code: uuidv4().slice(0, 6).toUpperCase(),
            title: form.title,
            description: form.description,
            date: rawDate.toLocaleDateString('es-CL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            rawDate: rawDate.toISOString(), // used by the cron job to mark event as finished
            time: form.time,
            venue: form.venue,
            address: form.address,
            price: form.priceLabel === 'free' ? 0 : Number(form.price),
            priceLabel: form.priceLabel,
            totalCapacity: Number(form.capacity),
            soldTickets: 0,
        };

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const data = await createEvent({ ...newEvent, organizerId: currentUser.id });
        if (data.error) { alert(data.error); return; }
        setNewEventCode(data.event.code); // show image upload after creation
    };

    if (newEventCode) {
        return (
            <div className="min-h-screen bg-background max-w-md mx-auto px-4 pt-10 pb-28">
                <p className="text-[12px] uppercase tracking-widest text-muted-foreground font-sans">Paso 2 de 2</p>
                <h2 className="font-sans font-bold text-2xl tracking-widest mb-6">Añade una imagen</h2>
                <EventImageUpload eventCode={newEventCode} onUpload={() => {}} />
                <button
                    onClick={() => navigate('/my-events')}
                    className="w-full py-3 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                >
                    Publicar evento
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto relative">
            <form onSubmit={handleSubmit} className="px-4 pb-32">

                <h2 className="py-4 font-sans font-bold text-2xl tracking-widest text-center">
                    Crear evento
                </h2>

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
                            <FieldLabel htmlFor="price">Precio (Coins)</FieldLabel>
                            <InputField
                                icon={CircleDollarSign}
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

                {/* Submit buttons */}
                <div className="space-y-3 pt-2">
                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                    >
                        Siguiente paso
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