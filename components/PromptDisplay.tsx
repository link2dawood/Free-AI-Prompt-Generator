
import React, { useState, useEffect } from 'react';
import { GeneratedPrompt } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import StarRating from './StarRating';

interface PromptDisplayProps {
  prompt: GeneratedPrompt;
  onRegenerate: () => void;
  onSaveToHistory: (promptToSave: GeneratedPrompt) => void;
  onUpdateRating: (promptId: string, rating: number) => void;
  onGoBackToQuestions: () => void;
  onStartOver: () => void;
  isSaved: boolean;
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({
  prompt,
  onRegenerate,
  onSaveToHistory,
  onUpdateRating,
  onGoBackToQuestions,
  onStartOver,
  isSaved
}) => {
  const [copied, setCopied] = useState(false);
  const [currentRating, setCurrentRating] = useState(prompt.rating);

  useEffect(() => {
    setCurrentRating(prompt.rating);
  }, [prompt.rating]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(prompt.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRatingChange = (newRating: number) => {
    setCurrentRating(newRating);
    onUpdateRating(prompt.id, newRating);
  };
  
  const handleSave = () => {
    onSaveToHistory({...prompt, rating: currentRating});
  }

  return (
    <Card title="Your Generated Prompt" className="animate-fadeIn">
      <div className="mb-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg min-h-[150px] whitespace-pre-wrap font-mono text-sm leading-relaxed">
        {prompt.text}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">Rate this prompt:</p>
          <StarRating rating={currentRating} onRate={handleRatingChange} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleCopyToClipboard} variant="secondary" leftIcon={copied ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}>
            {copied ? 'Copied!' : 'Copy Prompt'}
          </Button>
          <Button onClick={onRegenerate} variant="secondary" leftIcon={<i className="fas fa-sync-alt"></i>}>
            Regenerate
          </Button>
          <Button onClick={handleSave} variant="primary" disabled={isSaved} leftIcon={isSaved ? <i className="fas fa-check-circle"></i> : <i className="fas fa-save"></i>}>
            {isSaved ? 'Saved' : 'Save to History'}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-start space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button onClick={onGoBackToQuestions} variant="ghost" leftIcon={<i className="fas fa-pencil-alt"></i>}>
            Edit Inputs
        </Button>
        <Button onClick={onStartOver} variant="ghost" leftIcon={<i className="fas fa-home"></i>}>
            Start Over
        </Button>
      </div>
    </Card>
  );
};

export default PromptDisplay;
