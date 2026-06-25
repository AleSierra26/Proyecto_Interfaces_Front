import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, User, Lock, Calendar, ChevronLeft, CheckCircle, CircleDollarSign } from 'lucide-react';
import { updateBalance } from '../api';

function FieldLabel({ htmlFor, children }) {
    return (
        <label htmlFor={htmlFor} className="block text-[10px] uppercase tracking-widest font-sans font-medium text-muted-foreground mb-1.5">
            {children}
        </label>
    );
}

function InputField({ icon: Icon, invalid, ...props }) {
    return (
        <div className={`flex items-center gap-2 border rounded-[10px] px-3 py-2.5 bg-card transition-colors ${
            invalid ? 'border-destructive' : 'border-border focus-within:border-foreground'
        }`}>
            {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" aria-hidden="true" />}
            <input
                aria-invalid={invalid || undefined}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
                {...props}
            />
        </div>
    );
}

function FieldError({ id, children }) {
    return (
        <p id={id} role="alert" className="text-[10px] uppercase tracking-widest text-destructive font-sans font-medium mt-1.5 flex items-center gap-1">
            <span aria-hidden="true">⚠</span> {children}
        </p>
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

    // pricing breakdown
    const [billPrice, setBillPrice] = useState(0);
    const serviceFee = Math.round(billPrice * 0.05); // 5% service fee
    const totalToPay = billPrice + serviceFee;

    const [form, setForm] = useState({
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: '',
        Coins: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'cardNumber') value = formatCardNumber(value);
        if (name === 'expiry') value = formatExpiry(value);
        if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 3);
        if (name === 'Coins') {
            value = value.replace(/\D/g, '');
            setBillPrice(Number(value));
        } 
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
        if (form.cvv.length != 3)
            newErrors.cvv = 'CVV inválido.';
        if (!form.Coins.trim())
            newErrors.Coins = 'Ingresa la cantidad de Coins.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            const firstInvalid = ['Coins', 'cardNumber', 'cardName', 'expiry', 'cvv']
                .find((field) => validationErrors[field]);
            if (firstInvalid) {
                document.getElementById(firstInvalid)?.focus();
            }
            return;
        }

        setLoading(true);

        // Simulate payment processing delay
        await new Promise((res) => setTimeout(res, 1500));

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        let data;
        data = await updateBalance(currentUser.id, currentUser.balance + billPrice);

        setLoading(false);

        if (data.error) {
            setErrors({ general: data.error });
            return;
        }
        localStorage.setItem('currentUser', JSON.stringify({...data.user, balance: currentUser.balance + billPrice}));
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
                        ¡Coins compradas!
                    </h2>
                    <h2 className="font-sans font-bold text-md tracking-widest mt-2">
                        Verás tu nuevo balance de Coins en tu perfil.
                    </h2>
                </div>
                <button
                    onClick={() => navigate('/profile')}
                    className="w-full py-3 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                >
                    Ver mi perfil
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
                    <p className="text-[12px] uppercase tracking-widest text-muted-foreground font-sans mb-3">
                        ¿Cuántas Coins quieres comprar?
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mb-3">
                        (Recuerda que 1 Coin = 1 CLP)
                    </p>
                    <div>
                        <FieldLabel htmlFor="Coins">Cantidad de Coins</FieldLabel>
                        <InputField
                            id="Coins"
                            icon={CircleDollarSign}
                            name="Coins"
                            value={form.Coins}
                            onChange={handleChange}
                            placeholder="0"
                            inputMode="numeric"
                            invalid={!!errors.Coins}
                            aria-describedby={errors.Coins ? 'err-Coins' : undefined}
                        />
                        {errors.Coins && <FieldError id="err-Coins">{errors.Coins}</FieldError>}
                    </div>
                </div>

                <div className="border-t border-border mb-6" />

                {/* Card form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <FieldLabel htmlFor="cardNumber">Número de tarjeta</FieldLabel>
                        <InputField
                            id="cardNumber"
                            icon={CreditCard}
                            name="cardNumber"
                            value={form.cardNumber}
                            onChange={handleChange}
                            placeholder="0000 0000 0000 0000"
                            inputMode="numeric"
                            autoComplete="cc-number"
                            invalid={!!errors.cardNumber}
                            aria-describedby={errors.cardNumber ? 'err-cardNumber' : undefined}
                        />
                        {errors.cardNumber && <FieldError id="err-cardNumber">{errors.cardNumber}</FieldError>}
                    </div>

                    <div>
                        <FieldLabel htmlFor="cardName">Nombre del titular</FieldLabel>
                        <InputField
                            id="cardName"
                            icon={User}
                            name="cardName"
                            value={form.cardName}
                            onChange={handleChange}
                            placeholder="Como aparece en la tarjeta"
                            autoComplete="cc-name"
                            invalid={!!errors.cardName}
                            aria-describedby={errors.cardName ? 'err-cardName' : undefined}
                        />
                        {errors.cardName && <FieldError id="err-cardName">{errors.cardName}</FieldError>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <FieldLabel htmlFor="expiry">Vencimiento</FieldLabel>
                            <InputField
                                id="expiry"
                                icon={Calendar}
                                name="expiry"
                                value={form.expiry}
                                onChange={handleChange}
                                placeholder="MM/AA"
                                inputMode="numeric"
                                autoComplete="cc-exp"
                                invalid={!!errors.expiry}
                                aria-describedby={errors.expiry ? 'err-expiry' : undefined}
                            />
                            {errors.expiry && <FieldError id="err-expiry">{errors.expiry}</FieldError>}
                        </div>
                        <div>
                            <FieldLabel htmlFor="cvv">CVV</FieldLabel>
                            <InputField
                                id="cvv"
                                icon={Lock}
                                name="cvv"
                                value={form.cvv}
                                onChange={handleChange}
                                placeholder="•••"
                                inputMode="numeric"
                                type="password"
                                autoComplete="cc-csc"
                                invalid={!!errors.cvv}
                                aria-describedby={errors.cvv ? 'err-cvv' : undefined}
                            />
                            {errors.cvv && <FieldError id="err-cvv">{errors.cvv}</FieldError>}
                        </div>
                    </div>

                    {errors.general && <FieldError id="err-general">{errors.general}</FieldError>}

                    <div className="border-t border-border pt-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                                Valor Coins a comprar
                            </p>
                            <p className="font-sans font-medium text-sm">
                                ${form.Coins ? parseInt(form.Coins) : 0} CLP
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