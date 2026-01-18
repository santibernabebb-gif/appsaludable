
import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './src/pages/Home';
import Wizard from './src/pages/Wizard';
import Plan from './src/pages/Plan';
import Recipes from './src/pages/Recipes';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#fbfcfd]">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#00a86b] rounded-md flex items-center justify-center text-white font-bold text-lg">A</div>
              <div className="flex flex-col -gap-1">
                <span className="font-bold text-sm tracking-tight text-gray-900 leading-none">
                  Adelgaza Saludable
                </span>
                <span className="text-[10px] text-[#00a86b] font-bold uppercase tracking-wider leading-none">
                  APP VERSION
                </span>
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wizard/*" element={<Wizard />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/recipes" element={<Recipes />} />
          </Routes>
        </main>

        <footer className="py-6 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
              © {new Date().getFullYear()} ADELGAZA SALUDABLE · SANTISYSTEMS MOBILE
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
