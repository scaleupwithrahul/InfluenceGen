import React, { useState, useRef } from 'react';
import Landing from './components/Landing';
import InfluencerFusion from './components/InfluencerFusion';
import PoseTransfer from './components/PoseTransfer';
import type { HistoryEntry } from './types';

type Tab = 'fusion' | 'pose';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('fusion');
  const [fusionHistory, setFusionHistory] = useState<HistoryEntry[]>([]);
  const [poseHistory, setPoseHistory] = useState<HistoryEntry[]>([]);
  
  const mainContentRef = useRef<HTMLDivElement>(null);

  const handleStartCreating = () => {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'fusion':
        return <InfluencerFusion history={fusionHistory} setHistory={setFusionHistory} />;
      case 'pose':
        return <PoseTransfer history={poseHistory} setHistory={setPoseHistory} />;
      default:
        return null;
    }
  };

  const TabButton: React.FC<{ tab: Tab; label: string }> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/50 relative ${
        activeTab === tab
          ? 'text-white'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
       {activeTab === tab && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></span>
       )}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0B011D] text-gray-100 font-sans">
      <Landing onStartCreating={handleStartCreating} />
      <main ref={mainContentRef} className="container mx-auto p-4 md:p-8">
        <h2 className="text-4xl font-bold text-center mb-4 pt-16">Start Creating</h2>
        <p className="text-gray-400 text-center mb-12">Choose a tool to begin your visual masterpiece.</p>
        <div className="flex justify-center border-b border-white/10 mb-8">
          <TabButton tab="fusion" label="Smart Product Integration" />
          <TabButton tab="pose" label="Pose Copying" />
        </div>
        {renderTabContent()}
      </main>
    </div>
  );
};

export default App;