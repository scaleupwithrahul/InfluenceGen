import React from 'react';

const SmartIntegrationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.225.225 0 0 1 .225-.225h.008a.225.225 0 0 1 .225.225v.008a.225.225 0 0 1-.225.225h-.008a.225.225 0 0 1-.225-.225v-.008Z" />
    </svg>
);

const PoseCopyingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25c0 1.242-1.008 2.25-2.25 2.25s-2.25-1.008-2.25-2.25Z" />
    </svg>
);


interface LandingProps {
  onStartCreating: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStartCreating }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white p-4">
      {/* Background Glows */}
      <div className="absolute top-0 -left-1/4 w-full h-full bg-purple-600/20 rounded-full filter blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 -right-1/4 w-full h-full bg-indigo-600/20 rounded-full filter blur-3xl opacity-50 animate-pulse animation-delay-4000"></div>

      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Content */}
        <div className="flex flex-col gap-6 text-center md:text-left">
          <span className="inline-block bg-purple-500/20 text-purple-300 px-4 py-1 rounded-full self-center md:self-start text-sm font-semibold border border-purple-500/30">
            ⚡ AI-Powered Visual Generation
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            Influence<span className="text-purple-400">Gen</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl">
            Transform your products into stunning influencer marketing visuals with cutting-edge AI.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
              <SmartIntegrationIcon />
              <div>
                <h3 className="font-bold text-white">Smart Product Integration</h3>
                <p className="text-sm text-gray-400">AI places products naturally in influencer hands.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
              <PoseCopyingIcon />
              <div>
                <h3 className="font-bold text-white">Pose Copying</h3>
                <p className="text-sm text-gray-400">Match any reference pose with precision.</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center md:justify-start">
            <button
              onClick={onStartCreating}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Creating
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
               </svg>
            </button>
            <button className="px-8 py-4 bg-white/10 border border-white/20 text-white font-bold rounded-lg text-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="hidden md:flex items-center justify-center p-8">
            <div className="relative w-full aspect-[4/5] max-w-md bg-black/20 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('https://images.pexels.com/photos/3811123/pexels-photo-3811123.jpeg')`}}></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
        </div>
      </div>
       {/* Animated Scroll Down Arrow */}
       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer group" onClick={onStartCreating}>
            <div className="w-6 h-10 border-2 border-gray-400 group-hover:border-white transition-colors rounded-full flex justify-center items-start p-1">
                <div className="w-1 h-2 rounded-full bg-gray-400 group-hover:bg-white transition-colors animate-bounce"></div>
            </div>
        </div>
    </section>
  );
};

export default Landing;