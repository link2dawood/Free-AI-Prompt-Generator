import React, { useState, useEffect } from 'react';
import { PromptCategory, Question as QuestionType, UserAnswers } from '../types';
import { QUESTIONS_PER_CATEGORY } from '../constants';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Card from './ui/Card';

interface QuestionFormProps {
  category: PromptCategory;
  initialAnswers?: UserAnswers;
  onSubmit: (answers: UserAnswers) => void;
  onBack: () => void;
  error?: string | null; // Added error prop
}

const QuestionForm: React.FC<QuestionFormProps> = ({ category, initialAnswers = {}, onSubmit, onBack, error }) => {
  const questions = QUESTIONS_PER_CATEGORY[category] || [];
  const [answers, setAnswers] = useState<UserAnswers>(initialAnswers);

  useEffect(() => {
    // Reset answers if category changes or initialAnswers are provided
    const defaultAnswers = questions.reduce((acc, q) => {
      acc[q.id] = initialAnswers[q.id] || '';
      return acc;
    }, {} as UserAnswers);
    setAnswers(defaultAnswers);
  }, [category, questions, initialAnswers]);


  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answers);
  };

  if (!questions.length) {
    // This case might occur if a category has no defined questions.
    // Consider if this is a valid state or if all categories should have questions.
    // For now, providing a way to generate a generic prompt or go back.
    return (
      <Card title={`Refine: ${category}`}>
         {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md text-red-700 dark:text-red-300" role="alert">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        <p className="text-slate-600 dark:text-slate-300 mb-4">No specific questions for this category. You can describe your needs if a custom field were available or generate a generic prompt.</p>
        <Button onClick={() => onSubmit({})} variant="primary" className="mr-2">
          Generate Generic Prompt
        </Button>
        <Button onClick={onBack} variant="secondary">
          Back to Categories
        </Button>
      </Card>
    );
  }

  return (
    <Card title={`Refine: ${category}`} actions={
      <Button onClick={onBack} variant="ghost" size="sm" leftIcon={<i className="fas fa-arrow-left"></i>}>
        Change Category
      </Button>
    }>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md text-red-700 dark:text-red-300" role="alert">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        {questions.map((q: QuestionType) => (
          <div key={q.id}>
            {q.type === 'textarea' ? (
              <Textarea
                id={q.id}
                label={q.label}
                placeholder={q.placeholder}
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
                rows={q.rows || 3}
              />
            ) : (
              <Input
                id={q.id}
                label={q.label}
                placeholder={q.placeholder}
                type="text" // Simplified, could be q.type if supporting more input types
                value={answers[q.id] || ''}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />
            )}
          </div>
        ))}
        <div className="flex justify-end pt-4">
          <Button type="submit" variant="primary" leftIcon={<i className="fas fa-cogs"></i>}>
            Generate Prompt
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default QuestionForm;