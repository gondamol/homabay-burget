import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import type { ProjectIdea, OfficialProject, AIAnalysisResult, ProjectStatus, Comment, CountyDocument } from '../types';
import { analyzeSubmissions } from '../services/geminiService';
import { ProjectCard } from './ProjectCard';
import { ProjectIdeaCard } from './ProjectIdeaCard';
import { MapPinIcon, FaceSmileIcon, ChartBarIcon, FilterIcon, ClipboardDocumentListIcon, SearchIcon, UserGroupIcon, DocumentDuplicateIcon } from './icons';
import { HOMA_BAY_LOCATIONS, PROJECT_STATUSES, MOCK_DOCUMENTS } from '../constants';

interface DashboardProps {
  projectIdeas: ProjectIdea[];
  officialProjects: OfficialProject[];
  onSelectProject: (projectId: string) => void;
  votedIdeas: Set<string>;
  onVoteOnIdea: (ideaId: string) => void;
  onAddComment: (ideaId: string, commentText: string) => void;
  onSetChatbotGrounding: (context: {title: string, content: string} | null) => void;
}

const PRIORITY_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const SENTIMENT_COLORS = ['#00C49F', '#FFBB28', '#FF8042']; // Green, Yellow, Red

const calculateCompletionPercentage = (project: OfficialProject) => {
    const start = new Date(project.timeline.start).getTime();
    const end = new Date(project.timeline.end).getTime();
    const now = new Date().getTime();

    if (project.status === 'Completed') return 100;
    if (project.status === 'Not Started' || now < start) return 0;
    if (now > end) return 100; // Should be completed but might be stalled

    const totalDuration = end - start;
    const elapsed = now - start;
    return Math.min(100, Math.round((elapsed / totalDuration) * 100));
};


