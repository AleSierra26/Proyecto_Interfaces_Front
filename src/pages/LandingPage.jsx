import { ShieldCheck, Gauge } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background max-w-md mx-auto relative pb-20">
            <section className="mx-4 mt-4 rounded-sm overflow-hidden bg-white">
            <div className="flex flex-col items-center justify-center text-center px-6">
                <h2 className="font-sans-serif font-bold text-2xl md:text-3xl text-primary leading-tight tracking-zen">
                    Gestiona tus eventos sin caos
                </h2>
                <p className="mt-2 text-sm text-primary font-sans-serif max-w-xs">
                    Compra, vende y administra eventos sin complicaciones, todo en un mismo lugar.
                </p>
                <p className="mt-2 text-sm text-primary font-sans-serif font-bold max-w-xs">
                    El futuro de salir está aquí.
                </p>
                <h2 className="mt-14 text-5xl font-black tracking-tighter text-primary mb-8">ASEGURA TU PUESTO.</h2>
                <button className='w-[80%] py-3 border border-primary text-primary-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] bg-primary hover:opacity-90 transition-colors'>
                    Crear cuenta
                </button>
                <button onClick={() => navigate('/home')} className='w-[80%] mt-4 py-3 border border-border text-muted-foreground font-sans font-medium text-xs uppercase tracking-widest rounded-[10px] hover:bg-primary-foreground hover:text-primary hover:border-primary transition-colors'>
                    Iniciar Sesión
                </button>
            </div>
            {/* <div className="my-10 flex flex-row items-start justify-left text-center px-6">
                <ShieldCheck size={40} className="text-primary bg-[#e2e2e2] p-1 rounded-[5px]" />
                <div className="flex flex-col items-left justify-left text-left px-2">
                    <h3 className="text-2xl font-bold mb-4 tracking-tight">Secure Resale</h3>
                    <p className="text-[#474747] font-light leading-relaxed">Safely sell your tickets to other fans through our proprietary verification protocol.</p>
                </div>
            </div> */}
            </section>
        </div>
    )
}