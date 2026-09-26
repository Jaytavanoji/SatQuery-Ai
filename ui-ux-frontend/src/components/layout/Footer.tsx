import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer 
      className="relative bg-black text-white pt-12 pb-8 border-t border-white/10 overflow-hidden" 
      data-purpose="satquery-footer"
    >
      {/* Animated Dotted Top Border Strip */}
      <div aria-hidden="true" className="footer-dots mb-16" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Four-Column Top Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-20 border-b border-white/10" 
          data-purpose="footer-top-grid"
        >
          {/* Column 1: Brand Vision */}
          <div className="space-y-4 lg:col-span-1">
            <h2 className="text-2xl font-bold tracking-tight text-white leading-snug">
              SatQuery AI — Space Technology
            </h2>
            <p className="text-sm text-gray-400 font-light leading-relaxed">
              Ask the Earth. See the evidence. Trust the answer. Democratizing satellite imagery analysis using natural language AI.
            </p>
          </div>

          {/* Column 2: Capabilities */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
              Capabilities
            </h3>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <Link to="/app" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Change Detection
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Land Cover Mapping
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Sentinel-1/2 Processing
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Geo-referenced Overlays
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & AI */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
              Architecture
            </h3>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <button 
                  type="button" 
                  onClick={() => scrollToSection('features')} 
                  className="text-gray-400 hover:text-gray-200 transition-colors text-left"
                >
                  Natural Language Understanding
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => scrollToSection('how-it-works')} 
                  className="text-gray-400 hover:text-gray-200 transition-colors text-left"
                >
                  Vision-Language Engine
                </button>
              </li>
              <li>
                <Link to="/app" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Gesture Control Module
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-gray-400 hover:text-gray-200 transition-colors">
                  Map Server Integration
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Project Info / SIH */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-400">
              SIH 2026
            </h3>
            <ul className="space-y-3 text-sm font-light">
              <li>
                <a 
                  href="https://sih.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Problem Statement SIH26167
                </a>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={scrollToTop} 
                  className="text-gray-400 hover:text-gray-200 transition-colors text-left"
                >
                  Team Techy-Freaks
                </button>
              </li>
              <li>
                <a 
                  href="/api/health" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  API Documentation
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/Jaytavanoji/SatQuery-Ai" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Oversized Brand Row with Massive Wordmark */}
        <div 
          className="py-16 flex flex-col items-center justify-center text-center space-y-8 border-b border-white/10" 
          data-purpose="oversized-brand-row"
        >
          {/* Massive SatQuery AI Wordmark */}
          <div className="w-full overflow-hidden leading-none select-none">
            <h1 
              onClick={scrollToTop}
              className="satquery-wordmark font-bold tracking-tighter uppercase block cursor-pointer hover:opacity-90 transition-opacity font-['Space_Grotesk',sans-serif]"
            >
              <span className="text-white">SATQUERY-</span>
              <span className="text-[#34d399]">AI</span>
            </h1>
          </div>
        </div>

        {/* Legal Line & Secondary Footer Meta */}
        <div 
          className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-light space-y-4 sm:space-y-0" 
          data-purpose="legal-line"
        >
          <p>© 2026 Team Techy-Freaks — SIH 2026. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('SatQuery AI Privacy Policy: All geospatial analytical pipelines are strictly end-to-end encrypted.'); }} className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert('SatQuery AI Terms of Service: Research and educational satellite telemetry processing engine.'); }} className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#security" onClick={(e) => { e.preventDefault(); alert('SatQuery AI Security Disclosures: Real-time physics verifier active and neural weight tamper protection enabled.'); }} className="hover:text-white transition-colors">
              Security Disclosures
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;