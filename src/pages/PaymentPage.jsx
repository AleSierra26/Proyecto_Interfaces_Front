import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, User, Lock, Calendar, ChevronLeft, CheckCircle } from 'lucide-react';
import { purchaseTicket, purchaseResale } from '../api';

function FieldLabel({ children }) {
    return (
        <label className="block text-[10px] uppercase tracking-widest font-sans font-medium text-muted-foreground mb-1.5">
            {children}
        </label>
    );
}

function InputField({ icon: Icon, ...props }) {
    return (
        <div className="flex items-center gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-card focus-within:border-foreground transition-colors">
            {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            <input
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
                {...props}
            />
        </div>
    );
}

// Formats card number input as XXXX XXXX XXXX XXXX
function formatCardNumber(value) {
    return value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
}

// Formats expiry as MM/YY
function formatExpiry(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
}

export default function PaymentPage() {
    const navigate = useNavigate();
    const location = useLocation();

    // Event/resale info passed via navigate state from SpecificEvent
    const { eventId, eventTitle, eventVenue, eventDate, price, resaleId } = location.state || {};
    // pricing breakdown
    const ticketPrice = Number(price) || 0;
    const serviceFee = Math.round(ticketPrice * 0.05); // 5% service fee
    const totalToPay = ticketPrice + serviceFee;

    const [form, setForm] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'cardNumber') value = formatCardNumber(value);
        if (name === 'expiry') value = formatExpiry(value);
        if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (form.cardNumber.replace(/\s/g, '').length < 16)
            newErrors.cardNumber = 'Número de tarjeta inválido.';
        if (!form.cardName.trim())
            newErrors.cardName = 'Ingresa el nombre del titular.';
        if (form.expiry.length < 5)
            newErrors.expiry = 'Fecha de vencimiento inválida.';
        if (form.cvv.length < 3)
            newErrors.cvv = 'CVV inválido.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);

        // Simulate payment processing delay
        await new Promise((res) => setTimeout(res, 1500));

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let data;
        if (resaleId) {
            data = await purchaseResale(resaleId, currentUser.id);
        } else {
            data = await purchaseTicket(currentUser.id, eventId);
        }

        setLoading(false);

        if (data.error) {
            setErrors({ general: data.error });
            return;
        }

        setSuccess(true);
    };

    // Success screen
    if (success) {
        return (
            <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col items-center justify-center px-6 gap-5 text-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        Pago confirmado
                    </p>
                    <h2 className="font-sans font-bold text-2xl tracking-widest mt-1">
                        ¡Ticket comprado!
                    </h2>
                </div>
                <div className="w-full border border-border rounded-[10px] bg-card p-4 text-left space-y-3">
                    <div>
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">Evento</p>
                        <p className="text-sm font-sans font-medium text-foreground mt-0.5">{eventTitle}</p>
                    </div>
                    <div className="flex gap-6">
                        <div>
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">Lugar</p>
                            <p className="text-xs font-sans text-foreground mt-0.5">{eventVenue}</p>
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">Fecha</p>
                            <p className="text-xs font-sans text-foreground mt-0.5">{eventDate}</p>
                        </div>
                    </div>
                    <div className="border-t border-border pt-3 flex items-center justify-between">
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">Total pagado</p>
                        <p className="font-sans font-bold text-base">${price?.toLocaleString()} CLP</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/my-tickets')}
                    className="w-full py-3 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                >
                    Ver mis tickets
                </button>
                <button
                    onClick={() => navigate('/home')}
                    className="w-full py-3 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                >
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto pb-28">
            <div className="px-4 pt-6 pb-8">

                {/* Back + title */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-widest font-sans">Volver</span>
                </button>

                <div className="mb-6">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                        Pago seguro
                    </p>
                    <h2 className="font-sans font-bold text-2xl tracking-widest">
                        Datos de pago
                    </h2>
                </div>

                {/* Order summary */}
                <div className="border border-border rounded-[10px] bg-card p-4 mb-6 space-y-2">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mb-3">
                        Resumen de compra
                    </p>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="font-sans font-bold text-sm tracking-widest">{eventTitle}</p>
                            <p className="text-xs text-muted-foreground font-sans mt-0.5">{eventVenue}</p>
                            <p className="text-xs text-muted-foreground font-sans">{eventDate}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <p className="font-sans font-bold text-lg">${price?.toLocaleString()}</p>
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">CLP</p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border mb-6" />

                {/* Card form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <FieldLabel>Número de tarjeta</FieldLabel>
                        <InputField
                            icon={CreditCard}
                            name="cardNumber"
                            value={form.cardNumber}
                            onChange={handleChange}
                            placeholder="0000 0000 0000 0000"
                            inputMode="numeric"
                        />
                        {errors.cardNumber && (
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans mt-1">
                                ⚠ {errors.cardNumber}
                            </p>
                        )}
                    </div>

                    <div>
                        <FieldLabel>Nombre del titular</FieldLabel>
                        <InputField
                            icon={User}
                            name="cardName"
                            value={form.cardName}
                            onChange={handleChange}
                            placeholder="Como aparece en la tarjeta"
                        />
                        {errors.cardName && (
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans mt-1">
                                ⚠ {errors.cardName}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FieldLabel>Vencimiento</FieldLabel>
                            <InputField
                                icon={Calendar}
                                name="expiry"
                                value={form.expiry}
                                onChange={handleChange}
                                placeholder="MM/AA"
                                inputMode="numeric"
                            />
                            {errors.expiry && (
                                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans mt-1">
                                    ⚠ {errors.expiry}
                                </p>
                            )}
                        </div>
                        <div>
                            <FieldLabel>CVV</FieldLabel>
                            <InputField
                                icon={Lock}
                                name="cvv"
                                value={form.cvv}
                                onChange={handleChange}
                                placeholder="•••"
                                inputMode="numeric"
                                type="password"
                            />
                            {errors.cvv && (
                                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans mt-1">
                                    ⚠ {errors.cvv}
                                </p>
                            )}
                        </div>
                    </div>

                    {errors.general && (
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">
                            ⚠ {errors.general}
                        </p>
                    )}

                    <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                                Precio del ticket
                            </p>
                            <p className="font-sans font-medium text-sm">
                                ${ticketPrice.toLocaleString()} CLP
                            </p>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                                Costos de servicio (5%)
                            </p>
                            <p className="font-sans font-medium text-sm">
                                ${serviceFee.toLocaleString()} CLP
                            </p>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                                Total a pagar
                            </p>
                            <p className="font-sans font-bold text-xl">
                                ${totalToPay.toLocaleString()} CLP
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Procesando pago...' : 'Confirmar pago'}
                        </button>
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans text-center mt-3">
                            🔒 Pago simulado · Ningún cargo real será efectuado
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}