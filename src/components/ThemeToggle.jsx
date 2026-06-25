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
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors inline-btn"
            aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
            aria-pressed={theme === 'dark'}
        >
            {theme === 'light' ? (
                <Moon className="w-4 h-4 text-foreground" aria-hidden="true" />
            ) : (
                <Sun className="w-4 h-4 text-foreground" aria-hidden="true" />
            )}
        </button>
    );
}