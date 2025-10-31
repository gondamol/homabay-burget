import React from 'react';
import type { ProgressReport, ProjectStatus, AIVerificationStatus } from '../types';
import { CheckCircleIcon, ClockIcon, ExclamationIcon, StalledIcon, UserCircleIcon, CameraIcon, ShieldCheckIcon, ShieldExclamationIcon } from './icons';

interface ReportCardProps {
  report: ProgressReport;
}

const statusInfo: Record<ProjectStatus, { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string; label: string }> = {
  'Completed': { icon: CheckCircleIcon, color: 'text-green-500', label: 'Reported as Completed' },
  'In Progress': { icon: ClockIcon, color: 'text-blue-500', label: 'Reported as In Progress' },
  'Not Started': { icon: ExclamationIcon, color: 'text-gray-500', label: 'Reported as Not Started' },
  'Stalled': { icon: StalledIcon, color: 'text-red-500', label: 'Reported as Stalled' },
};

const verificationInfo: Record<AIVerificationStatus, { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string; label: string }> = {
    'Verified': { icon: ShieldCheckIcon, color: 'text-green-600', label: 'AI Verified' },
    'Pending': { icon: ClockIcon, color: 'text-yellow-600', label: 'Pending AI Review' },
    'Rejected': { icon: ShieldExclamationIcon, color: 'text-red-600', label: 'AI Flagged' }
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const StatusIcon = statusInfo[report.status].icon;
  const VerificationIcon = report.aiVerificationStatus ? verificationInfo[report.aiVerificationStatus].icon : null;
  const verificationDetails = report.aiVerificationStatus ? verificationInfo[report.aiVerificationStatus] : null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start space-x-4">
      <UserCircleIcon className="h-10 w-10 text-gray-400 flex-shrink-0 mt-1"/>
      <div className="flex-1">
        <div className="flex items-center justify-between flex-wrap gap-2">
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
          <div className="mt-3 relative">
             <a href={report.mediaUrl} target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition-opacity">
                <img src={report.mediaUrl} alt="Citizen report media" className="max-h-48 rounded-lg" />
                 <div className="flex items-center mt-1 text-xs text-blue-600 hover:underline">
                    <CameraIcon className="h-3 w-3 mr-1" />
                    View attached image
                </div>
            </a>
            {verificationDetails && VerificationIcon && (
                <div className={`absolute top-2 right-2 flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-sm border ${verificationDetails.color}`}>
                    <VerificationIcon className="h-4 w-4 mr-1"/>
                    {verificationDetails.label}
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
