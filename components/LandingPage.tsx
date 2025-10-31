import React from 'react';
import type { View } from '../types';
import { GovIcon, LightBulbIcon, ChartBarIcon, CheckCircleIcon } from './icons';

interface LandingPageProps {
    onNavigate: (view: View) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    return (
        <div className="relative bg-white">
             {/* Hero Section */}
            <div className="relative isolate pt-14 lg:pt-20">
                <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                    <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#90ee90] to-[#008000] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
                </div>
                <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:py-32 px-6 lg:px-0">
                    <div className="text-center">
                        <GovIcon className="h-20 w-20 text-green-700 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Shape the Future of Homa Bay County
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Your ideas, your budget, your community. The official platform for citizen-led development. Make your voice heard and track the progress of public projects.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <button
                                onClick={() => onNavigate('dashboard')}
                                className="rounded-md bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition"
                            >
                                View Dashboard
                            </button>
                            <button
                                onClick={() => onNavigate('submit')}
                                className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700 transition"
                            >
                                Submit an Idea <span aria-hidden="true">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* How it works Section */}
            <div className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-green-600">How It Works</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            A simple, transparent process
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Participating in your county's development is as easy as one, two, three.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                                        <LightBulbIcon className="h-6 w-6 text-white" />
                                    </div>
                                    1. Submit Your Idea
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Share your project proposals through our easy-to-use web form or simply by sending an SMS. Your idea is the first step towards change.
                                </dd>
                            </div>
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                                        <ChartBarIcon className="h-6 w-6 text-white" />
                                    </div>
                                    2. AI-Powered Analysis
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Our system automatically analyzes all submissions to identify key priorities, common themes, and community sentiment across the county.
                                </dd>
                            </div>
                            <div className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-gray-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
                                        <CheckCircleIcon className="h-6 w-6 text-white" />
                                    </div>
                                    3. Track & Monitor
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-gray-600">
                                    Follow funded projects on the public dashboard. Submit your own progress reports to ensure transparency and accountability from start to finish.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};
