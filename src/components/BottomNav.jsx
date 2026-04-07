import { Home, CalendarDays, Ticket, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
    { id: 'home', label: 'Inicio', icon: Home, active: true, url: '/home' },
    { id: 'my-events', label: 'Mis Eventos', icon: CalendarDays, active: false, url: '/my-events' },
    { id: 'my-tickets', label: 'Mis Tickets', icon: Ticket, active: false, url: '/my-tickets' },
    // { id: 'profile', label: 'Perfil', icon: User, active: false, url: '/profile' },
];

export default function BottomNav() {

    const navigate = useNavigate();

    return(
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
            <div className="flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => { 
                                navItems.forEach(nav => nav.active = false);
                                item.active = true;
                                navigate(item.url); 
                            }}
                            className="flex flex-col items-center gap-0.5 px-3 py-1"
                        >
                            <Icon
                                className={`w-5 h-5 ${item.active ? 'text-foreground' : 'text-muted-foreground'}`}
                            />
                            <span className={`text-[9px] uppercase tracking-widest font-sans ${item.active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}