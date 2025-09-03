import React from 'react';
import type { HistoryEntry } from '../types';

interface HistoryProps {
  entries: HistoryEntry[];
  onSelect: (imageUrl: string) => void;
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ entries, onSelect, onClear }) => {
  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
       <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-300">History</h3>
        <button
          onClick={onClear}
          className="text-sm text-gray-400 hover:text-red-500 transition-colors duration-200 flex items-center gap-1 font-medium"
          aria-label="Clear history"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
          Clear
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-48 overflow-y-auto pr-2 rounded-lg">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="aspect-square rounded-lg overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-purple-400 focus:ring-purple-400 transition-all duration-200"
            tabIndex={0}
            onClick={() => onSelect(entry.imageUrl)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(entry.imageUrl)}
            role="button"
            aria-label="Select image from history"
          >
            <img
              src={entry.imageUrl}
              alt="Previously generated"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;