export const Dashboard: React.FC<DashboardProps> = ({ projectIdeas, officialProjects, onSelectProject, votedIdeas, onVoteOnIdea, onAddComment, onSetChatbotGrounding }) => {
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubCounty, setSelectedSubCounty] = useState('all');
  const [selectedWard, setSelectedWard] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [ideaSort, setIdeaSort] = useState<'newest' | 'most-voted'>('most-voted');

  const availableWards = useMemo(() => {
    if (selectedSubCounty === 'all' || !Object.prototype.hasOwnProperty.call(HOMA_BAY_LOCATIONS, selectedSubCounty)) {
      return [];
    }
    // We can be confident selectedSubCounty is a key now.
    return HOMA_BAY_LOCATIONS[selectedSubCounty as keyof typeof HOMA_BAY_LOCATIONS];
  }, [selectedSubCounty]);

  const projectCategories = useMemo(() => {
    const categories = new Set<string>();
    projectIdeas.forEach(idea => {
        if (idea.category) {
            categories.add(idea.category);
        }
    });
    officialProjects.forEach(project => {
        if (project.category) {
            categories.add(project.category);
        }
    });
    return [...categories].sort();
  }, [projectIdeas, officialProjects]);

  const filteredIdeas = useMemo(() => {
    return projectIdeas.filter(idea => {
      const subCountyMatch = selectedSubCounty === 'all' || idea.subCounty === selectedSubCounty;
      const wardMatch = selectedWard === 'all' || idea.ward === selectedWard;
      return subCountyMatch && wardMatch;
    });
  }, [projectIdeas, selectedSubCounty, selectedWard]);

  const sortedAndFilteredIdeas = useMemo(() => {
    const ideas = [...filteredIdeas];
    if (ideaSort === 'most-voted') {
      ideas.sort((a, b) => b.votes - a.votes);
    } else { // 'newest'
      ideas.sort((a, b) => b.id.localeCompare(a.id));
    }
    return ideas;
  }, [filteredIdeas, ideaSort]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return officialProjects.filter(project => {
      // Location filter
      const subCountyMatch = selectedSubCounty === 'all' || project.subCounty === selectedSubCounty;
      const wardMatch = selectedWard === 'all' || project.ward === selectedWard;
      const locationMatch = project.location === 'County-wide' || (subCountyMatch && wardMatch);
      
      // Category filter
      const categoryMatch = selectedCategory === 'all' || project.category === selectedCategory;

      // Status filter
      const statusMatch = selectedStatus === 'all' || project.status === selectedStatus;

      // Search filter
      const searchMatch = query === '' ||
                          project.name.toLowerCase().includes(query) ||
                          project.description.toLowerCase().includes(query);

      return locationMatch && categoryMatch && searchMatch && statusMatch;
    });
  }, [officialProjects, selectedSubCounty, selectedWard, searchQuery, selectedCategory, selectedStatus]);
  
  const ongoingProjects = useMemo(() => {
    // Note: ongoingProjects should also respect the search query if desired,
    // but for now, we'll keep it tied to just location filters to spotlight all ongoing work in an area.
     return officialProjects.filter(project => {
      if (project.status !== 'In Progress') return false;
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
                {Object.keys(HOMA_BAY_LOCATIONS).sort().map(sc => <option key={sc} value={sc}>{sc}</option>)}
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
                              <ClipboardDocumentListIcon className="h-6 w-6 mr-2 text-green-600"/>
                              Ongoing Project Spotlight
                          </h3>
                          <div className="space-y-4">
                              {ongoingProjects.length > 0 ? (
                                  ongoingProjects.map(project => {
                                      const percentage = calculateCompletionPercentage(project);
                                      return (
                                          <div 
                                              key={project.id} 
                                              onClick={() => onSelectProject(project.id)}
                                              className="p-3 bg-gray-50 rounded-md border hover:bg-gray-100 hover:shadow-sm cursor-pointer transition-all"
                                          >
                                              <div className="flex justify-between items-center flex-wrap gap-2">
                                                  <div>
                                                      <p className="font-semibold text-gray-800">{project.name}</p>
                                                      <p className="text-sm text-gray-500">{project.location}</p>
                                                  </div>
                                                  <div className="text-right">
                                                      <p className="text-xs text-gray-500">Ends: {new Date(project.timeline.end).toLocaleDateString()}</p>
                                                  </div>
                                              </div>
                                              <div className="mt-2 flex items-center gap-3">
                                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                  </div>
                                                  <span className="text-sm font-bold text-green-600">{percentage}%</span>
                                              </div>
                                          </div>
                                      );
                                  })
                              ) : (
                                  <div className="text-sm text-center text-gray-500 p-4 bg-gray-50 rounded-md">
                                      No projects are currently in progress for the selected location.
                                  </div>
                              )}
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
            <DocumentDuplicateIcon className="h-6 w-6 mr-2 text-green-600" />
            County Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_DOCUMENTS.map(doc => (
            <div key={doc.id} className="bg-white p-5 rounded-lg shadow-md">
              <h3 className="font-bold text-gray-800">{doc.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
              <button
                onClick={() => {
                    onSetChatbotGrounding({title: doc.title, content: doc.content});
                    alert(`The AI assistant is now focused on the ${doc.title}. Open the chat to ask questions!`);
                }}
                className="mt-4 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
              >
                Ask AI about this Document &rarr;
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <UserGroupIcon className="h-6 w-6 mr-2 text-green-600" />
                Community Project Ideas
            </h2>
            <select
                value={ideaSort}
                onChange={(e) => setIdeaSort(e.target.value as 'newest' | 'most-voted')}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition text-sm"
                aria-label="Sort project ideas"
            >
                <option value="most-voted">Sort by Most Voted</option>
                <option value="newest">Sort by Newest</option>
            </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAndFilteredIdeas.map(idea => (
                <ProjectIdeaCard 
                    key={idea.id} 
                    idea={idea} 
                    onVote={onVoteOnIdea} 
                    hasVoted={votedIdeas.has(idea.id)} 
                    onAddComment={onAddComment}
                />
            ))}
        </div>
        {sortedAndFilteredIdeas.length === 0 && !loading && (
          <div className="bg-white p-8 rounded-lg shadow-md text-center mt-6">
            <h3 className="text-lg font-semibold text-gray-700">No community ideas match your filter criteria.</h3>
            <p className="text-gray-500 mt-2">Try adjusting the location filters above.</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 my-4 flex items-center">
          <MapPinIcon className="h-6 w-6 mr-2 text-green-600" />
          Funded & Official Projects
        </h2>

        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-1">
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                aria-label="Filter by project category"
            >
                <option value="all">All Categories</option>
                {projectCategories.map(cat => (
                    <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                    </option>
                ))}
            </select>
            <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
                aria-label="Filter by project status"
            >
                <option value="all">All Statuses</option>
                {PROJECT_STATUSES.map(status => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} onSelectProject={onSelectProject} />
          ))}
        </div>
          {filteredProjects.length === 0 && (
              <div className="md:col-span-2 lg:col-span-3 bg-white p-8 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-semibold text-gray-700">No official projects match your search or filter criteria.</h3>
                <p className="text-gray-500 mt-2">Try adjusting the filters or clearing the search.</p>
              </div>
          )}
      </div>
    </div>
  );
};