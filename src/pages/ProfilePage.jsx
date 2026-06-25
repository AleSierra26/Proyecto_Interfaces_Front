import { useState, useEffect, useRef } from 'react';
import { Pencil, LogOut, Camera, Check, X, CircleDollarSign, CreditCard, User, Lock, Calendar, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, uploadAvatar, getSavedCards, addSavedCard, deleteSavedCard } from '../api';

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
        <p id={id} role="alert" className="text-[12px] uppercase tracking-widest text-destructive font-sans font-medium mt-1.5 flex items-center gap-1">
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

function brandLabel(brand) {
    return { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express' }[brand] || 'Tarjeta';
}

export default function ProfilePage() {
    const navigate = useNavigate();
    const avatarInputRef = useRef(null);

    const [user, setUser] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [avatarUploading, setAvatarUploading] = useState(false);

    // Saved cards
    const [cards, setCards] = useState([]);
    const [showAddCard, setShowAddCard] = useState(false);
    const [cardForm, setCardForm] = useState({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
    const [cardErrors, setCardErrors] = useState({});
    const [cardSaving, setCardSaving] = useState(false);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            setUser(currentUser);
            setForm({
                firstName: currentUser.first_name || '',
                lastName: currentUser.last_name || '',
                email: currentUser.email || '',
            });
            getSavedCards(currentUser.id).then((data) => {
                if (data.cards) setCards(data.cards);
            });
        }
    }, []);

    const handleEditOpen = () => {
        setSaveError('');
        setEditing(true);
    };

    const handleEditCancel = () => {
        // Reset form to current user data
        setForm({
            firstName: user.first_name || '',
            lastName: user.last_name || '',
            email: user.email || '',
        });
        setSaveError('');
        setEditing(false);
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveError('');

        const data = await updateProfile(user.id, {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
        });

        setSaving(false);

        if (data.error) {
            setSaveError(data.error);
            return;
        }

        // Update localStorage with new user data
        const updated = { ...user, ...data.user };
        localStorage.setItem('currentUser', JSON.stringify(updated));
        setUser(updated);
        setEditing(false);
    };

    const handleAvatarClick = () => {
        avatarInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatarUploading(true);
        const data = await uploadAvatar(user.id, file);
        setAvatarUploading(false);

        if (data.imageUrl) {
            const updated = { ...user, avatar_url: data.imageUrl };
            localStorage.setItem('currentUser', JSON.stringify(updated));
            setUser(updated);
        }
    };

    const handleAddCoins = async () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            navigate('/auth');
            return;
        }

        navigate('/payment');
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    // --- Card form handlers (same formatting/validation pattern as PaymentPage) ---

    const handleCardChange = (e) => {
        let { name, value } = e.target;
        if (name === 'cardNumber') value = formatCardNumber(value);
        if (name === 'expiry') value = formatExpiry(value);
        if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 3);
        setCardForm((prev) => ({ ...prev, [name]: value }));
        setCardErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateCard = () => {
        const newErrors = {};
        if (cardForm.cardNumber.replace(/\s/g, '').length < 16)
            newErrors.cardNumber = 'Número de tarjeta inválido.';
        if (!cardForm.cardName.trim())
            newErrors.cardName = 'Ingresa el nombre del titular.';
        if (cardForm.expiry.length < 5)
            newErrors.expiry = 'Fecha de vencimiento inválida.';
        if (cardForm.cvv.length != 3)
            newErrors.cvv = 'CVV inválido.';
        return newErrors;
    };

    const handleOpenAddCard = () => {
        setCardForm({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
        setCardErrors({});
        setShowAddCard(true);
    };

    const handleCancelAddCard = () => {
        setShowAddCard(false);
        setCardErrors({});
    };

    const handleAddCardSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateCard();
        if (Object.keys(validationErrors).length > 0) {
            setCardErrors(validationErrors);
            const firstInvalid = ['cardNumber', 'cardName', 'expiry', 'cvv']
                .find((field) => validationErrors[field]);
            if (firstInvalid) {
                document.getElementById(firstInvalid)?.focus();
            }
            return;
        }

        setCardSaving(true);

        const data = await addSavedCard(user.id, {
            cardholderName: cardForm.cardName,
            cardNumber: cardForm.cardNumber,
            expMonth: parseInt(cardForm.expiry.split('/')[0], 10),
            expYear: 2000 + parseInt(cardForm.expiry.split('/')[1], 10),
        });

        setCardSaving(false);

        if (data.error) {
            setCardErrors({ general: data.error });
            return;
        }

        setCards((prev) => [data.card, ...prev]);
        setCardForm({ cardNumber: '', cardName: '', expiry: '', cvv: '' });
        setShowAddCard(false);
    };

    const handleDeleteCard = async (cardId) => {
        await deleteSavedCard(cardId);
        setCards((prev) => prev.filter((c) => c.id !== cardId));
    };

    if (!user) return null;

    const displayName = user.first_name && user.last_name
        ? `${user.first_name} ${user.last_name}`
        : user.name || 'Usuario';

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto relative pb-28">

            {/* Profile section */}
            <section className="flex flex-col items-center px-4 pt-10 pb-8 border-b border-border">

                {/* Avatar */}
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                        {user.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-muted-foreground/50 text-xs font-sans">
                                Añade tu foto
                            </span>
                        )}
                        {avatarUploading && (
                            <div className="absolute inset-0 bg-background/70 flex items-center justify-center rounded-full">
                                <span className="text-[9px] uppercase tracking-widest font-sans text-muted-foreground">
                                    Subiendo...
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />

                    <button
                        onClick={handleAvatarClick}
                        disabled={avatarUploading}
                        className="absolute bottom-0 right-0 rounded-full bg-primary flex items-center justify-center border-2 border-background hover:opacity-90 transition-opacity disabled:opacity-40"
                        style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}
                        aria-label="Cambiar foto"
                    >
                        <Camera className="w-3 h-3 text-primary-foreground" />
                    </button>
                </div>

                {/* Name & meta */}
                <div className="flex flex-col items-center gap-2.5 text-center">
                    <h2 className="font-sans font-bold text-xl tracking-widest">
                        {displayName}
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                        <h2 className="font-sans font-bold text-l tracking-widest">Mis Coins: {user.balance} </h2>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Miembro desde {user.member_since}
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            {user.email}
                        </p>
                    </div>
                    <button
                        onClick={handleAddCoins}
                        className="flex items-center gap-1.5 px-3 py-2 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                    >
                        <CircleDollarSign className="w-4 h-4" />
                        Añadir Coins
                    </button>
                </div>
            </section>

            {/* Edit profile form */}
            <section className="px-4 pt-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Cuenta
                        </p>
                        <h3 className="font-sans font-bold text-lg tracking-widest">
                            Información personal
                        </h3>
                    </div>
                    {!editing && (
                        <button
                            onClick={handleEditOpen}
                            className="flex items-center gap-1.5 px-3 py-2 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                        >
                            <Pencil className="w-3 h-3" />
                            Editar
                        </button>
                    )}
                </div>

                {!editing ? (
                    /* Read-only view */
                    <div className="space-y-3 border border-border rounded-[10px] bg-card p-4">
                        <div>
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">Nombre</p>
                            <p className="text-sm font-sans text-foreground mt-0.5">{user.first_name}</p>
                        </div>
                        <div className="border-t border-border pt-3">
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">Apellido</p>
                            <p className="text-sm font-sans text-foreground mt-0.5">{user.last_name}</p>
                        </div>
                        <div className="border-t border-border pt-3">
                            <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-sans">Correo electrónico</p>
                            <p className="text-sm font-sans text-foreground mt-0.5">{user.email}</p>
                        </div>
                    </div>
                ) : (
                    /* Edit form */
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <FieldLabel>Nombre</FieldLabel>
                                <InputField
                                    type="text"
                                    value={form.firstName}
                                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                                    placeholder="Nombre"
                                />
                            </div>
                            <div>
                                <FieldLabel>Apellido</FieldLabel>
                                <InputField
                                    type="text"
                                    value={form.lastName}
                                    onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                                    placeholder="Apellido"
                                />
                            </div>
                        </div>
                        <div>
                            <FieldLabel>Correo electrónico</FieldLabel>
                            <InputField
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                placeholder="tu@correo.com"
                            />
                        </div>

                        {saveError && (
                            <p className="text-[10px] uppercase tracking-widest font-sans text-muted-foreground">
                                ⚠ {saveError}
                            </p>
                        )}

                        <div className="flex gap-2">
                            <button
                                onClick={handleEditCancel}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-40"
                            >
                                <Check className="w-3.5 h-3.5" />
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Saved cards */}
            <section className="px-4 pt-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                            Pagos
                        </p>
                        <h3 className="font-sans font-bold text-lg tracking-widest">
                            Tarjetas guardadas
                        </h3>
                    </div>
                    {!showAddCard && (
                        <button
                            onClick={handleOpenAddCard}
                            className="flex items-center gap-1.5 px-3 py-2 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Añadir
                        </button>
                    )}
                </div>

                {cards.length === 0 && !showAddCard && (
                    <p className="text-xs text-muted-foreground font-sans text-center py-6 border border-dashed border-border rounded-[10px]">
                        No tienes tarjetas guardadas
                    </p>
                )}

                <div className="space-y-2">
                    {cards.map((card) => (
                        <div
                            key={card.id}
                            className="flex items-center justify-between border border-border rounded-[10px] bg-card p-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-[8px] bg-muted flex items-center justify-center">
                                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-sans text-foreground">
                                        {brandLabel(card.brand)} •••• {card.last4}
                                    </p>
                                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans mt-0.5">
                                        {card.cardholder_name} · Vence {String(card.exp_month).padStart(2, '0')}/{card.exp_year}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDeleteCard(card.id)}
                                className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                                aria-label="Eliminar tarjeta"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add card form — same fields, formatting and error pattern as PaymentPage */}
                {showAddCard && (
                    <form onSubmit={handleAddCardSubmit} className="space-y-4 border border-border rounded-[10px] bg-card p-4 mt-2">
                        <div>
                            <FieldLabel htmlFor="cardNumber">Número de tarjeta</FieldLabel>
                            <InputField
                                id="cardNumber"
                                icon={CreditCard}
                                name="cardNumber"
                                value={cardForm.cardNumber}
                                onChange={handleCardChange}
                                placeholder="0000 0000 0000 0000"
                                inputMode="numeric"
                                autoComplete="cc-number"
                                invalid={!!cardErrors.cardNumber}
                                aria-describedby={cardErrors.cardNumber ? 'err-cardNumber' : undefined}
                            />
                            {cardErrors.cardNumber && <FieldError id="err-cardNumber">{cardErrors.cardNumber}</FieldError>}
                        </div>

                        <div>
                            <FieldLabel htmlFor="cardName">Nombre del titular</FieldLabel>
                            <InputField
                                id="cardName"
                                icon={User}
                                name="cardName"
                                value={cardForm.cardName}
                                onChange={handleCardChange}
                                placeholder="Como aparece en la tarjeta"
                                autoComplete="cc-name"
                                invalid={!!cardErrors.cardName}
                                aria-describedby={cardErrors.cardName ? 'err-cardName' : undefined}
                            />
                            {cardErrors.cardName && <FieldError id="err-cardName">{cardErrors.cardName}</FieldError>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <FieldLabel htmlFor="expiry">Vencimiento</FieldLabel>
                                <InputField
                                    id="expiry"
                                    icon={Calendar}
                                    name="expiry"
                                    value={cardForm.expiry}
                                    onChange={handleCardChange}
                                    placeholder="MM/AA"
                                    inputMode="numeric"
                                    autoComplete="cc-exp"
                                    invalid={!!cardErrors.expiry}
                                    aria-describedby={cardErrors.expiry ? 'err-expiry' : undefined}
                                />
                                {cardErrors.expiry && <FieldError id="err-expiry">{cardErrors.expiry}</FieldError>}
                            </div>
                            <div>
                                <FieldLabel htmlFor="cvv">CVV</FieldLabel>
                                <InputField
                                    id="cvv"
                                    icon={Lock}
                                    name="cvv"
                                    value={cardForm.cvv}
                                    onChange={handleCardChange}
                                    placeholder="•••"
                                    inputMode="numeric"
                                    type="password"
                                    autoComplete="cc-csc"
                                    invalid={!!cardErrors.cvv}
                                    aria-describedby={cardErrors.cvv ? 'err-cvv' : undefined}
                                />
                                {cardErrors.cvv && <FieldError id="err-cvv">{cardErrors.cvv}</FieldError>}
                            </div>
                        </div>

                        {cardErrors.general && <FieldError id="err-general">{cardErrors.general}</FieldError>}

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleCancelAddCard}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={cardSaving}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-40"
                            >
                                <Check className="w-3.5 h-3.5" />
                                {cardSaving ? 'Guardando...' : 'Guardar tarjeta'}
                            </button>
                        </div>
                    </form>
                )}
            </section>

            {/* Logout */}
            <section className="px-4 pt-6">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-red-500 hover:text-red-500 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión
                </button>
            </section>
        </div>
    );
}