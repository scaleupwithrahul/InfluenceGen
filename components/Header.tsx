
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 md:px-8 py-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          AI Image Fusion Studio
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Powered by Gemini "Nano Banana"
        </p>
      </div>
    </header>
  );
};

export default Header;
