import React, { useState, useMemo } from 'react';
import type { ProjectIdea } from '../types';
import { LightBulbIcon, SparklesIcon } from './icons';
import { HOMA_BAY_LOCATIONS, PROJECT_CATEGORIES } from '../constants';
import { enhanceDescription } from '../services/geminiService';


interface SubmissionFormProps {
  onSubmit: (idea: Omit<ProjectIdea, 'id' | 'submittedVia' | 'votes' | 'comments'>) => void;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [subCounty, setSubCounty] = useState('');
  const [ward, setWard] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const availableWards = useMemo(() => {
    if (!subCounty || !Object.prototype.hasOwnProperty.call(HOMA_BAY_LOCATIONS, subCounty)) {
      return [];
    }
    // We can be confident subCounty is a key now.
    return HOMA_BAY_LOCATIONS[subCounty as keyof typeof HOMA_BAY_LOCATIONS];
  }, [subCounty]);

  const handleEnhanceDescription = async () => {
    if (!description.trim()) {
        alert("Please provide a brief description first.");
        return;
    }
    setIsEnhancing(true);
    try {
        const enhanced = await enhanceDescription(description);
        setDescription(enhanced);
    } catch (error) {
        console.error("Failed to enhance description", error);
        alert("Sorry, we couldn't enhance the description at this time.");
    } finally {
        setIsEnhancing(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && category && subCounty && ward) {
      const location = `${ward}, ${subCounty}`;
      onSubmit({ title, description, location, category, subCounty, ward, isAnonymous });
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setSubCounty('');
      setWard('');
      setIsAnonymous(false);
    } else {
      alert('Please fill out all required fields.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <LightBulbIcon className="h-8 w-8 text-yellow-500 mr-3"/>
        <h2 className="text-3xl font-bold text-gray-800">Share Your Idea</h2>
      </div>
      <p className="text-gray-600 mb-8">What project would make a difference in your community? Let the county government know by filling out the form below.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Idea Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
            placeholder="e.g., Install a new borehole at the market"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
            </label>
            <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                required
            >
                <option value="" disabled>Select a category</option>
                {PROJECT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0) + cat.slice(1).toLowerCase()}</option>
                ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="subCounty" className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-County <span className="text-red-500">*</span>
                </label>
                <select
                    id="subCounty"
                    value={subCounty}
                    onChange={(e) => { setSubCounty(e.target.value); setWard(''); }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                    required
                >
                    <option value="" disabled>Select a Sub-County</option>
                    {Object.keys(HOMA_BAY_LOCATIONS).sort().map(sc => <option key={sc} value={sc}>{sc}</option>)}
                </select>
            </div>
            <div>
                 <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">
                    Ward <span className="text-red-500">*</span>
                </label>
                <select
                    id="ward"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    disabled={!subCounty}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition disabled:bg-gray-100"
                    required
                >
                    <option value="" disabled>Select a Ward</option>
                    {availableWards.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
            </div>
        </div>


        <div>
            <div className="flex justify-between items-center mb-1">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Detailed Description <span className="text-red-500">*</span>
                </label>
                <button
                    type="button"
                    onClick={handleEnhanceDescription}
                    disabled={isEnhancing}
                    className="flex items-center px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-wait"
                >
                    <SparklesIcon className="h-4 w-4 mr-1"/>
                    {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                </button>
            </div>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
            placeholder="Explain why this project is important and who it will help. You can write a short description and use the 'Enhance with AI' button for help."
            required
          />
        </div>

        <div className="flex items-start">
            <div className="flex items-center h-5">
                <input
                    id="anonymous"
                    name="anonymous"
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                />
            </div>
            <div className="ml-3 text-sm">
                <label htmlFor="anonymous" className="font-medium text-gray-700">
                    Submit Anonymously
                </label>
                <p className="text-gray-500">If checked, your submission will not be linked to your name.</p>
            </div>
        </div>


        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
          >
            Submit Project Idea
          </button>
        </div>
      </form>
    </div>
  );
};