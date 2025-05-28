
import React, { useState, useEffect, useCallback } from 'react';
import { AppTheme, PromptCategory, UserAnswers, GeneratedPrompt, AppScreen } from './types';
import { LOCAL_STORAGE_THEME_KEY, LOCAL_STORAGE_HISTORY_KEY, QUESTIONS_PER_CATEGORY } from './constants';
import { generatePromptWithGemini } from './services/geminiService';
import Header from './components/Header';
import CategorySelector from './components/CategorySelector';
import QuestionForm from './components/QuestionForm';
import PromptDisplay from './components/PromptDisplay';
import HistoryPanel from './components/HistoryPanel';
import Button from './components/ui/Button';
import Card from './components/ui/Card';

const App: React.FC = () => {
  const [theme, setTheme] = useState<AppTheme>(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    return (storedTheme as AppTheme) || AppTheme.LIGHT;
  });
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('category_selection');
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptHistory, setPromptHistory] = useState<GeneratedPrompt[]>(() => {
    const storedHistory = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === AppTheme.DARK);
    localStorage.setItem(LOCAL_STORAGE_THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(promptHistory));
  }, [promptHistory]);

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === AppTheme.LIGHT ? AppTheme.DARK : AppTheme.LIGHT));
  };

  const handleCategorySelect = (category: PromptCategory) => {
    setSelectedCategory(category);
    const categoryQuestions = QUESTIONS_PER_CATEGORY[category] || [];
    const initialAnswers = categoryQuestions.reduce((acc, q) => {
      acc[q.id] = '';
      return acc;
    }, {} as UserAnswers);
    setUserAnswers(initialAnswers);
    setCurrentScreen('question_form');
    setError(null); // Clear error when selecting a new category
  };
  
  const processPromptGeneration = useCallback(async (category: PromptCategory, answers: UserAnswers, existingPromptText?: string) => {
    setIsLoading(true);
    setError(null); // Clear previous errors before new attempt
    try {
      const promptText = await generatePromptWithGemini(category, answers, existingPromptText);
      
      // DEBUGGING: Log the received prompt text
      console.log("Received promptText from generatePromptWithGemini:", promptText);

      setGeneratedPrompt({
        id: Date.now().toString(),
        text: promptText,
        category: category,
        timestamp: Date.now(),
        rating: 0,
        userInputs: { ...answers }
      });
      setCurrentScreen('prompt_display');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("Error in processPromptGeneration:", err); // Log the original error object
      setError(`Failed to generate prompt: ${errorMessage}`);
      
      // Check error message for API key issues specifically
      const lowerErrorMessage = errorMessage.toLowerCase();
      if (lowerErrorMessage.includes("api key") || lowerErrorMessage.includes("api_key") || lowerErrorMessage.includes("client is not initialized")) {
        setCurrentScreen('category_selection'); // Force back if API key is fundamentally wrong or client not init
      }
      // Error will be displayed based on currentScreen by renderScreen logic
    } finally {
      setIsLoading(false);
    }
  }, []);


  const handleAnswersSubmit = async (answers: UserAnswers) => {
    setUserAnswers(answers);
    if (selectedCategory) {
      processPromptGeneration(selectedCategory, answers);
    }
  };

  const handleRegenerate = () => {
    if (selectedCategory && generatedPrompt) {
      processPromptGeneration(selectedCategory, generatedPrompt.userInputs, generatedPrompt.text);
    } else if (selectedCategory) {
      // Fallback if generatedPrompt is somehow null but we have a category and answers
      processPromptGeneration(selectedCategory, userAnswers);
    }
  };
  
  const handleGoBackToQuestions = () => {
    if(generatedPrompt) {
        setUserAnswers(generatedPrompt.userInputs);
    }
    setCurrentScreen('question_form');
    setError(null);
  };

  const handleSaveToHistory = (promptToSave: GeneratedPrompt) => {
    setPromptHistory((prevHistory) => {
      const existingIndex = prevHistory.findIndex(p => p.id === promptToSave.id);
      if (existingIndex > -1) {
        const updatedHistory = [...prevHistory];
        updatedHistory[existingIndex] = promptToSave;
        return updatedHistory;
      }
      // Add new prompt, ensuring it's unique by ID if somehow re-saving a modified old one not caught above
      const filteredHistory = prevHistory.filter(p => p.id !== promptToSave.id);
      return [promptToSave, ...filteredHistory].slice(0, 50); // Limit history size
    });
  };
  
  const handleUpdatePromptRating = (promptId: string, rating: number) => {
    if (generatedPrompt && generatedPrompt.id === promptId) {
      setGeneratedPrompt(prev => prev ? { ...prev, rating } : null);
    }
    setPromptHistory(prevHistory => 
      prevHistory.map(p => p.id === promptId ? { ...p, rating } : p)
    );
  };

  const handleStartOver = () => {
    setSelectedCategory(null);
    setUserAnswers({});
    setGeneratedPrompt(null);
    setCurrentScreen('category_selection');
    setError(null);
  };

  const handleDeleteFromHistory = (promptId: string) => {
    setPromptHistory((prev) => prev.filter((p) => p.id !== promptId));
  };

  const handleClearHistory = () => {
    setPromptHistory([]);
  };

  const handleUsePromptFromHistory = (prompt: GeneratedPrompt) => {
    setSelectedCategory(prompt.category);
    setUserAnswers(prompt.userInputs);
    // Set generatedPrompt to the one from history, effectively "loading" it.
    // This also ensures its existing rating is preserved if displayed immediately.
    setGeneratedPrompt(prompt); 
    setCurrentScreen('prompt_display'); // Go to display screen
    setShowHistoryPanel(false);
    setError(null);
  };


  const renderScreen = () => {
    if (isLoading) {
      return (
        <Card className="text-center">
          <div className="flex flex-col items-center justify-center h-64">
            <i className="fas fa-spinner fa-spin text-4xl text-sky-500 mb-4" aria-hidden="true"></i>
            <p className="text-xl" role="status">Generating your prompt...</p>
          </div>
        </Card>
      );
    }

    // Centralized error display for critical API key / config issues before category selection
    if (currentScreen === 'category_selection' && error && (error.toLowerCase().includes("api key") || error.toLowerCase().includes("client is not initialized"))) {
      return (
        <>
          <Card title="Configuration Error" className="mb-6 border-l-4 border-red-500">
              <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">Please ensure your API key is correctly configured. Once resolved, select a category to proceed.</p>
          </Card>
          <CategorySelector onSelectCategory={handleCategorySelect} />
        </>
      );
    }

    switch (currentScreen) {
      case 'category_selection':
        return <CategorySelector onSelectCategory={handleCategorySelect} />;
      case 'question_form':
        if (!selectedCategory) {
            handleStartOver(); 
            return null;
        }
        // Pass error that might have occurred during the last generation attempt for this form
        return (
          <QuestionForm
            category={selectedCategory}
            initialAnswers={userAnswers}
            onSubmit={handleAnswersSubmit}
            onBack={handleStartOver}
            error={error && !error.toLowerCase().includes("api key") ? error : null} 
          />
        );
      case 'prompt_display':
        if (!generatedPrompt || !selectedCategory) {
            handleStartOver(); 
            return null;
        }
        // Pass error that might have occurred during regeneration
        return (
          <>
            {error && !error.toLowerCase().includes("api key") && (
                 <Card className="mb-4 border-l-4 border-red-500">
                    <p className="text-red-700 dark:text-red-300">{error}</p>
                 </Card>
            )}
            <PromptDisplay
              prompt={generatedPrompt}
              onRegenerate={handleRegenerate}
              onSaveToHistory={handleSaveToHistory}
              onUpdateRating={handleUpdatePromptRating}
              onGoBackToQuestions={handleGoBackToQuestions}
              onStartOver={handleStartOver}
              isSaved={promptHistory.some(p => p.id === generatedPrompt.id)}
            />
          </>
        );
      default:
        return <CategorySelector onSelectCategory={handleCategorySelect} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      <Header
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onShowHistoryToggle={() => setShowHistoryPanel(!showHistoryPanel)}
        historyItemCount={promptHistory.length}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {renderScreen()}
        </div>
      </main>
      <HistoryPanel
        history={promptHistory}
        onUsePrompt={handleUsePromptFromHistory}
        onDeletePrompt={handleDeleteFromHistory}
        onClearHistory={handleClearHistory}
        onClose={() => setShowHistoryPanel(false)}
        isVisible={showHistoryPanel}
      />
      <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
        Powered by AI. Your creativity, amplified.
      </footer>
    </div>
  );
};

export default App;
