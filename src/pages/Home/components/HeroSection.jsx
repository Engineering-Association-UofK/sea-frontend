import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useLanguage } from '@/context/LanguageContext.jsx';
import { useIfLive } from '@/features/election/hooks/useElection.js';
import heroImgV from '@/utils/images/home-page-hero-v.jpg';
import heroImgH from '@/utils/images/home-page-hero-h.jpg';
import '@/styles/HomePage.css';

const HeroSection = () => {
    const { translations, language } = useLanguage();
    const isRtl = language === 'ar';

    const { data: electionData } = useIfLive();
    const isLive = Boolean(electionData?.live);
    const cycle = electionData?.cycle;

    return (
        <section 
            className={`hero-wrapper ${isRtl ? 'rtl' : 'ltr'}`}
            style={{ 
                '--hero-img-v': `url(${heroImgV})`,
                '--hero-img-h': `url(${heroImgH})` 
            }}
        >
            <div className="hero-bg" />
            <div className="hero-overlay" />

            <Container className="hero-container">
                <div className="hero-content">
                    {isLive && (
                        <Link 
                            to="/election" 
                            className="hero-badge-live animate-slide-up"
                        >
                            <span className="live-dot-container">
                                <span className="live-dot-ping" />
                                <span className="live-dot" />
                            </span>
                            <span className="badge-text">
                                {translations.home.hero.electionLiveBadge} 
                                {cycle ? ` (${translations.home.hero.cycleLabel} #${cycle})` : ''} 
                                <span className="badge-cta-arrow">
                                    {isRtl ? ' ← ' : ' → '}
                                    {translations.home.hero.voteNow}
                                </span>
                            </span>
                        </Link>
                    )}
                    
                    <h1 className="hero-title animate-slide-up">
                        {translations.home.hero.title}
                    </h1>
                    
                    <p className="hero-subtitle animate-slide-up-delayed">
                        {translations.home.hero.subtitle}
                    </p>
                    
                    <div className="hero-actions animate-fade-in-delayed">
                        <Button 
                            as={Link} 
                            to="/about/association" 
                            className="hero-btn-primary"
                        >
                            {translations.home.hero.cta}
                        </Button>
                    </div>
                </div>
            </Container>

            <div className="hero-bottom-shape" />
        </section>
    );
};

export default HeroSection;