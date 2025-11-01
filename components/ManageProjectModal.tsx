import React, { useState } from 'react';
import type { OfficialProject, ProjectStatus } from '../types';
import { PROJECT_STATUSES } from '../constants';
import { XMarkIcon } from './icons';

interface ManageProjectModalProps {
  project: OfficialProject;
  onClose: () => void;
  onSave: (updatedProject: OfficialProject) => void;
}

export const ManageProjectModal: React.FC<ManageProjectModalProps> = ({ project, onClose, onSave }) => {
    const [formData, setFormData] = useState<OfficialProject>(project);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'budget' ? Number(value) : value }));
    };
    
    const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, timeline: { ...prev.timeline, [name]: value } }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="text-xl font-bold text-gray-800">Manage Official Project</h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"/>
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (KES)</label>
                    <input type="number" name="budget" id="budget" value={formData.budget} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"/>
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                        {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="start" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <input type="date" name="start" id="start" value={formData.timeline.start} onChange={handleTimelineChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"/>
                </div>
                <div>
                    <label htmlFor="end" className="block text-sm font-medium text-gray-700">End Date</label>
                    <input type="date" name="end" id="end" value={formData.timeline.end} onChange={handleTimelineChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"/>
                </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Save Changes</button>
        </div>
      </form>
    </div>
  );
};
