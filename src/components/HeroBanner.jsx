export default function HeroBanner() {
    return (
        <section className="mx-4 mt-4 rounded-sm overflow-hidden bg-white">
            <div className="flex flex-col items-center justify-center text-center px-6">
                <h2 className="font-sans-serif font-bold text-2xl md:text-3xl text-primary leading-tight tracking-zen">
                    Ingresa un código de evento
                </h2>
                <p className="mt-2 text-sm text-primary font-sans-serif max-w-xs">
                    O busca un evento por su nombre, fecha o categoría
                </p>
                {/* <button className="mt-5 px-6 py-2.5 bg-primary-foreground text-primary font-sans-serif font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity">
                    Empezar ahora
                </button> */}
            </div>
        </section>
    );
}