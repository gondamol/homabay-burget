
import React from 'react';
import type { View } from '../types';
import { GovIcon, LightBulbIcon, ChartBarIcon, CalculatorIcon, UserCircleIcon, MapPinIcon } from './icons';

interface LandingPageProps {
    onNavigate: (view: View) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-900">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image - Beautiful Lake Victoria Scenery */}
                <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1516475429286-465d815a0df7?auto=format&fit=crop&w=1920&q=80" 
                        alt="Homa Bay Lake Victoria Scenery" 
                        className="h-full w-full object-cover"
                        fetchPriority="high"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-black/40 mix-blend-multiply" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center pt-20">
                    <div className="max-w-3xl animate-fade-in-up">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20">
                                <GovIcon className="h-10 w-10 text-white" />
                            </div>
                            <span className="text-white font-bold text-xl tracking-wider uppercase border-l-2 border-yellow-400 pl-3">County Government of Homa Bay</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight drop-shadow-lg">
                            Building a Better <br/>
                            <span className="text-yellow-400">Homa Bay</span> Together
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed drop-shadow-md">
                            From the shores of Lake Victoria to the lush Gwassi Hills, your voice shapes our budget. 
                            Join us in prioritizing development for fishing, farming, infrastructure, and youth empowerment.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => onNavigate('submit')}
                                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold rounded-lg shadow-lg transform hover:-translate-y-1 transition duration-300 flex items-center text-lg"
                            >
                                <LightBulbIcon className="h-6 w-6 mr-2" />
                                Submit Your Idea
                            </button>
                            <button
                                onClick={() => onNavigate('dashboard')}
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-lg hover:bg-white/20 transition duration-300 flex items-center text-lg"
                            >
                                <ChartBarIcon className="h-6 w-6 mr-2" />
                                View Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Highlights Section - Visuals of Homa Bay */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our County, Our Priority</h2>
                        <p className="mt-4 text-xl text-gray-600">Focusing on the key pillars of Homa Bay's economy and well-being.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1: The Lake / Blue Economy */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-xl aspect-[4/5] cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <img 
                                src="https://images.unsplash.com/photo-1534777367038-9404f45b869a?auto=format&fit=crop&w=800&q=80" 
                                alt="Fishermen in wooden boat on Lake Victoria" 
                                className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <h3 className="text-2xl font-bold mb-3">Blue Economy</h3>
                                <p className="text-sm text-gray-200 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    Revitalizing Lake Victoria with modern fish landing sites, processing plants, and sustainable fishing gear for our community.
                                </p>
                            </div>
                        </div>

                        {/* Card 2: Agriculture */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-xl aspect-[4/5] cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <img 
                                src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80" 
                                alt="Green maize field agriculture" 
                                className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <h3 className="text-2xl font-bold mb-3">Agriculture & Food</h3>
                                <p className="text-sm text-gray-200 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    Ensuring food security through subsidized fertilizer, irrigation schemes, and value addition for groundnuts and cotton.
                                </p>
                            </div>
                        </div>

                        {/* Card 3: Youth & Sports */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-xl aspect-[4/5] cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <img 
                                src="https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?auto=format&fit=crop&w=800&q=80" 
                                alt="Children playing soccer on dirt field" 
                                className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <h3 className="text-2xl font-bold mb-3">Youth & Sports</h3>
                                <p className="text-sm text-gray-200 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    Nurturing talent by upgrading stadiums, supporting local leagues, and providing vocational training for our youth.
                                </p>
                            </div>
                        </div>

                        {/* Card 4: Healthcare */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-xl aspect-[4/5] cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <img 
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80" 
                                alt="Medical professional in hospital" 
                                className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <h3 className="text-2xl font-bold mb-3">Universal Health</h3>
                                <p className="text-sm text-gray-200 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    Upgrading Level 4 hospitals, stocking essential medicines, and employing more community health promoters.
                                </p>
                            </div>
                        </div>

                        {/* Card 5: Infrastructure */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-xl aspect-[4/5] cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <img 
                                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80" 
                                alt="Road construction machinery" 
                                className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <h3 className="text-2xl font-bold mb-3">Infrastructure</h3>
                                <p className="text-sm text-gray-200 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    Opening up rural access roads, tarmacking key highways, and building modern market centers for traders.
                                </p>
                            </div>
                        </div>

                        {/* Card 6: Water & Environment */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-xl aspect-[4/5] cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <img 
                                src="https://images.unsplash.com/photo-1574482620266-26b312235b63?auto=format&fit=crop&w=800&q=80" 
                                alt="Clean water flowing from tap" 
                                className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <h3 className="text-2xl font-bold mb-3">Water & Environment</h3>
                                <p className="text-sm text-gray-200 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-4 group-hover:translate-y-0">
                                    Drilling solar-powered boreholes and protecting our water towers to ensure every home has clean drinking water.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Grid / Action Center */}
            <div className="py-20 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Access the Platform</h2>
                        <p className="mt-4 text-xl text-gray-600">Select a service to participate in county development.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Submit Idea */}
                        <div onClick={() => onNavigate('submit')} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl cursor-pointer transition-all duration-300 border-t-4 border-yellow-500 group transform hover:-translate-y-1">
                            <div className="h-14 w-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors duration-300">
                                <LightBulbIcon className="h-7 w-7 text-yellow-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-yellow-600 transition-colors">Submit Proposal</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Have an idea? Submit your project proposal directly to the county planning committee.</p>
                        </div>

                         {/* Dashboard */}
                         <div onClick={() => onNavigate('dashboard')} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl cursor-pointer transition-all duration-300 border-t-4 border-green-500 group transform hover:-translate-y-1">
                            <div className="h-14 w-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors duration-300">
                                <ChartBarIcon className="h-7 w-7 text-green-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">Public Dashboard</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">View ongoing projects, track budget spending, and analyze community priorities with AI.</p>
                        </div>

                        {/* Simulator */}
                        <div onClick={() => onNavigate('simulator')} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl cursor-pointer transition-all duration-300 border-t-4 border-blue-500 group transform hover:-translate-y-1">
                            <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                                <CalculatorIcon className="h-7 w-7 text-blue-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">Budget Simulator</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Try balancing the county budget yourself. Allocate funds and see the impact on development.</p>
                        </div>

                        {/* Admin Portal */}
                        <div onClick={() => onNavigate('admin')} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-2xl cursor-pointer transition-all duration-300 border-t-4 border-gray-600 group transform hover:-translate-y-1">
                            <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-800 transition-colors duration-300">
                                <UserCircleIcon className="h-7 w-7 text-gray-600 group-hover:text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-800 transition-colors">Staff Portal</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">Restricted access for Project Managers, Analysts, and County Admins to manage submissions.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-16 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-1 bg-white/10 rounded">
                                    <GovIcon className="h-8 w-8 text-yellow-500" />
                                </div>
                                <span className="text-2xl font-bold tracking-wide">Homa Bay County</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                                Empowering citizens through participatory budgeting. 
                                Transparent, Accountable, and Inclusive Governance for a prosperous future.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-6 text-white border-b border-gray-700 pb-2 inline-block">Quick Links</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><button onClick={() => onNavigate('dashboard')} className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span>Projects Dashboard</button></li>
                                <li><button onClick={() => onNavigate('submit')} className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span>Submit Proposal</button></li>
                                <li><button onClick={() => onNavigate('simulator')} className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span>Budget Simulator</button></li>
                                <li><button onClick={() => onNavigate('admin')} className="hover:text-yellow-400 transition-colors flex items-center"><span className="mr-2">›</span>Staff Login</button></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-6 text-white border-b border-gray-700 pb-2 inline-block">Contact Us</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li className="flex items-start"><MapPinIcon className="h-5 w-5 mr-3 text-yellow-500 mt-0.5"/> <span>Governor's Office, <br/>Homa Bay Town, Kenya</span></li>
                                <li className="flex items-center"><span className="font-bold text-yellow-500 w-5 mr-3 text-center">@</span> info@homabay.go.ke</li>
                                <li className="flex items-center"><span className="font-bold text-yellow-500 w-5 mr-3 text-center">T</span> +254 700 000 000</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
                        <p>&copy; {new Date().getFullYear()} County Government of Homa Bay. All rights reserved.</p>
                        <p className="mt-2 md:mt-0">Designed for Citizen Engagement.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};
