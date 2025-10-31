import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SubmissionForm } from './components/SubmissionForm';
import { ProjectDetails } from './components/ProjectDetails';
import { LandingPage } from './components/LandingPage';
import { BudgetSimulator } from './components/BudgetSimulator';
import { AIConciergeModal } from './components/AIConciergeModal';
import type { View, ProjectIdea, OfficialProject, ProgressReport } from './types';
import { MOCK_PROJECT_IDEAS, MOCK_OFFICIAL_PROJECTS } from './constants';
import { getConciergeResponse } from './services/geminiService';


export default function App(): React.ReactElement {
  const [view, setView] = useState<View>('landing');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [conciergeResponse, setConciergeResponse] = useState<string | null>(null);

  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>(MOCK_PROJECT_IDEAS);
  const [officialProjects, setOfficialProjects] = useState<OfficialProject[]>(MOCK_OFFICIAL_PROJECTS);

  const handleAddProjectIdea = async (idea: Omit<ProjectIdea, 'id' | 'submittedVia'>) => {
    const newIdea: ProjectIdea = {
      id: `idea-${Date.now()}`,
      ...idea,
      submittedVia: 'web',
    };
    
    // Simulate getting a response from the AI concierge
    const response = await getConciergeResponse(newIdea, projectIdeas);
    setConciergeResponse(response);

    setProjectIdeas(prevIdeas => [newIdea, ...prevIdeas]);
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
        />;
    }
  }, [view, projectIdeas, officialProjects, selectedProject]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {view !== 'landing' && <Header currentView={view} setView={setView} />}
      <main className={view !== 'landing' ? "p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto" : ""}>
        {renderContent()}
      </main>
      {conciergeResponse && <AIConciergeModal response={conciergeResponse} onClose={handleCloseConcierge} />}
    </div>
  );
}
