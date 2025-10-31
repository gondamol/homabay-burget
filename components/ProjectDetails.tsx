import React, { useState } from 'react';
import type { OfficialProject, ProgressReport, ProjectStatus } from '../types';
import { ReportCard } from './ReportCard';
import { CalendarIcon, CheckCircleIcon, ClockIcon, CurrencyDollarIcon, ExclamationIcon, MapPinIcon, PlusCircleIcon, StalledIcon, UploadIcon } from './icons';

interface ProjectDetailsProps {
  project: OfficialProject;
  onAddReport: (projectId: string, report: Omit<ProgressReport, 'id' | 'author' | 'date'>) => void;
}

const statusInfo: Record<ProjectStatus, { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }> = {
  'Completed': { icon: CheckCircleIcon, color: 'text-green-500' },
  'In Progress': { icon: ClockIcon, color: 'text-blue-500' },
  'Not Started': { icon: ExclamationIcon, color: 'text-gray-500' },
  'Stalled': { icon: StalledIcon, color: 'text-red-500' },
};

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onAddReport }) => {
  const [observation, setObservation] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (observation) {
      // In a real app, you'd upload the file and get a URL.
      // Here, we'll just simulate it.
      const mediaUrl = mediaFile ? 'https://picsum.photos/400/300' : undefined;
      onAddReport(project.id, { observation, status, mediaUrl });
      
      // Reset form
      setObservation('');
      setStatus('In Progress');
      setMediaFile(null);
      setShowReportForm(false);
    }
  };

  const StatusIcon = statusInfo[project.status].icon;
  const statusColor = statusInfo[project.status].color;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
      <div className="border-b pb-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{project.name}</h2>
        <p className="text-gray-600 mt-2">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-4 text-sm text-gray-700">
            <div className={`flex items-center font-semibold ${statusColor}`}>
                <StatusIcon className="h-5 w-5 mr-1.5" />
                {project.status}
            </div>
            <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-1.5 text-green-600"/>
                Budget: {project.budget.toLocaleString('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 })}
            </div>
            <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-1.5 text-gray-500"/>
                {project.location}
            </div>
            <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-1.5 text-gray-500"/>
                {new Date(project.timeline.start).toLocaleDateString()} - {new Date(project.timeline.end).toLocaleDateString()}
            </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Citizen Progress Reports ({project.reports.length})</h3>
           <button 
            onClick={() => setShowReportForm(!showReportForm)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Add Report
          </button>
        </div>

        {showReportForm && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                <form onSubmit={handleSubmitReport} className="space-y-4">
                     <div>
                        <label htmlFor="observation" className="block text-sm font-medium text-gray-700">Your Observation</label>
                        <textarea
                            id="observation"
                            rows={3}
                            value={observation}
                            onChange={e => setObservation(e.target.value)}
                            className="mt-1 shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                            placeholder="What have you seen on the ground?"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Current Project Status</label>
                        <select id="status" value={status} onChange={e => setStatus(e.target.value as ProjectStatus)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                            <option>Not Started</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                            <option>Stalled</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Attach Photo (Optional)</label>
                         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                            <UploadIcon className="mx-auto h-12 w-12 text-gray-400"/>
                            <div className="flex text-sm text-gray-600">
                                <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500"
                                >
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">{mediaFile ? `Selected: ${mediaFile.name}` : 'PNG, JPG up to 10MB'}</p>
                            </div>
                        </div>
                    </div>
                     <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowReportForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">Submit Report</button>
                    </div>
                </form>
            </div>
        )}

        {project.reports.length > 0 ? (
          <div className="space-y-4">
            {project.reports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No citizen reports have been submitted for this project yet.</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to add an update!</p>
          </div>
        )}
      </div>
    </div>
  );
};
