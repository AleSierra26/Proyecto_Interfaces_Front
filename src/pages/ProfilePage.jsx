import { Menu, User, Pencil, Bookmark } from 'lucide-react';

export default function ProfilePage() {
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
                <h2 className="font-sans-serif font-bold text-xl tracking-widest">
                    Cristóbal Campos
                </h2>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground font-sans-serif">
                    Miembro desde Oct 2023 · Premium
                </p>

                {/* Action buttons — matches SearchBar.jsx button styles */}
                <div className="flex gap-3 mt-5">
                    <button className="px-6 py-2.5 bg-primary text-primary-foreground font-sans-serif font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity">
                        Editar perfil
                    </button>
                    <button className="px-6 py-2.5 border border-border text-muted-foreground font-sans-serif font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors">
                        Ajustes
                    </button>
                </div>
            </section>
        </div>
    );
}
