import React, { useState } from 'react';
import type { ProjectIdea, Comment } from '../types';
import { MapPinIcon, ThumbUpIcon, ThumbUpOutlineIcon, CommentIcon, UserCircleIcon } from './icons';

interface ProjectIdeaCardProps {
  idea: ProjectIdea;
  onVote: (id: string) => void;
  hasVoted: boolean;
  onAddComment: (ideaId: string, commentText: string) => void;
}

export const ProjectIdeaCard: React.FC<ProjectIdeaCardProps> = ({ idea, onVote, hasVoted, onAddComment }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(idea.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      <div>
        <h4 className="font-bold text-gray-800">{idea.title}</h4>
        <p className="text-sm text-gray-600 mt-2 line-clamp-3">{idea.description}</p>
        <div className="flex items-center mt-3 text-xs text-gray-500">
          <MapPinIcon className="h-4 w-4 mr-1.5" />
          <span>{idea.location}</span>
          {idea.ward && <span className="mx-1">&bull;</span>}
          {idea.ward && <span>{idea.ward} Ward</span>}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-700">
                    <ThumbUpIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="font-bold text-lg">{idea.votes}</span>
                </div>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center text-gray-700">
                    <CommentIcon className="h-5 w-5 mr-2 text-gray-400" />
                    <span className="font-bold text-lg">{idea.comments.length}</span>
                </button>
            </div>
            <button
            onClick={() => onVote(idea.id)}
            disabled={hasVoted}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center
                ${hasVoted 
                ? 'bg-green-100 text-green-800 cursor-not-allowed' 
                : 'bg-white text-green-700 border border-green-700 hover:bg-green-50'
                }`}
            aria-label={hasVoted ? 'You have already voted for this idea' : `Vote for ${idea.title}`}
            >
            {hasVoted ? (
                <>
                <ThumbUpIcon className="h-5 w-5 mr-2" />
                Voted
                </>
            ) : (
                <>
                <ThumbUpOutlineIcon className="h-5 w-5 mr-2" />
                Vote
                </>
            )}
            </button>
        </div>
        {showComments && (
          <div className="mt-4 space-y-3">
            <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
                {idea.comments.length > 0 ? (
                    idea.comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-2 text-sm bg-gray-50 p-2 rounded-md">
                            <UserCircleIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-gray-800">{comment.author}</p>
                                <p className="text-gray-600">{comment.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-xs text-center text-gray-500 py-4">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
            <form onSubmit={handleCommentSubmit} className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
              />
              <button type="submit" className="px-3 py-1.5 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};