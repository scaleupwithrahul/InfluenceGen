import React, { useState, useEffect, useCallback } from 'react';
import Spinner from './Spinner';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => Promise<void>;
  imageUrl: string;
  isEditing: boolean;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSubmit, imageUrl, isEditing }) => {
  const [prompt, setPrompt] = useState('');

  const handleEscKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, handleEscKey]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div
        className="bg-gray-900/70 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl w-full max-w-2xl flex flex-col md:flex-row gap-6 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2">
            <img src={imageUrl} alt="Image to edit" className="rounded-lg object-contain w-full h-full" />
        </div>
        <form onSubmit={handleSubmit} className="w-full md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 id="edit-modal-title" className="text-2xl font-bold text-white mb-4">Edit Image</h2>
            <p className="text-gray-400 mb-4">Describe the changes you want to make.</p>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              className="w-full bg-black/20 border border-white/20 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
              placeholder="e.g., Change the background to a sunny beach..."
              autoFocus
            />
          </div>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isEditing}
              className="w-full bg-white/10 border border-white/20 text-white font-bold py-3 px-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEditing || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isEditing ? <><Spinner /><span className="ml-2">Applying...</span></> : 'Generate Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;