
import React from 'react';
import type { View } from '../types';
import { GovIcon } from './icons';

interface HeaderProps {
    onNavigate: (view: View) => void;
    currentView: View;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentView }) => {
    const navItems: { view: View, label: string }[] = [
        { view: 'dashboard', label: 'Dashboard' },
        { view: 'submit', label: 'Submit Idea' },
        { view: 'simulator', label: 'Budget Simulator' },
        { view: 'admin', label: 'Admin' },
    ];
    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center cursor-pointer" onClick={() => onNavigate('landing')}>
                        <GovIcon className="h-8 w-8 text-green-700" />
                        <span className="ml-2 text-xl font-bold text-gray-800">Homa Bay Connect</span>
                    </div>
                    <nav className="hidden md:flex space-x-6">
                        {navItems.map(item => (
                            <button
                                key={item.view}
                                onClick={() => onNavigate(item.view)}
                                className={`text-sm font-semibold transition-colors ${
                                    currentView === item.view
                                        ? 'text-green-600'
                                        : 'text-gray-500 hover:text-gray-900'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
};
