import React, { useState, useMemo } from 'react';
import type { OfficialProject, ProjectStatus } from '../types';
import { HOMA_BAY_LOCATIONS, PROJECT_CATEGORIES, PROJECT_STATUSES } from '../constants';
import { XMarkIcon } from './icons';

interface AddProjectModalProps {
  onClose: () => void;
  onSave: (newProject: Omit<OfficialProject, 'id' | 'reports' | 'forum'>) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        budget: 0,
        location: '',
        subCounty: '',
        ward: '',
        category: '',
        timeline: { start: '', end: '' },
        status: 'Not Started' as ProjectStatus,
    });
    
    const availableWards = useMemo(() => {
        if (!formData.subCounty || !Object.prototype.hasOwnProperty.call(HOMA_BAY_LOCATIONS, formData.subCounty)) {
            return [];
        }
        return HOMA_BAY_LOCATIONS[formData.subCounty as keyof typeof HOMA_BAY_LOCATIONS];
    }, [formData.subCounty]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'subCounty') {
            setFormData(prev => ({...prev, subCounty: value, ward: ''})); // Reset ward on subcounty change
        } else {
            setFormData(prev => ({ ...prev, [name]: name === 'budget' ? Number(value) : value }));
        }
    };
    
    const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, timeline: { ...prev.timeline, [name]: value } }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation
        if (!formData.name || !formData.description || !formData.subCounty || !formData.ward || !formData.category || !formData.timeline.start || !formData.timeline.end) {
            alert('Please fill out all required fields.');
            return;
        }
        // Construct location string
        const location = `${formData.ward}, ${formData.subCounty}`;
        onSave({...formData, location});
        onClose();
    };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="text-xl font-bold text-gray-800">Add New Official Project</h3>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"/>
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700">Budget (KES)</label>
                    <input type="number" name="budget" id="budget" value={formData.budget} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"/>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                        <option value="" disabled>Select a category</option>
                        {PROJECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="subCounty" className="block text-sm font-medium text-gray-700">Sub-County <span className="text-red-500">*</span></label>
                    <select name="subCounty" id="subCounty" value={formData.subCounty} onChange={handleChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                        <option value="" disabled>Select a Sub-County</option>
                        {Object.keys(HOMA_BAY_LOCATIONS).sort().map(sc => <option key={sc} value={sc}>{sc}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="ward" className="block text-sm font-medium text-gray-700">Ward <span className="text-red-500">*</span></label>
                    <select name="ward" id="ward" value={formData.ward} onChange={handleChange} required disabled={!formData.subCounty} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100">
                        <option value="" disabled>Select a Ward</option>
                        {availableWards.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="start" className="block text-sm font-medium text-gray-700">Start Date <span className="text-red-500">*</span></label>
                    <input type="date" name="start" id="start" value={formData.timeline.start} onChange={handleTimelineChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"/>
                </div>
                <div>
                    <label htmlFor="end" className="block text-sm font-medium text-gray-700">End Date <span className="text-red-500">*</span></label>
                    <input type="date" name="end" id="end" value={formData.timeline.end} onChange={handleTimelineChange} required className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"/>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500">
                        {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Add Project</button>
        </div>
      </form>
    </div>
  );
};