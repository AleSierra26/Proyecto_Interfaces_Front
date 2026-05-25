import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { login, signup } from '../api';

function FieldLabel({ children }) {
    return (
        <label className="block text-[10px] uppercase tracking-widest font-sans font-medium text-muted-foreground mb-1.5">
            {children}
        </label>
    );
}

function InputField({ icon: Icon, rightElement, ...props }) {
    return (
        <div className="flex items-center gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-card focus-within:border-foreground transition-colors">
            {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            <input
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans focus-visible:ring-0 focus-visible:ring-offset-0"
                {...props}
            />
            {rightElement}
        </div>
    );
}

export default function AuthPage({ mode: initialMode = 'login' }) {
    const navigate = useNavigate();
    const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (mode === 'signup') {
            const data = await signup(form.firstName, form.lastName, form.email, form.password);
            if (data.error) { setError(data.error); return; }
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            navigate('/home');
        } else {
            const data = await login(form.email, form.password);
            if (data.error) { setError(data.error); return; }
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            navigate('/home');
        }
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setError('');
        setForm({ firstName: '', lastName: '', email: '', password: '' });
    };

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col px-6 pt-10 pb-28">

            {/* Page intro */}
            <div className="mb-8">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                    {mode === 'signup' ? 'Registro' : 'Acceso'}
                </p>
                <h2 className="font-sans font-bold text-2xl tracking-widest mt-1">
                    {mode === 'signup' ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}
                </h2>
            </div>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-8">
                <button
                    onClick={() => switchMode('login')}
                    className={`flex-1 py-2.5 text-xs uppercase tracking-widest font-sans font-medium rounded-[10px] border transition-colors ${
                        mode === 'login'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-muted-foreground border-border hover:border-foreground'
                    }`}
                >
                    Iniciar Sesión
                </button>
                <button
                    onClick={() => switchMode('signup')}
                    className={`flex-1 py-2.5 text-xs uppercase tracking-widest font-sans font-medium rounded-[10px] border transition-colors ${
                        mode === 'signup'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-muted-foreground border-border hover:border-foreground'
                    }`}
                >
                    Crear cuenta
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name — only on signup */}
                {mode === 'signup' && (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <FieldLabel>Nombre</FieldLabel>
                                <InputField
                                    icon={User}
                                    type="text"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    placeholder="Ej. Cristóbal Campos"
                                    required
                                />
                            </div>
                            <div>
                                <FieldLabel>Apellido</FieldLabel>
                                <InputField
                                    icon={User}
                                    type="text"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    placeholder="Ej. Campos"
                                    required
                                />
                            </div>
                        </div>
                    </>
                )}

                <div>
                    <FieldLabel>Correo electrónico</FieldLabel>
                    <InputField
                        icon={Mail}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="tu@correo.com"
                        required
                    />
                </div>

                <div>
                    <FieldLabel>Contraseña</FieldLabel>
                    <InputField
                        icon={Lock}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="········"
                        required
                        rightElement={
                            <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 inline-btn p-0"
                            >
                                {showPassword
                                    ? <EyeOff className="w-4 h-4" />
                                    : <Eye className="w-4 h-4" />
                                }
                            </button>
                        }
                    />
                </div>

                {/* Error message — Feedback: errors are red, never muted-gray */}
                {error && (
                    <p role="alert" className="text-[10px] uppercase tracking-widest font-sans text-destructive flex items-center gap-1">
                        <span aria-hidden="true">⚠</span> {error}
                    </p>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-3 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity mt-2"
                >
                    {mode === 'signup' ? 'Crear cuenta' : 'Iniciar Sesión'}
                </button>
            </form>

            {/* Back to landing */}
            <button
                onClick={() => navigate('/')}
                className="mt-4 w-full py-3 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
            >
                Volver
            </button>
        </div>
    );
}