import React, { useState } from 'react';
import type { ProjectIdea, OfficialProject } from '../types';
import { DocumentChartBarIcon, LightBulbIcon } from './icons';
import { DataExport } from './DataExport';
import { ManageProjectModal } from './ManageProjectModal';
import { ReviewIdeaModal } from './ReviewIdeaModal';


interface AdminDashboardProps {
  projectIdeas: ProjectIdea[];
  officialProjects: OfficialProject[];
  onUpdateIdeaStatus: (ideaId: string, status: ProjectIdea['status']) => void;
  onConvertIdea: (idea: ProjectIdea) => void;
  onUpdateProject: (project: OfficialProject) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    projectIdeas, 
    officialProjects,
    onUpdateIdeaStatus,
    onConvertIdea,
    onUpdateProject,
}) => {
    const [reviewingIdea, setReviewingIdea] = useState<ProjectIdea | null>(null);
    const [managingProject, setManagingProject] = useState<OfficialProject | null>(null);

  const statusColorMap: Record<ProjectIdea['status'], string> = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-blue-100 text-blue-800',
    Rejected: 'bg-red-100 text-red-800',
    Converted: 'bg-green-100 text-green-800',
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      <DataExport projectIdeas={projectIdeas} officialProjects={officialProjects} />

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
                                <button onClick={() => setReviewingIdea(idea)} className="text-green-600 hover:text-green-900">Review</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <DocumentChartBarIcon className="h-6 w-6 mr-2 text-green-700"/>
            Official Projects ({officialProjects.length})
        </h2>
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
                                <button onClick={() => setManagingProject(project)} className="text-green-600 hover:text-green-900">Manage</button>
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
    </div>
  );
};