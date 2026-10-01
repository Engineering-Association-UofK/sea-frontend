import React from 'react';
import '@/styles/HomePage.css';

// Components
import HeroSection from "./components/HeroSection.jsx";
import AboutSection from "./components/AboutSection.jsx";
import InitiativesSection from "./components/InitiativesSection.jsx";
import NewsFeed from "./components/NewsFeed.jsx";
import {Spinner} from "react-bootstrap";
import SecretariatShowcase from './components/SecretariatShowcase.jsx';
import Statistics from './components/Statistics.jsx';

const Home = () => {

    return (
        <div className="home-page">
            <HeroSection />
            <AboutSection />
            <Statistics />
            <InitiativesSection />
            <SecretariatShowcase />
            <NewsFeed />
        </div>
    );
};

export default Home;
