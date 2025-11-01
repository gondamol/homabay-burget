import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SubmissionForm } from './components/SubmissionForm';
import { ProjectDetails } from './components/ProjectDetails';
import { LandingPage } from './components/LandingPage';
import { BudgetSimulator } from './components/BudgetSimulator';
import { AIConciergeModal } from './components/AIConciergeModal';
import { Chatbot } from './components/Chatbot';
import type { View, ProjectIdea, OfficialProject, ProgressReport, Comment } from './types';
import { MOCK_PROJECT_IDEAS, MOCK_OFFICIAL_PROJECTS } from './constants';
import { getConciergeResponse } from './services/geminiService';

const PROJECT_IDEAS_STORAGE_KEY = 'homa-bay-project-ideas';

export default function App(): React.ReactElement {
  const [view, setView] = useState<View>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [conciergeResponse, setConciergeResponse] = useState<string | null>(null);

  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>(() => {
    try {
      const storedIdeas = window.localStorage.getItem(PROJECT_IDEAS_STORAGE_KEY);
      return storedIdeas ? JSON.parse(storedIdeas) : MOCK_PROJECT_IDEAS;
    } catch (error) {
      console.error("Error reading project ideas from localStorage", error);
      return MOCK_PROJECT_IDEAS;
    }
  });

  const [officialProjects, setOfficialProjects] = useState<OfficialProject[]>(MOCK_OFFICIAL_PROJECTS);
  const [votedIdeas, setVotedIdeas] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      window.localStorage.setItem(PROJECT_IDEAS_STORAGE_KEY, JSON.stringify(projectIdeas));
    } catch (error) {
      console.error("Error saving project ideas to localStorage", error);
    }
  }, [projectIdeas]);

  const handleAddProjectIdea = async (idea: Omit<ProjectIdea, 'id' | 'submittedVia' | 'votes' | 'comments'>) => {
    const newIdea: ProjectIdea = {
      id: `idea-${Date.now()}`,
      ...idea,
      votes: 0,
      submittedVia: 'web',
      comments: [],
    };
    
    // Simulate getting a response from the AI concierge
    const response = await getConciergeResponse(newIdea, projectIdeas);
    setConciergeResponse(response);

    setProjectIdeas(prevIdeas => [newIdea, ...prevIdeas]);
  };
  
  const handleAddComment = (ideaId: string, commentText: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      author: 'Citizen', // In a real app, this would come from user auth
      text: commentText,
      date: new Date().toISOString(),
    };

    setProjectIdeas(prevIdeas => 
      prevIdeas.map(idea => 
        idea.id === ideaId 
          ? { ...idea, comments: [...idea.comments, newComment] }
          : idea
      )
    );
  };

  const handleCloseConcierge = () => {
    setConciergeResponse(null);
    setView('dashboard');
  }

  const handleAddProgressReport = (projectId: string, report: Omit<ProgressReport, 'id' | 'author' | 'date'>) => {
    setOfficialProjects(prevProjects =>
      prevProjects.map(p => {
        if (p.id === projectId) {
          const newReport: ProgressReport = {
            id: `report-${Date.now()}`,
            author: 'Citizen Reporter',
            date: new Date().toISOString(),
            aiVerificationStatus: report.mediaUrl ? 'Pending' : undefined,
            ...report,
          };
          return { ...p, reports: [newReport, ...p.reports] };
        }
        return p;
      })
    );
  };
  
  const handleVoteOnIdea = (ideaId: string) => {
    if (votedIdeas.has(ideaId)) return;

    setProjectIdeas(prevIdeas => 
      prevIdeas.map(idea => 
        idea.id === ideaId ? { ...idea, votes: idea.votes + 1 } : idea
      )
    );
    setVotedIdeas(prevVoted => new Set(prevVoted).add(ideaId));
  };


  const navigateToProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setView('project');
  };

  const selectedProject = officialProjects.find(p => p.id === selectedProjectId);

  const renderContent = useCallback(() => {
    switch (view) {
      case 'landing':
        return <LandingPage onNavigate={setView} />;
      case 'submit':
        return <SubmissionForm onSubmit={handleAddProjectIdea} />;
      case 'project':
        if (selectedProject) {
          return <ProjectDetails project={selectedProject} onAddReport={handleAddProgressReport} />;
        }
        setView('dashboard'); // Fallback if project not found
        return null;
      case 'budget-simulator':
        return <BudgetSimulator projectIdeas={projectIdeas} />;
      case 'dashboard':
      default:
        return <Dashboard 
          projectIdeas={projectIdeas} 
          officialProjects={officialProjects}
          onSelectProject={navigateToProject} 
          votedIdeas={votedIdeas}
          onVoteOnIdea={handleVoteOnIdea}
          onAddComment={handleAddComment}
        />;
    }
  }, [view, projectIdeas, officialProjects, selectedProject, votedIdeas]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {view !== 'landing' && <Header currentView={view} setView={setView} />}
      <main className={view !== 'landing' ? "p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto" : ""}>
        {renderContent()}
      </main>
      {conciergeResponse && <AIConciergeModal response={conciergeResponse} onClose={handleCloseConcierge} />}
      {view !== 'landing' && <Chatbot />}
    </div>
  );
}