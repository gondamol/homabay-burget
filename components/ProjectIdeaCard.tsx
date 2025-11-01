
import React, { useState } from 'react';
import type { ProjectIdea } from '../types';
import { ThumbsUpIcon, ChatBubbleOvalLeftEllipsisIcon } from './icons';

interface ProjectIdeaCardProps {
  idea: ProjectIdea;
  onVote: (ideaId: string) => void;
  hasVoted: boolean;
  onAddComment: (ideaId: string, commentText: string) => void;
}

export const ProjectIdeaCard: React.FC<ProjectIdeaCardProps> = ({ idea, onVote, hasVoted, onAddComment }) => {
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(idea.id, newComment);
            setNewComment('');
        }
    };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-gray-800">{idea.title}</h3>
        <p className="text-xs text-gray-500 mt-1">{idea.ward}, {idea.subCounty}</p>
        <p className="text-sm text-gray-600 my-3">{idea.description}</p>
      </div>
      <div className="mt-4 border-t pt-4">
        <div className="flex justify-between items-center">
            <button
                onClick={() => onVote(idea.id)}
                disabled={hasVoted}
                className={`flex items-center space-x-2 text-sm font-semibold rounded-full px-3 py-1 transition ${
                    hasVoted
                    ? 'bg-green-100 text-green-800 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
                <ThumbsUpIcon className="h-5 w-5" />
                <span>{idea.votes} Votes</span>
            </button>
            <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
            >
                <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
                <span>{idea.comments.length} Comments</span>
            </button>
        </div>
        {showComments && (
            <div className="mt-4 space-y-3">
                {idea.comments.length > 0 ? idea.comments.map(comment => (
                     <div key={comment.id} className="text-xs bg-gray-50 p-2 rounded">
                        <p className="font-semibold">{comment.author}</p>
                        <p>{comment.text}</p>
                    </div>
                )) : <p className="text-xs text-gray-500 text-center">No comments yet.</p>}
                 <form onSubmit={handleCommentSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full text-xs px-2 py-1 border rounded"
                    />
                    <button type="submit" className="text-xs font-semibold bg-green-600 text-white px-3 rounded">Post</button>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};
