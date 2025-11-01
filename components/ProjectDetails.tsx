import React, { useState } from 'react';
import type { OfficialProject, ProgressReport, ProjectStatus, ForumPost, Comment } from '../types';
import { ReportCard } from './ReportCard';
import { CalendarIcon, CheckCircleIcon, ClockIcon, CurrencyDollarIcon, ExclamationIcon, FlagIcon, GavelIcon, MapPinIcon, PlusCircleIcon, StalledIcon, UploadIcon, UserCircleIcon, ChatBubbleIcon } from './icons';

interface ProjectDetailsProps {
  project: OfficialProject;
  onAddReport: (projectId: string, report: Omit<ProgressReport, 'id' | 'author' | 'date'>) => void;
  onAddForumPost: (projectId: string, post: Omit<ForumPost, 'id' | 'author' | 'date' | 'replies'>) => void;
  onAddForumReply: (projectId: string, postId: string, replyText: string) => void;
}

const statusInfo: Record<ProjectStatus, { icon: React.FC<React.SVGProps<SVGSVGElement>>; color: string }> = {
  'Completed': { icon: CheckCircleIcon, color: 'text-green-500' },
  'In Progress': { icon: ClockIcon, color: 'text-blue-500' },
  'Not Started': { icon: ExclamationIcon, color: 'text-gray-500' },
  'Stalled': { icon: StalledIcon, color: 'text-red-500' },
};

const ConflictOfInterestModal: React.FC<{onClose: () => void, companyName: string}> = ({onClose, companyName}) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <h3 className="text-lg font-bold text-gray-800">Report Conflict of Interest</h3>
        <p className="text-sm text-gray-600 mt-2">You are reporting a potential conflict of interest regarding the company: <strong>{companyName}</strong>. Please provide details below.</p>
        <textarea 
            rows={4} 
            className="mt-4 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., I believe one of the directors is related to a county official..."
        />
        <div className="mt-4 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button onClick={() => { alert('Thank you for your report. It has been submitted for review.'); onClose(); }} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700">Submit Report</button>
        </div>
      </div>
    </div>
)

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onAddReport, onAddForumPost, onAddForumReply }) => {
  const [observation, setObservation] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('In Progress');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (observation) {
      const mediaUrl = mediaFile ? 'https://picsum.photos/400/300' : undefined;
      onAddReport(project.id, { observation, status, mediaUrl });
      setObservation('');
      setStatus('In Progress');
      setMediaFile(null);
      setShowReportForm(false);
    }
  };

  const handleForumPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostTitle && newPostBody) {
        onAddForumPost(project.id, { title: newPostTitle, body: newPostBody });
        setNewPostTitle('');
        setNewPostBody('');
        setShowNewPostForm(false);
    }
  };

  const handleReplySubmit = (e: React.FormEvent, postId: string) => {
     e.preventDefault();
    if (replyText) {
        onAddForumReply(project.id, postId, replyText);
        setReplyText('');
        setReplyingTo(null);
    }
  }

  const StatusIcon = statusInfo[project.status].icon;
  const statusColor = statusInfo[project.status].color;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-8">
       {showConflictModal && project.implementer && <ConflictOfInterestModal onClose={() => setShowConflictModal(false)} companyName={project.implementer.companyName}/>}
      <div className="border-b pb-6">
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
      
      {project.implementer && (
         <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-bold text-gray-800 flex items-center mb-3">
                <GavelIcon className="h-6 w-6 mr-2 text-gray-600" />
                Contract & Tender Details
            </h3>
            <div className="space-y-2 text-sm">
                <p><strong>Implementing Company:</strong> <span className="font-medium text-gray-700">{project.implementer.companyName}</span></p>
                <p><strong>Tender Value:</strong> <span className="font-medium text-gray-700">{project.implementer.tenderValue.toLocaleString('en-US', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 })}</span></p>
                <p><strong>Company Directors:</strong> <span className="font-medium text-gray-700">{project.implementer.directors.join(', ')}</span></p>
            </div>
            <button onClick={() => setShowConflictModal(true)} className="mt-3 text-xs font-semibold text-red-600 hover:text-red-800 transition flex items-center">
                <FlagIcon className="h-4 w-4 mr-1"/>
                Report Conflict of Interest
            </button>
        </div>
      )}


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

       <div>
          <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <ChatBubbleIcon className="h-6 w-6 mr-2 text-gray-600"/>
                Community Accountability Forum
              </h3>
              <button 
                  onClick={() => setShowNewPostForm(!showNewPostForm)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Post an Issue
              </button>
          </div>
            {showNewPostForm && (
                 <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
                    <form onSubmit={handleForumPostSubmit} className="space-y-4">
                        <input type="text" placeholder="Title of your issue or question" value={newPostTitle} onChange={e => setNewPostTitle(e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
                        <textarea rows={3} placeholder="Describe the issue in detail..." value={newPostBody} onChange={e => setNewPostBody(e.target.value)} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" />
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowNewPostForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">Post</button>
                        </div>
                    </form>
                 </div>
            )}
            <div className="space-y-6">
                {(project.forum && project.forum.length > 0) ? project.forum.map(post => (
                    <div key={post.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                           <UserCircleIcon className="h-8 w-8 text-gray-400 flex-shrink-0"/>
                           <div>
                             <p className="text-sm font-semibold">{post.author} <span className="text-xs font-normal text-gray-500">&bull; {new Date(post.date).toLocaleDateString()}</span></p>
                             <h4 className="font-bold text-gray-800">{post.title}</h4>
                           </div>
                        </div>
                        <p className="mt-2 text-gray-700 text-sm ml-11">{post.body}</p>
                        
                        <div className="ml-11 mt-3 space-y-2">
                            {post.replies.map(reply => (
                                <div key={reply.id} className="flex items-start space-x-2 text-sm bg-white p-2 rounded-md border">
                                    <UserCircleIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-800">{reply.author}</p>
                                        <p className="text-gray-600">{reply.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="ml-11 mt-3">
                            {replyingTo === post.id ? (
                                <form onSubmit={(e) => handleReplySubmit(e, post.id)} className="flex items-center space-x-2">
                                    <input type="text" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write a reply..." className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg" autoFocus/>
                                    <button type="submit" className="px-3 py-1.5 text-sm font-semibold bg-green-600 text-white rounded-lg">Reply</button>
                                    <button type="button" onClick={() => setReplyingTo(null)} className="text-xs text-gray-500">Cancel</button>
                                </form>
                            ) : (
                                <button onClick={() => setReplyingTo(post.id)} className="text-xs font-semibold text-green-700 hover:underline">Reply to this post</button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No accountability issues have been posted for this project yet.</p>
                        <p className="text-sm text-gray-400 mt-1">Be the first to start a discussion!</p>
                    </div>
                )}
            </div>
       </div>
    </div>
  );
};