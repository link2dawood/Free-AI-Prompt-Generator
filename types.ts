export enum AppTheme {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum PromptCategory {
  WRITING = 'Writing',
  PROGRAMMING = 'Programming',
  BUSINESS = 'Business',
  SOCIAL_MEDIA = 'Social Media',
  LEARNING_EDUCATION = 'Learning & Education',
  CUSTOM = 'Custom / Other',
}

export interface Question {
  id: string;
  label: string; // Changed from text to label for clarity with form inputs
  placeholder?: string;
  type: 'text' | 'textarea'; // Simplified for this example, select can be added if needed
  rows?: number; // For textarea
}

export type CategoryQuestions = Record<PromptCategory, Question[]>;


export interface UserAnswers {
  [questionId: string]: string;
}

export interface GeneratedPrompt {
  id: string;
  text: string;
  category: PromptCategory;
  timestamp: number;
  rating: number; // 0-5 stars, 0 means unrated
  userInputs: UserAnswers; // Store user inputs for regeneration context
}

export type AppScreen = 'category_selection' | 'question_form' | 'prompt_display';