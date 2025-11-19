
import React, { useState, useEffect } from 'react';
import type { View, ProjectIdea, OfficialProject, ProgressReport, ForumPost, Comment, ForumPostReply, Message } from './types';
import { MOCK_PROJECT_IDEAS, MOCK_OFFICIAL_PROJECTS } from './constants';
import { getConciergeResponse } from './services/geminiService';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { ProjectDetails } from './components/ProjectDetails';
import { SubmissionForm } from './components/SubmissionForm';
import { AIConciergeModal } from './components/AIConciergeModal';
import { Chatbot } from './components/Chatbot';
import { AdminDashboard } from './components/AdminDashboard';
import { BudgetSimulator } from './components/BudgetSimulator';


const App: React.FC = () => {
    const [view, setView] = useState<View>('landing');
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>(() => {
        const savedIdeas = localStorage.getItem('projectIdeas');
        return savedIdeas ? JSON.parse(savedIdeas) : MOCK_PROJECT_IDEAS;
    });
    const [officialProjects, setOfficialProjects] = useState<OfficialProject[]>(() => {
        const savedProjects = localStorage.getItem('officialProjects');
        return savedProjects ? JSON.parse(savedProjects) : MOCK_OFFICIAL_PROJECTS;
    });
    const [votedIdeas, setVotedIdeas] = useState<Set<string>>(() => {
        const savedVotes = localStorage.getItem('votedIdeas');
        return savedVotes ? new Set(JSON.parse(savedVotes)) : new Set();
    });
    const [conciergeResponse, setConciergeResponse] = useState<string | null>(null);
    const [chatbotGrounding, setChatbotGrounding] = useState<{title: string, content: string} | null>(null);
    const [budgetSubmissions, setBudgetSubmissions] = useState<Record<string, number>[]>(() => {
        const savedSubmissions = localStorage.getItem('budgetSubmissions');
        return savedSubmissions ? JSON.parse(savedSubmissions) : [];
    });
    const [chatHistory, setChatHistory] = useState<Message[]>(() => {
        const savedHistory = localStorage.getItem('chatHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });

    useEffect(() => {
        localStorage.setItem('projectIdeas', JSON.stringify(projectIdeas));
    }, [projectIdeas]);

    useEffect(() => {
        localStorage.setItem('officialProjects', JSON.stringify(officialProjects));
    }, [officialProjects]);

    useEffect(() => {
        localStorage.setItem('votedIdeas', JSON.stringify(Array.from(votedIdeas)));
    }, [votedIdeas]);

    useEffect(() => {
        localStorage.setItem('budgetSubmissions', JSON.stringify(budgetSubmissions));
    }, [budgetSubmissions]);

    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }, [chatHistory]);


    const handleNavigate = (newView: View) => {
        setView(newView);
        setSelectedProjectId(null); // Reset project selection on view change
    };

    const handleSelectProject = (projectId: string) => {
        setSelectedProjectId(projectId);
        setView('details');
    };

    const handleSubmission = async (idea: Omit<ProjectIdea, 'id' | 'submittedVia' | 'votes' | 'comments' | 'status'>) => {
        const newIdea: ProjectIdea = {
            ...idea,
            id: `idea-${Date.now()}`,
            submittedVia: 'web',
            votes: 1,
            comments: [],
            status: 'Pending',
        };
        const response = await getConciergeResponse(newIdea, projectIdeas);
        setConciergeResponse(response);
        setProjectIdeas(prev => [newIdea, ...prev]);
        setVotedIdeas(prev => new Set(prev).add(newIdea.id));
    };
    
    const handleCloseConcierge = () => {
        setConciergeResponse(null);
        setView('dashboard');
    }

    const handleVoteOnIdea = (ideaId: string) => {
        if (votedIdeas.has(ideaId)) return;
        setProjectIdeas(prev => prev.map(idea =>
            idea.id === ideaId ? { ...idea, votes: idea.votes + 1 } : idea
        ));
        setVotedIdeas(prev => new Set(prev).add(ideaId));
    };

    const handleAddComment = (ideaId: string, commentText: string) => {
        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            author: 'Citizen',
            text: commentText,
            date: new Date().toISOString(),
        };
        setProjectIdeas(prev => prev.map(idea =>
            idea.id === ideaId ? { ...idea, comments: [...idea.comments, newComment] } : idea
        ));
    };
    
    const handleAddReport = (projectId: string, report: Omit<ProgressReport, 'id' | 'author' | 'date'>) => {
        const newReport: ProgressReport = {
            ...report,
            id: `rep-${projectId}-${Date.now()}`,
            author: 'Citizen Reporter',
            date: new Date().toISOString(),
            aiVerificationStatus: 'Pending',
        };
        setOfficialProjects(prev => prev.map(p =>
            p.id === projectId ? { ...p, reports: [newReport, ...p.reports] } : p
        ));
    };
    
    const handleAddForumPost = (projectId: string, post: Omit<ForumPost, 'id' | 'author' | 'date' | 'replies'>) => {
        const newPost: ForumPost = {
            ...post,
            id: `post-${projectId}-${Date.now()}`,
            author: 'Concerned Citizen',
            date: new Date().toISOString(),
            replies: [],
        };
        setOfficialProjects(prev => prev.map(p =>
            p.id === projectId ? { ...p, forum: [newPost, ...p.forum] } : p
        ));
    };

    const handleAddForumReply = (projectId: string, postId: string, replyText: string) => {
        const newReply: ForumPostReply = {
            id: `reply-${postId}-${Date.now()}`,
            author: 'Resident',
            text: replyText,
            date: new Date().toISOString(),
        };
        setOfficialProjects(prev => prev.map(p => {
            if (p.id !== projectId) return p;
            return {
                ...p,
                forum: p.forum.map(post => {
                    if (post.id !== postId) return post;
                    return { ...post, replies: [...post.replies, newReply] };
                })
            }
        }));
    };
    
    const handleBudgetSubmit = (allocation: Record<string, number>) => {
        setBudgetSubmissions(prev => [...prev, allocation]);
    };
    
    const handleSetChatbotGrounding = (context: {title: string, content: string} | null) => {
        setChatbotGrounding(context);
        setChatHistory([]); // Clear history when context changes
    };

    const handleClearGrounding = () => {
        setChatbotGrounding(null);
        setChatHistory([]); // Clear history when context is cleared
    };

    // Admin Handlers
    const handleUpdateProjectIdeaStatus = (ideaId: string, status: ProjectIdea['status']) => {
        setProjectIdeas(prev => prev.map(idea => 
            idea.id === ideaId ? { ...idea, status } : idea
        ));
    };
    
    const handleConvertIdeaToProject = (idea: ProjectIdea) => {
        const newOfficialProject: OfficialProject = {
            id: `proj-${Date.now()}`,
            name: idea.title,
            description: idea.description,
            budget: 0, // Admin needs to set this
            location: idea.location,
            subCounty: idea.subCounty,
            ward: idea.ward,
            category: idea.category,
            timeline: { start: new Date().toISOString().split('T')[0], end: '' }, // Admin needs to set end date
            status: 'Not Started',
            reports: [],
            forum: [],
        };
        setOfficialProjects(prev => [newOfficialProject, ...prev]);
        handleUpdateProjectIdeaStatus(idea.id, 'Converted');
        alert(`"${idea.title}" has been converted to an official project. You can now manage it in the Official Projects table.`);
    };

    const handleUpdateOfficialProject = (updatedProject: OfficialProject) => {
        setOfficialProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    };

    const handleAddNewOfficialProject = (projectData: Omit<OfficialProject, 'id' | 'reports' | 'forum'>) => {
        const newProject: OfficialProject = {
            ...projectData,
            id: `proj-${Date.now()}`,
            reports: [],
            forum: [],
        };
        setOfficialProjects(prev => [newProject, ...prev]);
    };


    const renderContent = () => {
        if (view === 'details' && selectedProjectId) {
            const project = officialProjects.find(p => p.id === selectedProjectId);
            if (project) {
                return <ProjectDetails project={project} onAddReport={handleAddReport} onAddForumPost={handleAddForumPost} onAddForumReply={handleAddForumReply} />;
            }
        }
        switch (view) {
            case 'dashboard':
                return <Dashboard 
                            projectIdeas={projectIdeas} 
                            officialProjects={officialProjects} 
                            onSelectProject={handleSelectProject} 
                            votedIdeas={votedIdeas}
                            onVoteOnIdea={handleVoteOnIdea}
                            onAddComment={handleAddComment}
                            onSetChatbotGrounding={handleSetChatbotGrounding}
                       />;
            case 'submit':
                return <SubmissionForm onSubmit={handleSubmission} />;
            case 'admin':
                return <AdminDashboard 
                            projectIdeas={projectIdeas} 
                            officialProjects={officialProjects}
                            onUpdateIdeaStatus={handleUpdateProjectIdeaStatus}
                            onConvertIdea={handleConvertIdeaToProject}
                            onUpdateProject={handleUpdateOfficialProject}
                            onAddNewProject={handleAddNewOfficialProject}
                        />;
            case 'simulator':
                return <BudgetSimulator projectIdeas={projectIdeas} budgetSubmissions={budgetSubmissions} onBudgetSubmit={handleBudgetSubmit} />;
            case 'landing':
                return <LandingPage onNavigate={handleNavigate} />;
            default:
                return <LandingPage onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {view !== 'landing' && <Header onNavigate={handleNavigate} currentView={view} />}
            {view === 'landing' ? (
                renderContent()
            ) : (
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {renderContent()}
                </main>
            )}
            {conciergeResponse && <AIConciergeModal response={conciergeResponse} onClose={handleCloseConcierge} />}
            <Chatbot 
                groundingContext={chatbotGrounding} 
                onClearGrounding={handleClearGrounding}
                history={chatHistory}
                setHistory={setChatHistory}
            />
        </div>
    );
};

export default App;
