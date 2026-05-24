import { Home, CalendarDays, Ticket } from 'lucide-react';                                                                               
import { useNavigate, useLocation } from 'react-router-dom'; 

const navItems = [
    { id: 'home', label: 'Inicio', icon: Home, url: '/home' },                                                                           
    { id: 'my-events', label: 'Mis Eventos', icon: CalendarDays, url: '/my-events' },                                                    
    { id: 'my-tickets', label: 'Mis Tickets', icon: Ticket, url: '/my-tickets' },                                                        
];

export default function BottomNav() {

    const navigate = useNavigate();
    const location = useLocation();
    return (                                                                                                                             
              /* md:hidden — on desktop the Header provides navigation */                                                                      
              <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">          
                  <div className="flex items-stretch justify-around pb-[max(0.5rem,env(safe-area-inset-bottom))] max-w-md mx-auto">            
                      {navItems.map((item) => {
                           const Icon = item.icon;
                          const isActive = location.pathname === item.url                                                                      
                              || location.pathname.startsWith(item.url + '/');                                                                 
                           return (
                               <button
                                   key={item.id}
                            onClick={() => navigate(item.url)}                                                                           
                                aria-label={item.label}                                                                                      
                                  aria-current={isActive ? 'page' : undefined}                                                                 
                                  className="relative flex flex-col items-center gap-0.5 px-4 pt-1 pb-1 flex-1"                                
                              >
                                  {/* Visual Hierarchy: top indicator marks the active section */}                                             
                                  <span                                                                                                        
                                      className={`absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-b-full transition-all duration-200 ${ 
                                          isActive ? 'bg-foreground w-6' : 'bg-transparent w-0'                                                
                                      }`}                                                                                                      
                                  />                                                                                                           
                                   <Icon
                                className={`w-5 h-5 mt-2 transition-colors duration-200 ${                                               
                                      isActive ? 'text-foreground' : 'text-muted-foreground'                                               
                                  }`}                                                                                                      
                              />
                           <span                                                                                                        
                                 className={`text-[9px] uppercase tracking-widest font-sans transition-colors duration-200 ${             
                                        isActive ? 'text-foreground font-medium' : 'text-muted-foreground'                                   
                                    }`}                                                                                                      
                                >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}