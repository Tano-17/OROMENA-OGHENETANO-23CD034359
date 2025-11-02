
import { GoogleGenAI, Type } from "@google/genai";
import type { EmotionAnalysis } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove 'data:image/jpeg;base64,' part
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeEmotionFromImage = async (imageFile: File): Promise<EmotionAnalysis> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Image = await fileToBase64(imageFile);

  const imagePart = {
    inlineData: {
      mimeType: imageFile.type,
      data: base64Image,
    },
  };

  const textPart = {
    text: "Analyze the primary facial expression in this image. Identify the dominant emotion, provide a brief one-sentence description, and suggest a single suitable emoji. Respond in a structured JSON format.",
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emotion: {
              type: Type.STRING,
              description: "The single, dominant emotion detected (e.g., Happy, Sad, Surprised)."
            },
            description: {
              type: Type.STRING,
              description: "A brief, one-sentence explanation of the facial cues leading to the emotion detection."
            },
            emoji: {
              type: Type.STRING,
              description: "A single emoji that best represents the detected emotion."
            }
          },
          required: ["emotion", "description", "emoji"]
        }
      }
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as EmotionAnalysis;
    
    if (!parsedResult.emotion || !parsedResult.description || !parsedResult.emoji) {
        throw new Error("Invalid response format from AI. Missing required fields.");
    }
      
    return parsedResult;
      
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Could not analyze the image. The AI model might be unable to process this request.");
  }
};
