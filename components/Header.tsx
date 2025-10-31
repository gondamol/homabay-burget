import React from 'react';
import type { View } from '../types';
import { GovIcon } from './icons';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItemClasses = (view: View) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      currentView === view 
      ? 'bg-green-100 text-green-800' 
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <GovIcon className="h-10 w-10 text-green-700" />
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-800">Homa Bay County</h1>
              <p className="text-sm text-gray-500">Participatory Budgeting Platform</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
             <button
              onClick={() => setView('dashboard')}
              className={navItemClasses('dashboard')}
            >
              Dashboard
            </button>
             <button
              onClick={() => setView('budget-simulator')}
              className={navItemClasses('budget-simulator')}
            >
              Budget Simulator
            </button>
            <button
              onClick={() => setView('submit')}
              className="px-3 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Submit an Idea
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
