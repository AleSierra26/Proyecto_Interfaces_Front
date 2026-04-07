import { Menu, Search, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import QuorumLogo from '../assets/QuorumLogo.png';

export default function Header() {

    const navigate = useNavigate();

    return (
        <header className='sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border'>
            <div className='flex items-center justify-between px-4 py-3'>
                
                <div className='flex items-center'>
                    <img src={QuorumLogo} alt="Quorum Logo" className="w-[100px] h-[100px]" />
                </div>

                <h1 className='font-sans-serif font-bold text-3xl tracking-zen uppercase cursor-pointer' onClick={() => navigate('/home')}>
                    Quorum
                </h1>

                <div className='flex items-center'>
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