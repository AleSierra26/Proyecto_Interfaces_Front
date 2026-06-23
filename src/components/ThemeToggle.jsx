import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ onToggle }) {
    const { theme, toggleTheme } = useTheme();

    const handleClick = () => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const nextTheme = savedTheme === 'dark' ? 'light' : 'dark';

        localStorage.setItem('theme', nextTheme);
        toggleTheme();
        onToggle?.(nextTheme);
    };

    return (
        <button
            onClick={handleClick}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="Cambiar tema"
        >
            {theme === 'light' ? (
                <Moon className="w-4 h-4 text-foreground" />
            ) : (
                <Sun className="w-4 h-4 text-foreground" />
            )}
        </button>
    );
}