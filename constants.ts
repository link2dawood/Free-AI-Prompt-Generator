
import { PromptCategory, CategoryQuestions } from './types';

export const APP_TITLE = "AI Prompt Generator";

export const CATEGORIES: PromptCategory[] = [
  PromptCategory.WRITING,
  PromptCategory.PROGRAMMING,
  PromptCategory.BUSINESS,
  PromptCategory.SOCIAL_MEDIA,
  PromptCategory.LEARNING_EDUCATION,
  PromptCategory.CUSTOM,
];

export const QUESTIONS_PER_CATEGORY: CategoryQuestions = {
  [PromptCategory.WRITING]: [
    { id: 'writing_topic', type: 'text', label: 'Main topic or subject?', placeholder: 'e.g., a fantasy novel, a technical blog post' },
    { id: 'writing_style', type: 'text', label: 'Desired style or tone?', placeholder: 'e.g., formal, humorous, persuasive' },
    { id: 'writing_audience', type: 'text', label: 'Target audience?', placeholder: 'e.g., children, experts, general public' },
    { id: 'writing_details', label: 'Any specific details or keywords to include?', type: 'textarea', rows: 3, placeholder: 'e.g., mention a character named Alex, include the keyword "innovation"' },
  ],
  [PromptCategory.PROGRAMMING]: [
    { id: 'prog_task', type: 'text', label: 'Programming task?', placeholder: 'e.g., generate a Python function, explain a concept' },
    { id: 'prog_language', type: 'text', label: 'Programming language/technology?', placeholder: 'e.g., JavaScript, Python, React' },
    { id: 'prog_context', label: 'Relevant context or code snippet (optional)?', type: 'textarea', rows: 4, placeholder: 'Paste code here or describe the situation...' },
  ],
  [PromptCategory.BUSINESS]: [
    { id: 'biz_goal', type: 'text', label: 'Business objective?', placeholder: 'e.g., increase sales, draft a marketing email' },
    { id: 'biz_product', type: 'text', label: 'Product or service?', placeholder: 'e.g., a new mobile app, a consulting service' },
    { id: 'biz_audience', type: 'text', label: 'Target audience/stakeholder?', placeholder: 'e.g., potential investors, existing customers' },
    { id: 'biz_tone', type: 'text', label: 'Desired tone for communication?', placeholder: 'e.g., professional, friendly, urgent'},
  ],
  [PromptCategory.SOCIAL_MEDIA]: [
    { id: 'social_platform', type: 'text', label: 'Social media platform?', placeholder: 'e.g., Instagram, Twitter (X), LinkedIn' },
    { id: 'social_content_type', type: 'text', label: 'Type of content?', placeholder: 'e.g., caption for a photo, a tweet thread idea' },
    { id: 'social_goal', type: 'text', label: 'Goal of the post?', placeholder: 'e.g., engagement, brand awareness, drive traffic' },
    { id: 'social_vibe', type: 'text', label: 'Desired vibe or key message?', placeholder: 'e.g., fun and quirky, informative and helpful'},
  ],
  [PromptCategory.LEARNING_EDUCATION]: [
    { id: 'learn_subject', type: 'text', label: 'Subject or topic?', placeholder: 'e.g., World War II, calculus, learning Spanish' },
    { id: 'learn_objective', type: 'text', label: 'Learning objective?', placeholder: 'e.g., explain a concept simply, create study questions' },
    { id: 'learn_level', type: 'text', label: 'Learning level?', placeholder: 'e.g., beginner, intermediate, advanced' },
    { id: 'learn_format', type: 'text', label: 'Preferred format for the AI\'s help?', placeholder: 'e.g., a summary, a list of key points, an analogy'},
  ],
  [PromptCategory.CUSTOM]: [
    { id: 'custom_goal', label: 'Primary goal for your prompt?', type: 'textarea', rows: 3, placeholder: 'Describe what you want the AI to help you with...' },
    { id: 'custom_context', label: 'Key details, context, or constraints?', type: 'textarea', rows: 4, placeholder: 'e.g., specific keywords, desired output format, AI persona' },
  ],
};

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
export const LOCAL_STORAGE_THEME_KEY = 'appTheme';
export const LOCAL_STORAGE_HISTORY_KEY = 'promptHistory';