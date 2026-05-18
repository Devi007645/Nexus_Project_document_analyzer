import React from 'react';
import { useAppStore } from './store/useAppStore';
import { LandingView } from './components/landing/LandingView';
import { DashboardWorkspace } from './components/dashboard/DashboardWorkspace';

export const App: React.FC = () => {
  const { activeView } = useAppStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased font-sans">
      {activeView === 'landing' ? <LandingView /> : <DashboardWorkspace />}
    </div>
  );
};

export default App;
