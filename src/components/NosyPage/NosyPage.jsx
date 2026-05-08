import React from 'react';
import PortfolioNav from '../PortfolioNav';
import NosyBooth from './NosyBooth';
import './NosyPage.css';

const NosyPage = () => (
  <main className="nosy-page">
    <PortfolioNav className="nosy-nav" />
    <section className="nosy-stage" aria-label="Nosy">
      <div className="nosy-copy">
        <p className="nosy-kicker">Final Project</p>
        <h1>Nosy</h1>
        <p>
          A photo booth asks for the small things people give away because the room feels playful.
        </p>
      </div>
      <NosyBooth />
    </section>
  </main>
);

export default NosyPage;
