import { Heart, Wind, TrendingUp, PenLine, Target, HelpCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/breathe', label: 'Breathe', icon: Wind },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/journal', label: 'Journal', icon: PenLine, isCenter: true },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/quiz', label: 'Quiz', icon: HelpCircle },
];

const Navigation = () => {
  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-card shadow-card-soft">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-xl font-semibold text-foreground">MindfulMe</span>
            </div>

            {/* Nav Items */}
            <div className="flex items-center gap-8">
              {navItems.filter(item => !item.isCenter).map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 transition-colors ${
                      isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around h-20 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                item.isCenter
                  ? 'relative -mt-8'
                  : `flex flex-col items-center gap-1 transition-colors ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`
              }
            >
              {item.isCenter ? (
                <div className="w-14 h-14 rounded-full bg-primary shadow-button-glow flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
              ) : (
                <>
                  <item.icon className="w-6 h-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
