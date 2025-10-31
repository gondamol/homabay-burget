
import React from 'react';
import type { ProgressReport, ProjectStatus } from '../types';
import { CheckCircleIcon, ClockIcon, ExclamationIcon, StalledIcon, UserCircleIcon, CameraIcon } from './icons';

interface ReportCardProps {
  report: ProgressReport;
}

const statusInfo: Record<ProjectStatus, { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string; label: string }> = {
  'Completed': { icon: CheckCircleIcon, color: 'text-green-500', label: 'Reported as Completed' },
  'In Progress': { icon: ClockIcon, color: 'text-blue-500', label: 'Reported as In Progress' },
  'Not Started': { icon: ExclamationIcon, color: 'text-gray-500', label: 'Reported as Not Started' },
  'Stalled': { icon: StalledIcon, color: 'text-red-500', label: 'Reported as Stalled' },
};


export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const StatusIcon = statusInfo[report.status].icon;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start space-x-4">
      <UserCircleIcon className="h-10 w-10 text-gray-400 flex-shrink-0 mt-1"/>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">{report.author}</p>
            <p className="text-xs text-gray-500">{new Date(report.date).toLocaleString()}</p>
          </div>
          <div className={`flex items-center text-sm font-medium ${statusInfo[report.status].color}`}>
            <StatusIcon className="h-5 w-5 mr-1.5" />
            <span>{statusInfo[report.status].label}</span>
          </div>
        </div>
        <p className="mt-2 text-gray-700 text-sm">
          {report.observation}
        </p>
        {report.mediaUrl && (
          <div className="mt-3">
             <a href={report.mediaUrl} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition-opacity">
                <img src={report.mediaUrl} alt="Citizen report media" className="max-h-48 rounded-lg" />
                 <div className="flex items-center mt-1 text-xs text-blue-600 hover:underline">
                    <CameraIcon className="h-3 w-3 mr-1" />
                    View attached image
                </div>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
