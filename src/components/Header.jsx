import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuorumLogoLight from '../assets/quorumlogolight.png';
import QuorumLogoDark from '../assets/quorumlogodark.png';
import ThemeToggle from './ThemeToggle.jsx';

/* Responsive Design: desktop inline nav replaces mobile bottom nav */
const desktopNavItems = [
    { label: 'Inicio', url: '/home' },
    { label: 'Mis Eventos', url: '/my-events' },
    { label: 'Mis Tickets', url: '/my-tickets' },
];

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = localStorage.getItem('currentUser');
    const [currentTheme, setCurrentTheme] = useState(() => localStorage.getItem('theme') || 'light');

    useEffect(() => {
        const syncTheme = () => {
            setCurrentTheme(localStorage.getItem('theme') || 'light');
        };

        syncTheme();
        window.addEventListener('storage', syncTheme);

        return () => window.removeEventListener('storage', syncTheme);
    }, []);

    const handleThemeToggle = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        localStorage.setItem('theme', savedTheme);
        setCurrentTheme(savedTheme);
    };

    const home = currentUser ? '/home' : '/';

    return (
        <header className='sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border'>
            <div className='flex items-center px-4 py-3 max-w-3xl mx-auto'>

                {/* Logo — Gestalt Similarity: same logo placement on every screen */}
                <div
                    className='flex items-center gap-2.5 cursor-pointer flex-shrink-0'
                    onClick={() => navigate(home)}
                >
                    {currentTheme === 'light' ? (
                        <img src={QuorumLogoLight} alt="Logo Quorum" className="w-9 h-9" />
                    ) : (
                        <img src={QuorumLogoDark} alt="Logo Quorum" className="w-9 h-9" />
                    )}
                    <span className='font-sans font-bold text-lg tracking-zen uppercase hidden sm:block'>
                        Quorum
                    </span>
                </div>

                {/* Desktop nav: Visual Hierarchy — nav links are secondary to the logo */}
                {currentUser && (
                    <nav className='hidden md:flex items-center gap-7 ml-10' aria-label="Navegación principal">
                        {desktopNavItems.map((item) => {
                            const isActive = location.pathname === item.url
                                || location.pathname.startsWith(item.url + '/');
                            return (
                                <button
                                    key={item.url}
                                    onClick={() => navigate(item.url)}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={`relative text-xs uppercase tracking-widest font-sans transition-colors pb-0.5 ${
                                        isActive
                                            ? 'text-foreground font-medium'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {item.label}
                                    {isActive && (
                                        <span className="absolute -bottom-3.5 left-0 right-0 h-px bg-foreground" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                )}

                {/* Mobile: centred wordmark */}
                <h1
                    className='absolute left-1/2 -translate-x-1/2 font-sans font-bold text-2xl tracking-zen uppercase cursor-pointer md:hidden'
                    onClick={() => navigate(home)}
                >
                    Quorum
                </h1>

                {/* Profile button — always right-aligned */}
                <div className='flex items-center ml-auto gap-2'>
                    <ThemeToggle onToggle={handleThemeToggle} />
                    {currentUser && (
                        <button
                            className='ml-auto w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 inline-btn'
                            aria-label='Perfil'
                            onClick={() => navigate('/profile')}
                        >
                            <User className='w-4 h-4 text-primary-foreground' />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
