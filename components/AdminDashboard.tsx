
import React, { useState } from 'react';
import type { ProjectIdea, OfficialProject } from '../types';
import { DocumentChartBarIcon, LightBulbIcon, PlusCircleIcon, ShieldCheckIcon, UserCircleIcon } from './icons';
import { DataExport } from './DataExport';
import { ManageProjectModal } from './ManageProjectModal';
import { ReviewIdeaModal } from './ReviewIdeaModal';
import { AddProjectModal } from './AddProjectModal';


interface AdminDashboardProps {
  projectIdeas: ProjectIdea[];
  officialProjects: OfficialProject[];
  onUpdateIdeaStatus: (ideaId: string, status: ProjectIdea['status']) => void;
  onConvertIdea: (idea: ProjectIdea) => void;
  onUpdateProject: (project: OfficialProject) => void;
  onAddNewProject: (project: Omit<OfficialProject, 'id' | 'reports' | 'forum'>) => void;
}

type AdminRole = 'Super Admin' | 'Project Manager' | 'Data Analyst';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    projectIdeas, 
    officialProjects,
    onUpdateIdeaStatus,
    onConvertIdea,
    onUpdateProject,
    onAddNewProject,
}) => {
    const [reviewingIdea, setReviewingIdea] = useState<ProjectIdea | null>(null);
    const [managingProject, setManagingProject] = useState<OfficialProject | null>(null);
    const [isAddingProject, setIsAddingProject] = useState(false);
    const [currentRole, setCurrentRole] = useState<AdminRole>('Super Admin');

  const statusColorMap: Record<ProjectIdea['status'], string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-blue-100 text-blue-800',
    Rejected: 'bg-red-100 text-red-800',
    Converted: 'bg-green-100 text-green-800',
  }

  // Permissions Logic
  const canExport = ['Super Admin', 'Data Analyst'].includes(currentRole);
  const canManageProjects = ['Super Admin', 'Project Manager'].includes(currentRole);
  const canReviewIdeas = ['Super Admin', 'Project Manager'].includes(currentRole);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        
        {/* Role Switcher for Demo Purposes */}
        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-2">
            <UserCircleIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-600 font-medium">Simulate Role:</span>
            <select 
                value={currentRole} 
                onChange={(e) => setCurrentRole(e.target.value as AdminRole)}
                className="text-sm border-none focus:ring-0 font-bold text-green-700 bg-transparent cursor-pointer outline-none"
            >
                <option value="Super Admin">Super Admin</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Data Analyst">Data Analyst</option>
            </select>
        </div>
      </div>

      {/* Role Context Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg shadow-sm">
        <div className="flex">
          <div className="flex-shrink-0">
            <ShieldCheckIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Current Access Level: <span className="font-bold">{currentRole}</span>.
              {currentRole === 'Super Admin' && ' You have full access to all features.'}
              {currentRole === 'Project Manager' && ' You can manage projects and review ideas. Data export is disabled.'}
              {currentRole === 'Data Analyst' && ' You have read-only access to content but can export data reports. Editing is disabled.'}
            </p>
          </div>
        </div>
      </div>

      {canExport && <DataExport projectIdeas={projectIdeas} officialProjects={officialProjects} />}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-500" />
          Citizen Project Ideas ({projectIdeas.length})
        </h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {projectIdeas.map(idea => (
                        <tr key={idea.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idea.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idea.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idea.votes}</td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColorMap[idea.status]}`}>
                                    {idea.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {canReviewIdeas ? (
                                    <button onClick={() => setReviewingIdea(idea)} className="text-green-600 hover:text-green-900">Review</button>
                                ) : (
                                    <span className="text-gray-400 italic cursor-not-allowed">View Only</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <DocumentChartBarIcon className="h-6 w-6 mr-2 text-green-700"/>
                Official Projects ({officialProjects.length})
            </h2>
            {canManageProjects && (
                <button 
                    onClick={() => setIsAddingProject(true)} 
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add New Project
                </button>
            )}
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {officialProjects.map(project => (
                        <tr key={project.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.status}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.budget.toLocaleString('en-US', { style: 'currency', currency: 'KES' })}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {canManageProjects ? (
                                    <button onClick={() => setManagingProject(project)} className="text-green-600 hover:text-green-900">Manage</button>
                                ) : (
                                    <span className="text-gray-400 italic cursor-not-allowed">View Only</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      {reviewingIdea && (
        <ReviewIdeaModal 
            idea={reviewingIdea}
            onClose={() => setReviewingIdea(null)}
            onUpdateStatus={onUpdateIdeaStatus}
            onConvertToProject={onConvertIdea}
        />
      )}
      {managingProject && (
          <ManageProjectModal
            project={managingProject}
            onClose={() => setManagingProject(null)}
            onSave={onUpdateProject}
          />
      )}
       {isAddingProject && (
        <AddProjectModal 
            onClose={() => setIsAddingProject(false)}
            onSave={onAddNewProject}
        />
      )}
    </div>
  );
};
