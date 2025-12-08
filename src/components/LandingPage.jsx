import React from 'react';
import LiquidEther from './LiquidEther/LiquidEther';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center bg-black overflow-hidden">
      
      {/* Background Visual */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={['#f129ff', '#86eafe', '#a3f0b0']}
          mouseForce={7}
          cursorSize={125}
          resolution={0.2}
          autoSpeed={0.5}
          autoIntensity={2.2}
          iterationsPoisson={70}
          isBounce={false}
          autoDemo={true}
          isViscous={true}
          viscous={26}
          iterationsViscous={62}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-thin tracking-tighter text-white mb-2 mix-blend-difference">
          Hamid Rezaee
        </h1>
        
        <div className="h-px w-32 bg-white mx-auto my-6 opacity-50"></div>
        
        <h2 className="text-xl md:text-2xl font-light tracking-wide text-gray-300 mb-8 mix-blend-difference">
          Machine Learning Engineer
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center text-sm md:text-base font-extralight text-gray-400 tracking-wider mb-12">
          <span className="hover:text-white transition-colors duration-300 cursor-pointer" onClick={() => onNavigate && onNavigate('experience')}>
            Low Latency Systems
          </span>
          <span className="hidden md:inline text-gray-700">•</span>
          <span className="hover:text-white transition-colors duration-300 cursor-pointer" onClick={() => onNavigate && onNavigate('projects')}>
            GPU Acceleration
          </span>
          <span className="hidden md:inline text-gray-700">•</span>
          <span className="hover:text-white transition-colors duration-300">Cornell '26</span>
        </div>

        {/* Quick Navigation Pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button 
            onClick={() => onNavigate && onNavigate('experience')}
            className="px-6 py-2.5 rounded-full border border-white/20 text-white/80 text-sm font-light tracking-wide
                       hover:bg-white/10 hover:border-white/30 transition-all duration-300
                       backdrop-blur-sm"
          >
            Experience
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('projects')}
            className="px-6 py-2.5 rounded-full border border-white/20 text-white/80 text-sm font-light tracking-wide
                       hover:bg-white/10 hover:border-white/30 transition-all duration-300
                       backdrop-blur-sm"
          >
            Projects
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('writings')}
            className="px-6 py-2.5 rounded-full border border-white/20 text-white/80 text-sm font-light tracking-wide
                       hover:bg-white/10 hover:border-white/30 transition-all duration-300
                       backdrop-blur-sm"
          >
            Writings
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default LandingPage;
