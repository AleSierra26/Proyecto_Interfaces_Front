import { Menu, Search, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import QuorumLogo from '../assets/quorumlogo.png';

export default function Header() {

    const navigate = useNavigate();

    return (
        <header className='sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border'>
            <div className='relative flex items-center px-4 py-3'>
                
                <div className='flex items-center'>
                    <img src={QuorumLogo} alt="Quorum Logo" className="w-[55px] h-[55px]" />
                </div>

                <h1 className='absolute left-1/2 transform -translate-x-1/2 font-sans-serif font-bold text-3xl tracking-zen uppercase cursor-pointer' onClick={() => navigate('/home')}>
                    Quorum
                </h1>

                <div className='flex items-center ml-auto'>
                    <button className='w-[40px] h-[40px] rounded-full bg-primary flex items-center justify-center'
                    aria-label='Profile' onClick={() => navigate('/profile')}
                    >
                        <User className='w-[20px] h-[20px] text-primary-foreground' />
                    </button>
                </div>
            </div>
        </header>
    );
}