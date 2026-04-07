import { Search } from 'lucide-react'

export default function SearchBar() {
    return (
        <div className='px-4 mt-5 space-y-3'>
            {/* Code button */}
            <button className='w-full py-3 border border-primary text-primary-foreground font-sans-serif font-medium text-xs uppercase tracking-widest rounded-[10px] bg-primary hover:bg-primary-foreground hover:text-primary transition-colors'>
                Tengo un código
            </button>
            {/* Search input */}
            <div className='flex items-center gap-2 border border-border rounded-[10px] px-3 py-2.5 bg-card'>
                <Search className='w-4 h-4 text-muted-foreground flex-shrink-0' />
                <input
                    type='text'
                    placeholder='Buscar eventos, artistas o lugares'
                    className='flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans'
                    />
            </div>
        </div>
    );
}