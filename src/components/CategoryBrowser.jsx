import { Music, Trophy, Theater } from 'lucide-react'

const categories = [
    { id: 1, name: 'Música', icon: Music },
    { id: 2, name: 'Deportes', icon: Trophy },
    { id: 3, name: 'Teatro', icon: Theater },
];

export default function CategoryBrowser() {
    return (
        <section className='mt-10 px-4'>
            <h3 className='font-sans-serif font-bold text-base uppercase tracking-widest mb-4'>
                Explorar por categoría
            </h3>
            <div className='flex gap-4 overflow-x-auto pb-2 scrollbar-hide'>
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <button key={cat.id} aria-label={`Explorar categoría ${cat.name}`} className='flex flex-col items-center gap-2 min-w-[80px] py-3 px-4 border-border rounded-sm bg-card hover:bg-secondary transition-colors'
                        >
                            <Icon className='w-5 h-5 text-foreground' aria-hidden="true" />
                            <span className='text-[12px] uppercase tracking-widest font-sans font-medium text-foreground'>
                                {cat.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}