import { ShieldCheck, Zap, Ticket, BanknoteArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
    { icon: Ticket,      title: 'Entradas seguras',    desc: 'Cada ticket tiene un QR único e infalsificable.' },
    { icon: ShieldCheck, title: 'Reventa verificada',   desc: 'Compra reventas sin riesgo entre usuarios reales. Todo se maneja dentro de la misma plataforma.' },
    { icon: Zap,         title: 'Check-In instantáneo',  desc: 'Muestra tu QR o escanea invitados directo desde tu celular.' },
    { icon: BanknoteArrowDown, title: 'No hay negocio',  desc: 'Los tickets pueden revenderse solamente a precios iguales o menores al original.' },
];

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">

            {/*
             * Hero — Visual Hierarchy: tamaño y peso tipográfico
             * anclan la página. El h1 domina, el subtítulo es secundario,
             * los CTAs cierran el bloque.
             * Gestalt Figure/Ground: el fondo blanco limpio contrasta
             * con el texto oscuro creando foco claro.
             */}
            <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-12 animate-fade-in">
                <p className="text-[12px] uppercase tracking-widest text-muted-foreground font-sans mb-4">
                    Bienvenido a Quorum
                </p>
                <h1 className="font-sans font-black text-4xl md:text-5xl tracking-tighter text-foreground leading-[1.05] mb-4">
                    Gestiona tus<br />eventos sin caos
                </h1>
                <p className="text-sm text-muted-foreground font-sans max-w-xs leading-relaxed mb-10">
                    Compra, vende y administra eventos sin complicaciones,
                    todo en un mismo lugar.
                </p>

                {/* CTAs — Hierarchy: relleno (primario) vs. contorno (secundario) */}
                <div className="w-full space-y-3">
                    <button
                        onClick={() => navigate('/auth?mode=signup')}
                        className="w-full py-3.5 bg-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity"
                    >
                        Crear cuenta
                    </button>
                    <button
                        onClick={() => navigate('/auth?mode=login')}
                        className="w-full py-3 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:border-foreground hover:text-foreground transition-colors"
                    >
                        Ya tengo cuenta
                    </button>
                </div>
            </section>

            {/*
             * Features — Progressive Disclosure: información adicional
             * debajo del fold; el usuario la descubre al hacer scroll.
             * Gestalt Similarity: cada feature comparte la misma
             * estructura icono + título + descripción.
             * Gestalt Common Region: icono dentro de un cuadrado
             * delimitado = una unidad visual autónoma.
             */}
            <section className="border-t border-border px-6 py-8 space-y-5">
                {features.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-4">
                        <div className="w-9 h-9 rounded-[8px] bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4 text-foreground" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="font-sans font-bold text-sm tracking-zen">
                                {title}
                            </p>
                            <p className="text-xs text-muted-foreground font-sans mt-0.5 leading-relaxed">
                                {desc}
                            </p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
