import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client
// Note: In a real app, you might want to handle missing keys more gracefully in the UI
const ai = new GoogleGenAI({ apiKey });

export const translateDocument = async (
  base64Data: string,
  mimeType: string,
  targetLanguage: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const modelId = "gemini-2.5-flash"; // Excellent balance of speed and multimodal capability

  const prompt = `
    You are an expert polyglot translator and document analyzer. 
    
    Task:
    1. Analyze the provided document.
    2. Translate all textual content found within the document into ${targetLanguage}.
    3. Formatting: Return the translation in clean Markdown format. 
       - Use headers (#, ##) to represent document structure.
       - Use tables if you detect tabular data.
       - Use bullet points for lists.
       - If the document is an image, describe the visual elements briefly in *italics* before providing the text translation.
    
    Constraints:
    - Do not output the original text unless it's for context (e.g. specialized terms).
    - Provide ONLY the translation and formatting. Do not add conversational filler like "Here is the translation".
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ]
      }
    });

    if (!response.text) {
      throw new Error("No translation generated.");
    }

    return response.text;

  } catch (error: any) {
    console.error("Gemini Translation Error:", error);
    throw new Error(error.message || "Failed to translate document.");
  }
};
