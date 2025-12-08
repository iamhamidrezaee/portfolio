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
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-thin tracking-tighter text-white mb-2 sm:mb-3 mix-blend-difference leading-tight">
          Hamid Rezaee
        </h1>
        
        <div className="h-px w-24 sm:w-32 bg-white mx-auto my-4 sm:my-5 md:my-6 opacity-50"></div>
        
        <h2 className="text-lg sm:text-xl md:text-2xl font-light tracking-wide text-gray-300 mb-6 sm:mb-8 mix-blend-difference px-2">
          Machine Learning Engineer
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center text-sm sm:text-base font-extralight text-gray-400 tracking-wider mb-8 sm:mb-10 md:mb-12 px-4">
          <span className="hover:text-white active:text-white transition-colors duration-300 cursor-pointer touch-manipulation" onClick={() => onNavigate && onNavigate('experience')}>
            Low Latency Systems
          </span>
          <span className="hidden sm:inline text-gray-700">•</span>
          <span className="hover:text-white active:text-white transition-colors duration-300 cursor-pointer touch-manipulation" onClick={() => onNavigate && onNavigate('projects')}>
            GPU Acceleration
          </span>
          <span className="hidden sm:inline text-gray-700">•</span>
          <span className="hover:text-white transition-colors duration-300">Cornell 2026</span>
        </div>

        {/* Quick Navigation Pills */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center px-2 max-w-md mx-auto">
          <button 
            onClick={() => onNavigate && onNavigate('experience')}
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/20 text-white/80 text-sm sm:text-base font-light tracking-wide
                       hover:bg-white/10 hover:border-white/30 active:bg-white/15 transition-all duration-300
                       backdrop-blur-sm touch-manipulation min-h-[44px] flex items-center justify-center"
          >
            Experience
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('projects')}
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/20 text-white/80 text-sm sm:text-base font-light tracking-wide
                       hover:bg-white/10 hover:border-white/30 active:bg-white/15 transition-all duration-300
                       backdrop-blur-sm touch-manipulation min-h-[44px] flex items-center justify-center"
          >
            Projects
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('writings')}
            className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/20 text-white/80 text-sm sm:text-base font-light tracking-wide
                       hover:bg-white/10 hover:border-white/30 active:bg-white/15 transition-all duration-300
                       backdrop-blur-sm touch-manipulation min-h-[44px] flex items-center justify-center"
          >
            Writings
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default LandingPage;
