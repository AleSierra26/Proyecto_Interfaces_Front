import { useState } from 'react';
import { Menu, User, MapPin, Calendar, Clock, Users, DollarSign, Tag, AlignLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
 
function FieldLabel({ children }) {
    return (
        <label className="block text-[10px] uppercase tracking-widest font-sans font-medium text-muted-foreground mb-1.5">
            {children}
        </label>
    );
}
 
function InputField({ icon: Icon, ...props }) {
    return (
        <div className="flex items-center gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-card">
            {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            <input
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
                {...props}
            />
        </div>
    );
}
 
function TextAreaField({ icon: Icon, ...props }) {
    return (
        <div className="flex items-start gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-card">
            {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />}
            <textarea
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans resize-none"
                rows={3}
                {...props}
            />
        </div>
    );
}
 
function SelectField({ icon: Icon, children, ...props }) {
    return (
        <div className="flex items-center gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-card">
            {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            <select
                className="flex-1 bg-transparent text-sm text-foreground outline-none font-sans appearance-none cursor-pointer"
                {...props}
            >
                {children}
            </select>
        </div>
    );
}
 
export default function CreateEventPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: '',
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
 
    const handleSubmit = (e) => {
        e.preventDefault();
        // Hook up to your backend here
        console.log('Event submitted:', form);
    };
 
    return (
        <div className="min-h-screen bg-background max-w-md mx-auto relative">
            <form onSubmit={handleSubmit} className="px-4 pb-32">
                {/* Page title */}
                    <h2 className="py-4 font-sans-serif font-bold text-2xl tracking-widest text-center">
                        Crear evento
                    </h2>
 
                {/* Divider */}
                <div className="border-t border-border mb-6" />
 
                {/* Basic info */}
                <div className="space-y-4 mb-6">
                    <div className='rounded-[10px]'>
                        <FieldLabel>Título del evento</FieldLabel>
                        <InputField
                            className='flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans'
                            icon={Tag}
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Ej. Concierto de Jazz en Vivo"
                            required
                        />
                    </div>
                    {/* <div className='flex items-center gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-card'>
                        <input
                            type='text'
                            placeholder='Buscar eventos, artistas o lugares'
                            className='flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans'
                            />
                    </div> */}
 
                    <div>
                        <FieldLabel>Descripción corta</FieldLabel>
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
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mb-4">
                        Fecha y hora
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FieldLabel>Fecha</FieldLabel>
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
                            <FieldLabel>Hora</FieldLabel>
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
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        Ubicación
                    </p>
                    <div>
                        <FieldLabel>Nombre del lugar</FieldLabel>
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
                        <FieldLabel>Dirección</FieldLabel>
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
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        Tickets
                    </p>
 
                    <div>
                        <FieldLabel>Tipo de entrada</FieldLabel>
                        <div className="flex gap-2">
                            {['paid', 'free'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setForm((p) => ({ ...p, priceLabel: type }))}
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
                            <FieldLabel>Precio (USD)</FieldLabel>
                            <InputField
                                icon={DollarSign}
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                disabled={form.priceLabel === 'free'}
                            />
                        </div>
                        <div>
                            <FieldLabel>Cupos disponibles</FieldLabel>
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
                        Publicar evento
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