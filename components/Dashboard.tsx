import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import type { ProjectIdea, OfficialProject, AIAnalysisResult } from '../types';
import { analyzeSubmissions } from '../services/geminiService';
import { ProjectCard } from './ProjectCard';
import { MapPinIcon, FaceSmileIcon, ChartBarIcon, FilterIcon, DocumentTextIcon } from './icons';
import { HOMA_BAY_LOCATIONS } from '../constants';

interface DashboardProps {
  projectIdeas: ProjectIdea[];
  officialProjects: OfficialProject[];
  onSelectProject: (projectId: string) => void;
}

const PRIORITY_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const SENTIMENT_COLORS = ['#00C49F', '#FFBB28', '#FF8042']; // Green, Yellow, Red

export const Dashboard: React.FC<DashboardProps> = ({ projectIdeas, officialProjects, onSelectProject }) => {
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubCounty, setSelectedSubCounty] = useState('all');
  const [selectedWard, setSelectedWard] = useState('all');

  const availableWards = useMemo(() => {
    if (selectedSubCounty === 'all' || !HOMA_BAY_LOCATIONS[selectedSubCounty as keyof typeof HOMA_BAY_LOCATIONS]) {
      return [];
    }
    return HOMA_BAY_LOCATIONS[selectedSubCounty as keyof typeof HOMA_BAY_LOCATIONS];
  }, [selectedSubCounty]);

  const filteredIdeas = useMemo(() => {
    return projectIdeas.filter(idea => {
      const subCountyMatch = selectedSubCounty === 'all' || idea.subCounty === selectedSubCounty;
      const wardMatch = selectedWard === 'all' || idea.ward === selectedWard;
      return subCountyMatch && wardMatch;
    });
  }, [projectIdeas, selectedSubCounty, selectedWard]);

  const filteredProjects = useMemo(() => {
    return officialProjects.filter(project => {
      if (project.location === 'County-wide') return true;
      const subCountyMatch = selectedSubCounty === 'all' || project.subCounty === selectedSubCounty;
      const wardMatch = selectedWard === 'all' || project.ward === selectedWard;
      return subCountyMatch && wardMatch;
    });
  }, [officialProjects, selectedSubCounty, selectedWard]);

  useEffect(() => {
    const performAnalysis = async () => {
      if (filteredIdeas.length === 0) {
        setAnalysisResult(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      const result = await analyzeSubmissions(filteredIdeas);
      setAnalysisResult(result);
      setLoading(false);
    };

    performAnalysis();
  }, [filteredIdeas]);
  
  const handleSubCountyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubCounty(e.target.value);
    setSelectedWard('all');
  };

  const renderLoadingSkeleton = (className: string) => (
    <div className={`bg-white p-6 rounded-lg shadow-md animate-pulse ${className}`}>
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
  
  const sentimentData = analysisResult ? [
      { name: 'Positive', value: analysisResult.sentiment.positive },
      { name: 'Neutral', value: analysisResult.sentiment.neutral },
      { name: 'Negative', value: analysisResult.sentiment.negative },
  ].filter(item => item.value > 0) : [];

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center mb-2">
            <FilterIcon className="h-5 w-5 mr-2 text-gray-600"/>
            <h3 className="font-semibold text-gray-800">Filter by Location</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
                value={selectedSubCounty}
                onChange={handleSubCountyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
            >
                <option value="all">All Sub-Counties</option>
                {Object.keys(HOMA_BAY_LOCATIONS).map(sc => <option key={sc} value={sc}>{sc}</option>)}
            </select>
            <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                disabled={selectedSubCounty === 'all'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition disabled:bg-gray-100"
            >
                <option value="all">All Wards</option>
                {availableWards.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2 text-green-600" />
          AI-Powered Priority Analysis
        </h2>
        <p className="text-gray-600 mb-6">
          Our AI analyzes all citizen submissions to identify needs and sentiment. 
          Displaying insights for {filteredIdeas.length} ideas in the selected area.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loading ? renderLoadingSkeleton('lg:col-span-3') : analysisResult && (
                <>
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md flex flex-col">
                      <h3 className="font-bold text-lg mb-4">Top Citizen Priorities</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analysisResult.topPriorities} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="topic" />
                          <YAxis allowDecimals={false} />
                          <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} />
                          <Legend />
                          <Bar dataKey="count" name="Submissions" fill="#16a34a">
                            {analysisResult.topPriorities.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-8 border-t pt-6">
                          <h3 className="font-bold text-lg mb-4 flex items-center">
                              <DocumentTextIcon className="h-6 w-6 mr-2 text-green-600"/>
                              Recent Submissions
                          </h3>
                          <div className="space-y-3">
                              {filteredIdeas.slice(0, 5).map(idea => (
                                  <div key={idea.id} className="text-sm p-3 bg-gray-50 rounded-md border">
                                      <p className="font-semibold text-gray-800">{idea.title}</p>
                                      <p className="text-gray-500">{idea.location} - <span className="capitalize text-xs font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">{idea.submittedVia}</span></p>
                                  </div>
                              ))}
                          </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md space-y-3">
                        <h3 className="font-bold text-lg mb-2">Priority Details</h3>
                        {analysisResult.topPriorities.slice(0,5).map((item, index) => (
                            <div key={item.topic} className="flex items-start">
                                <div className="flex-shrink-0 h-5 w-5 rounded-full mt-0.5" style={{ backgroundColor: PRIORITY_COLORS[index % PRIORITY_COLORS.length] }}></div>
                                <div className="ml-3">
                                <p className="text-sm font-semibold text-gray-800">{item.topic} ({item.count} submissions)</p>
                                <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                         <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="font-bold text-lg mb-4 flex items-center">
                                <FaceSmileIcon className="h-6 w-6 mr-2 text-green-600" />
                                Submission Sentiment
                            </h3>
                             <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={sentimentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {sentimentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
            {!loading && !analysisResult && (
                <div className="lg:col-span-3 bg-white p-8 rounded-lg shadow-md text-center">
                    <h3 className="text-lg font-semibold text-gray-700">No submissions found for the selected location.</h3>
                    <p className="text-gray-500 mt-2">Try adjusting the filters or be the first to submit an idea for this area!</p>
                </div>
            )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <MapPinIcon className="h-6 w-6 mr-2 text-green-600" />
          Funded & Official Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} onSelectProject={onSelectProject} />
          ))}
        </div>
          {filteredProjects.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-semibold text-gray-700">No official projects match the selected location.</h3>
                <p className="text-gray-500 mt-2">Adjust the filters to see projects in other areas.</p>
              </div>
          )}
      </div>
    </div>
  );
};