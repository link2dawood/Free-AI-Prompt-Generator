
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { PromptCategory, UserAnswers } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

// API_KEY is expected to be set in the environment.
// The build system (e.g., Vite, Webpack) should replace process.env.API_KEY
// with the actual key or a mechanism to load it.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.error("Gemini API Key (process.env.API_KEY) is not configured. Prompt generation will fail.");
}

export const generatePromptWithGemini = async (
  category: PromptCategory,
  answers: UserAnswers,
  existingPrompt?: string // Optional: for regeneration, to try to get a different variation
): Promise<string> => {
  if (!ai) {
    return Promise.reject("Gemini API client is not initialized. Check API Key configuration.");
  }

  let metaPrompt = `You are an expert AI Prompt Engineer. Your task is to generate a concise, effective, and context-aware prompt that a user can provide to a large language model (like ChatGPT, Claude, or Gemini itself) to get a high-quality response.

The user requires a prompt for the category: "${category}".

Here are the user's specific requirements and context, derived from their answers to guiding questions:
`;

  const answerEntries = Object.entries(answers);
  if (answerEntries.length === 0) {
    metaPrompt += "- The user did not provide specific details. Generate a general prompt for the category.\n";
  } else {
    for (const [key, value] of answerEntries) {
      if (value && String(value).trim() !== '') {
        // Attempt to make the question key more readable
        const readableKey = key.replace(/^(writing_|prog_|biz_|social_|learn_|custom_)/, '').replace(/_/g, ' ');
        metaPrompt += `- ${readableKey.charAt(0).toUpperCase() + readableKey.slice(1)}: ${value}\n`;
      }
    }
  }
  
  if (existingPrompt) {
    metaPrompt += `\nThe user wants a variation of a previous prompt. The previous prompt was: "${existingPrompt}". Please generate a significantly different but related prompt based on the same inputs.\n`;
  }

  metaPrompt += `
Instructions for you, the Prompt Engineer:
- Generate ONLY the AI prompt itself.
- The prompt should be a direct command or question to an AI model.
- Do NOT include any surrounding text, conversational filler, or your own analysis (e.g., "Here's a prompt for you:", "This prompt should help...", or "'''prompt\\n...\\n'''").
- Ensure the prompt is actionable and clear.
- Tailor the prompt complexity and vocabulary to the implied expertise level from the user's answers.

Generate the AI prompt now:`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: metaPrompt,
      config: {
        temperature: existingPrompt ? 0.85 : 0.75, // Higher temp for regeneration
        topP: 0.95,
        topK: 50,
      }
    });
    // Corrected: Ensure .text is accessed as a property, not response.text()
    // This addresses the "This expression is not callable" error if it was response.text()
    const text = response.text; 
    
    // Clean potential markdown fences if Gemini adds them despite instructions
    let cleanedText = text.trim();
    // Corrected: Ensured \n is used for newline in regex, not a variable 'n'.
    // This addresses the "Cannot find name 'n'" error if 'n' was mistakenly used instead of '\n'.
    const fenceRegex = /^```(?:\w+\s*\n)?([\s\S]*?)\n?```$/;
    const match = cleanedText.match(fenceRegex);
    if (match && match[1]) {
      cleanedText = match[1].trim();
    }

    return cleanedText;
  } catch (error) {
    console.error("Error generating prompt with Gemini:", error);
    let errorMessage = "Error: Could not generate prompt. Please try again.";
    if (error instanceof Error) {
        if (error.message.includes("API_KEY_INVALID") || error.message.includes("API key not valid")) {
            errorMessage = "Error: The API key is invalid or missing. Please check your application configuration.";
        } else if (error.message.toLowerCase().includes("quota") || error.message.toLowerCase().includes("rate limit")) {
            errorMessage = "Error: API quota exceeded or rate limit reached. Please try again later.";
        }
    }
    // Fallback for non-Error objects or unknown errors
    return Promise.reject(errorMessage);
  }
};
