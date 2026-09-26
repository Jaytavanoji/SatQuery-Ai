import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn } from 'lucide-react';

export interface ModernSatelliteAiLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  textColor?: string;
}

/**
 * Modern, minimal, and professional SATQUERY-AI brand title.
 * Unified Space Grotesk typography with white brand title and #34d399 greenish AI.
 */
export const ModernSatelliteAiLogo: React.FC<ModernSatelliteAiLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  textColor = 'text-white'
}) => {
  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl sm:text-2xl font-black',
    lg: 'text-2xl sm:text-3xl font-black'
  };

  return (
    <div className={`flex items-center group/logo select-none ${className}`}>
      {/* Brand Text: 'SATQUERY-' in white (or custom textColor), 'AI' in #34d399 */}
      {showText && (
        <span className={`${textSizes[size]} font-['Space_Grotesk',sans-serif] font-bold tracking-tight leading-none flex items-center`}>
          <span className={textColor}>SATQUERY-</span>
          <span className="text-[#34d399] font-black">
            AI
          </span>
        </span>
      )}
    </div>
  );
};

interface LandingNavbarProps {
  onLaunchApp: () => void;
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onLaunchApp
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Use Cases', href: '#use-cases' },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/60'
          : 'bg-black/60 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between transition-all duration-200">
        {/* Left: Brand Logo & Title */}
        <a
          href="#home"
          onClick={(e) => handleScrollTo(e, '#home')}
          className="flex items-center rounded-xl p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
          title="SatQuery AI Home"
        >
          <ModernSatelliteAiLogo size="sm" showText={true} />
        </a>

        {/* Center: Navigation Links with Past Underline Hover Transition Effects */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="text-xs sm:text-sm font-semibold text-gray-300 hover:text-cyan-400 transition-colors py-1.5 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right: Launch SatQuery AI Primary CTA & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onLaunchApp}
            className="btn-gradient btn-shine px-4 py-1.5 sm:px-5 text-xs sm:text-sm font-bold shadow-md shadow-cyan-950/40"
          >
            <span>Launch SatQuery AI</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu with Links */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 bg-gray-950/95 border-b border-white/10 shadow-2xl backdrop-blur-xl space-y-2.5 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-cyan-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchApp();
              }}
              className="btn-gradient btn-shine w-full py-2.5 px-4 text-sm font-bold shadow-md"
            >
              <span>Launch SatQuery AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNavbar;
