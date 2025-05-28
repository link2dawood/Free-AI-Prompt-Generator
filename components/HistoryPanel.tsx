
import React from 'react';
import { GeneratedPrompt } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import StarRating from './StarRating';

interface HistoryPanelProps {
  history: GeneratedPrompt[];
  onUsePrompt: (prompt: GeneratedPrompt) => void;
  onDeletePrompt: (promptId: string) => void;
  onClearHistory: () => void;
  onClose: () => void;
  isVisible: boolean;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onUsePrompt,
  onDeletePrompt,
  onClearHistory,
  onClose,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 flex justify-end" onClick={onClose}>
      <div 
        className="w-full max-w-md h-full bg-white dark:bg-slate-800 shadow-xl flex flex-col p-0 transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-xl font-semibold">Prompt History</h2>
          <div className="flex items-center space-x-2">
            {history.length > 0 && (
               <Button onClick={onClearHistory} variant="danger" size="sm" leftIcon={<i className="fas fa-trash-alt"></i>}>
                 Clear All
               </Button>
            )}
            <Button onClick={onClose} variant="ghost" size="sm" aria-label="Close history panel">
              <i className="fas fa-times text-xl"></i>
            </Button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="flex-grow flex items-center justify-center p-6">
            <p className="text-slate-500 dark:text-slate-400">No prompts saved yet.</p>
          </div>
        ) : (
          <div className="overflow-y-auto flex-grow p-4 space-y-3">
            {history.slice().reverse().map((item) => ( // Show newest first
              <Card key={item.id} className="p-4 bg-slate-50 dark:bg-slate-700/50">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                  {item.category} - {new Date(item.timestamp).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-800 dark:text-slate-200 mb-2 truncate hover:whitespace-normal transition-all">
                  {item.text}
                </p>
                <div className="flex justify-between items-center">
                  <StarRating rating={item.rating} onRate={() => {}} size="sm" disabled={true} />
                  <div className="space-x-2">
                    <Button onClick={() => onUsePrompt(item)} variant="secondary" size="sm" title="Use this prompt's inputs">
                      <i className="fas fa-redo-alt"></i>
                    </Button>
                    <Button onClick={() => onDeletePrompt(item.id)} variant="ghost" size="sm" className="text-red-500 hover:bg-red-100 dark:hover:bg-red-700/50" title="Delete this prompt">
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
