import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoreFeaturesSection } from './CoreFeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { UseCasesSection } from './UseCasesSection';
import { Footer } from '../layout/Footer';
import './CinematicLandingPage.css';

interface CinematicLandingPageProps {
  onLaunchApp?: () => void;
}

export const CinematicLandingPage: React.FC<CinematicLandingPageProps> = ({ onLaunchApp }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [queryText, setQueryText] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Ensure background video plays
  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video background autoplay blocked or waiting:', err);
        });
      }
    }
  }, []);

  // Handle focus when dialog opens
  useEffect(() => {
    if (dialogOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [dialogOpen]);

  // Navigate to application
  const goToApp = (query?: string) => {
    setDialogOpen(false);
    if (onLaunchApp) {
      onLaunchApp();
    }
    if (query && query.trim()) {
      navigate('/app', { state: { initialQuery: query.trim() } });
    } else {
      navigate('/app');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryText.trim()) {
      goToApp(queryText.trim());
    } else {
      goToApp();
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="cinematic-landing-root">
      {/* Full-viewport Cinematic Hero Stage */}
      <div className="stage">
        {/* Looping Earth video & high-res still fallback */}
        <div className="sky">
          <video
            ref={videoRef}
            aria-hidden="true"
            autoPlay
            loop
            muted
            playsInline
            className="is-active"
            poster="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202133_508c64b8-a31e-4290-bdfc-1187df70e0a6.png"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260827_202422_3ffb4889-c520-432d-8458-038009eb40df.mp4"
          />
        </div>

        {/* UI Overlay Layer */}
        <div className="ui">
          {/* Top Navbar */}
          <header className="navbar">
            <div className="navrow" data-open={mobileMenuOpen ? 'true' : 'false'}>
              <div 
                className="logo"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                SATQUERY-<i>AI</i>
              </div>

              <nav className="links" id="site-nav">
                <button 
                  type="button" 
                  className="nav-link" 
                  aria-current="page"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Home
                </button>
                <button 
                  type="button" 
                  className="nav-link" 
                  onClick={() => scrollToSection('features')}
                >
                  Features
                </button>
                <button 
                  type="button" 
                  className="nav-link" 
                  onClick={() => scrollToSection('how-it-works')}
                >
                  How it works
                </button>
                <button 
                  type="button" 
                  className="nav-link" 
                  onClick={() => {
                    navigate('/satellite-view');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Satellite View
                </button>
                <button 
                  type="button" 
                  className="nav-link" 
                  onClick={() => {
                    navigate('/weather-sat');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Weather-Sat
                </button>
                <button
                  type="button"
                  className="enroll"
                  onClick={() => goToApp()}
                  id="launchBtn"
                >
                  Launch
                </button>
              </nav>

              <button
                type="button"
                className="burger"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </header>

          {/* Center Hero Copy */}
          <div className="copy">
            <h1 className="col title font-bold">
              <span className="ent-mask">
                <span className="ent-line font-bold">
                  SATQUERY-<span className="title-ai">AI</span>
                </span>
              </span>
            </h1>
            <div className="col rule"><span></span></div>
            <p className="col lede">
              <span className="hero-tagline">ASK THE EARTH. TRUST THE EVIDENCE.</span>
              <span className="hero-subtext">Access real-time satellite telemetry and spatial AI analysis instantly.</span>
            </p>
            <div className="col cta">
              <button
                type="button"
                id="ctaLaunchBtn"
                className="cta-btn"
                onClick={() => goToApp()}
              >
                Launch
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator Button */}
        <button
          type="button"
          aria-label="Scroll to features or launch query"
          className="scroll"
          id="scrollBtn"
          onClick={() => scrollToSection('features')}
        >
          <svg aria-hidden="true" fill="none" viewBox="0 0 26 33">
            <path
              d="M13 1.5 V31.5 M1.9 20.4 L13 31.5 L24.1 20.4"
              stroke="#ffffff"
              strokeLinecap="square"
              strokeLinejoin="miter"
              strokeWidth="3"
            />
          </svg>
        </button>
      </div>

      {/* Interactive Natural Language Query Modal */}
      <div 
        className={`cinematic-query-dialog-backdrop ${dialogOpen ? 'open' : ''}`}
        id="queryDialog"
        onClick={(e) => {
          if (e.target === e.currentTarget) setDialogOpen(false);
        }}
      >
        <div className="cinematic-query-dialog-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🛰️</span>
              <span>SATQUERY NATURAL LANGUAGE ENGINE</span>
            </h3>
            <button
              type="button"
              id="closeDialogBtn"
              onClick={() => setDialogOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.8rem', cursor: 'pointer', lineHeight: 1 }}
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleQuerySubmit}>
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <textarea
                ref={textareaRef}
                id="modalQueryInput"
                rows={3}
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(4,10,22,0.85)',
                  border: '1px solid rgba(121,220,232,0.4)',
                  borderRadius: '10px',
                  color: '#f8fafc',
                  padding: '12px',
                  fontSize: '0.92rem',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  resize: 'none'
                }}
                placeholder="Ask a question about satellite data in plain English (e.g. 'Analyze coastal erosion trends near Chennai between 2024 and 2026')."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#79dce8', fontFamily: 'var(--font-body)' }}>
                USES NATURAL LANGUAGE UNDERSTANDING
              </span>
              <button
                type="submit"
                id="executeSearchBtn"
                style={{
                  background: 'linear-gradient(180deg,#fff,#d9ecfe)',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 22px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#071227',
                  cursor: 'pointer'
                }}
              >
                Query Satellite
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Feature Sections Below Hero */}
      <div className="bg-slate-950 text-slate-100">
        <CoreFeaturesSection
          onLaunchWithQuery={(query) => {
            goToApp(query);
          }}
        />
        <HowItWorksSection />
        <UseCasesSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CinematicLandingPage;
