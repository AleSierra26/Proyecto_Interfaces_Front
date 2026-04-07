import { Menu, Search, User } from 'lucide-react'
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import QuorumLogo from '../assets/QuorumLogo.png';

export default function Header() {

    const navigate = useNavigate();

    return (
        <header className='sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border'>
            <div className='relative flex items-center justify-center px-4 py-3'>
                <button className='absolute left-4 p-1' aria-label='Menu'>
                    <Menu className='w-5 h-5 text-foreground' />
                </button>
                
                <div className='flex flex-row items-center'>
                    <img src={QuorumLogo} alt="Quorum Logo" className="w-12 h-12" />
                    <h1 className='font-sans-serif font-bold text-3xl tracking-zen uppercase cursor-pointer' onClick={() => navigate('/home')}>
                        Quorum
                    </h1>
                </div>

                <div className='absolute right-4 flex items-center gap-3'>
                    {/* <button className='px-6 py-2.5 bg-primary-foreground text-primary font-sans-serif font-medium text-xs uppercase tracking-widest rounded-[10px] hover:opacity-90 transition-opacity'>
                        Iniciar Sesión
                    </button> */}
                    {/* <button className='p-1' aria-label='Search'>
                        <Search className='w-5 h-5 text-foreground' />
                    </button> */}
                    <button className='w-8 h-8 rounded-full bg-primary flex items-center justify-center'
                    aria-label='Profile' onClick={() => navigate('/profile')}
                    >
                        <User className='w-4 h-4 text-primary-foreground' />
                    </button>
                </div>
            </div>
        </header>
    );
}