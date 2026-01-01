import { GoogleGenAI, Type } from "@google/genai";
import { MoodResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMoodAndGetSongs = async (base64Image: string): Promise<MoodResult> => {
  // Remove header if present (data:image/jpeg;base64,)
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

  const prompt = `
    Analyze the facial expression and emotional vibe of the person in this image. 
    Identify their specific mood (e.g., Happy, Melancholic, Romantic, Energetic, Peaceful, Stressed, Party).
    
    Based on this detected mood, recommend a curated playlist of 6 songs.
    IMPORTANT: strictly recommend ONLY Bollywood or Hindi songs. Do not include English or other regional songs.
    Ensure the songs are popular and perfectly match the detected vibe.
    
    Also provide a list of 3-5 single-word associated mood keywords.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING, description: "The primary detected mood, capitalized (e.g. 'Pleasant')" },
            associatedMoods: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3-5 related mood adjectives"
            },
            playlist: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Song title" },
                  artist: { type: Type.STRING, description: "Singer or Composer" },
                  album: { type: Type.STRING, description: "Movie or Album name" }
                }
              },
              description: "A list of 6 Hindi/Bollywood songs matching the mood"
            }
          },
          required: ["mood", "associatedMoods", "playlist"]
        }
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini");
    }

    return JSON.parse(text) as MoodResult;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw new Error("Failed to analyze mood. Please try again.");
  }
};