
import React from 'react';
import type { OfficialProject, ProjectStatus } from '../types';
import { CalendarIcon, CheckCircleIcon, ClockIcon, ExclamationIcon, MapPinIcon, StalledIcon } from './icons';

interface ProjectCardProps {
  project: OfficialProject;
  onSelectProject: (projectId: string) => void;
}

const statusInfo: Record<ProjectStatus, { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string; bgColor: string }> = {
  'Completed': { icon: CheckCircleIcon, color: 'text-green-800', bgColor: 'bg-green-100' },
  'In Progress': { icon: ClockIcon, color: 'text-blue-800', bgColor: 'bg-blue-100' },
  'Not Started': { icon: ExclamationIcon, color: 'text-gray-800', bgColor: 'bg-gray-100' },
  'Stalled': { icon: StalledIcon, color: 'text-red-800', bgColor: 'bg-red-100' },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject }) => {
  const { status } = project;
  const StatusIcon = statusInfo[status].icon;
  
  const completionPercentage = () => {
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
  
  const percentage = completionPercentage();

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
      onClick={() => onSelectProject(project.id)}
    >
      <div className="p-5">
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo[status].bgColor} ${statusInfo[status].color}`}>
          <StatusIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
          {status}
        </div>
        <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-green-600">{project.name}</h3>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{project.description}</p>
        
        <div className="mt-4 text-sm text-gray-600 space-y-2">
            <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span>{project.location}</span>
            </div>
            <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span>Ends: {new Date(project.timeline.end).toLocaleDateString()}</span>
            </div>
        </div>
      </div>
      <div className="mt-auto px-5 pb-5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-gray-500">Timeline Progress</span>
          <span className="text-xs font-semibold text-green-600">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};
