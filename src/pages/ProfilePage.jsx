import { useState, useEffect } from 'react';
import { Pencil, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [memberSince, setMemberSince] = useState('');

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            setUserName(currentUser.name);
            setMemberSince(currentUser.member_since);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto relative pb-20">

            {/* Profile section */}
            <section className="flex flex-col items-center px-4 pt-10 pb-8 border-b border-border">

                {/* Avatar with edit button */}
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground/50 text-xs font-sans">
                            Imagen Aquí!
                        </span>
                    </div>
                    <button
                        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-background"
                        aria-label="Edit photo"
                    >
                        <Pencil className="w-3 h-3 text-primary-foreground" />
                    </button>
                </div>

                {/* Name & meta */}
                <h2 className="font-sans font-bold text-xl tracking-widest">
                    {userName}
                </h2>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground font-sans">
                    Miembro desde {memberSince}
                </p>

                {/* Action buttons */}
                <div className="flex flex-col">
                    <div className="flex gap-3 mt-5">
                        <button className="px-6 py-2.5 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity">
                            Editar perfil
                        </button>
                        <button className="px-6 py-2.5 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors">
                            Ajustes
                        </button>
                    </div>
                    <div className="my-2" />
                    {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-white text-red-600 border border-red-600 font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:bg-red-600 hover:text-white transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar sesión
                        </button>
                        
                </div>
            </section>
        </div>
    );
}