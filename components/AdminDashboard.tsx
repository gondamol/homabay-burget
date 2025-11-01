
import React from 'react';
import type { ProjectIdea, OfficialProject } from '../types';
import { DocumentChartBarIcon, LightBulbIcon } from './icons';

interface AdminDashboardProps {
  projectIdeas: ProjectIdea[];
  officialProjects: OfficialProject[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ projectIdeas, officialProjects }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

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
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {projectIdeas.map(idea => (
                        <tr key={idea.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{idea.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idea.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{idea.votes}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-green-600 hover:text-green-900">Review</button>
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
                                <button className="text-green-600 hover:text-green-900">Manage</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};
