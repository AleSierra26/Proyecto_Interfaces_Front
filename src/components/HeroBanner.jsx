/*
 * Personalized greeting — Visual Hierarchy: headline anchors the page,
 * sub-text is secondary. Gestalt Common Region: the greeting sits in its
 * own distinct zone before the search/action area.
 */
export default function HeroBanner() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const firstName = currentUser?.name?.split(' ')[0] ?? 'Tú';

    const hour = new Date().getHours();
    const greeting =
        hour < 12 ? 'Buenos días' :
        hour < 19 ? 'Buenas tardes' :
                    'Buenas noches';

    return (
        <section className="px-4 pt-6 pb-2 animate-fade-in">
            <p className="text-[12px] uppercase tracking-widest text-muted-foreground font-sans">
                {greeting}
            </p>
            <h2 className="font-sans font-bold text-2xl tracking-zen mt-0.5">
                {firstName} 👋
            </h2>
            <p className="text-xs text-muted-foreground font-sans mt-1">
                ¿Qué quieres hacer hoy?
            </p>
        </section>
    );
}
