import HeroBanner from '../components/HeroBanner';
import SearchBar from '../components/SearchBar';
import TrendingEvents from '../components/TrendingEvents';
import CategoryBrowser from '../components/CategoryBrowser';
import UpcomingEvents from '../components/UpcomingEvents';

export default function HomePage() {
    return (
        <div className='min-h-screen bg-background max-w-md md:max-w-3xl mx-auto relative'>
            <HeroBanner />
            <SearchBar />
            <TrendingEvents />
            <UpcomingEvents />
        </div>
    );
}