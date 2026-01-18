
import React, { useState, useEffect } from 'react';
import Welcome from './components/Welcome';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import History from './components/History';
import { View, UserData, WeeklyPlan } from './types';
import { STORAGE_KEYS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<View>('welcome');
  const [user, setUser] = useState<UserData | null>(null);
  const [activePlan, setActivePlan] = useState<WeeklyPlan | null>(null);
  const [history, setHistory] = useState<WeeklyPlan[]>([]);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    const savedActivePlan = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLAN);
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedActivePlan) {
      setActivePlan(JSON.parse(savedActivePlan));
      setView('dashboard');
    } else if (savedUser) {
      setView('dashboard');
    }
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const handleStartOnboarding = () => setView('onboarding');

  const handleCompleteOnboarding = (userData: UserData, plan: WeeklyPlan) => {
    setUser(userData);
    setActivePlan(plan);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN, JSON.stringify(plan));
    
    // Add to history
    const newHistory = [plan, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(newHistory));
    
    setView('dashboard');
  };

  const handleNewPlan = () => {
    setActivePlan(null);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PLAN);
    setView('onboarding');
  };

  const handleViewHistory = () => setView('history');
  
  const handleLoadFromHistory = (plan: WeeklyPlan) => {
    setActivePlan(plan);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PLAN, JSON.stringify(plan));
    setView('dashboard');
  };

  const renderView = () => {
    const hasHistory = history.length > 0;
    
    switch (view) {
      case 'welcome':
        return (
          <Welcome 
            onStart={handleStartOnboarding} 
            onViewHistory={handleViewHistory}
            hasHistory={hasHistory}
          />
        );
      case 'onboarding':
        return (
          <Onboarding 
            onComplete={handleCompleteOnboarding} 
            onCancel={() => setView('welcome')} 
            onViewHistory={handleViewHistory}
            hasHistory={hasHistory}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            user={user!} 
            plan={activePlan} 
            onNewPlan={handleNewPlan} 
            onViewHistory={handleViewHistory} 
          />
        );
      case 'history':
        return (
          <History 
            items={history} 
            onLoad={handleLoadFromHistory} 
            onBack={() => setView(user ? 'dashboard' : 'welcome')} 
          />
        );
      default:
        return <Welcome onStart={handleStartOnboarding} onViewHistory={handleViewHistory} hasHistory={hasHistory} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderView()}
    </div>
  );
};

export default App;
