import React from 'react';
import type { ProjectIdea } from '../types';
import { XMarkIcon } from './icons';

interface ReviewIdeaModalProps {
  idea: ProjectIdea;
  onClose: () => void;
  onUpdateStatus: (ideaId: string, status: ProjectIdea['status']) => void;
  onConvertToProject: (idea: ProjectIdea) => void;
}

export const ReviewIdeaModal: React.FC<ReviewIdeaModalProps> = ({ idea, onClose, onUpdateStatus, onConvertToProject }) => {
    
    const handleAction = (status: ProjectIdea['status']) => {
        onUpdateStatus(idea.id, status);
        onClose();
    }
    
    const handleConvert = () => {
        onConvertToProject(idea);
        onClose();
    };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="text-xl font-bold text-gray-800">Review Project Idea</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="p-2 bg-gray-50 rounded-md"><strong>Title:</strong> {idea.title}</div>
            <div className="p-2 bg-gray-50 rounded-md"><strong>Description:</strong> {idea.description}</div>
            <div className="p-2 bg-gray-50 rounded-md"><strong>Location:</strong> {idea.location} ({idea.ward}, {idea.subCounty})</div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-2 bg-gray-50 rounded-md"><strong>Category:</strong> {idea.category}</div>
                <div className="p-2 bg-gray-50 rounded-md"><strong>Votes:</strong> {idea.votes}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-2 bg-gray-50 rounded-md"><strong>Status:</strong> {idea.status}</div>
                <div className="p-2 bg-gray-50 rounded-md"><strong>Submitted via:</strong> {idea.submittedVia} {idea.isAnonymous && '(Anonymous)'}</div>
            </div>
            <div><strong>Comments ({idea.comments.length}):</strong> 
                {idea.comments.length > 0 ? (
                    <div className="text-sm bg-gray-100 p-2 rounded mt-1 space-y-1">
                        {idea.comments.map(c => <div key={c.id} className="bg-white p-1.5 rounded"><strong>{c.author}:</strong> {c.text}</div>)}
                    </div>
                ) : <span className="text-sm text-gray-500"> None</span>}
            </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t pt-4">
            <button onClick={() => handleAction('Approved')} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Approve</button>
            <button onClick={() => handleAction('Rejected')} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Reject</button>
            <button onClick={handleConvert} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Convert to Official Project</button>
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  );
};
