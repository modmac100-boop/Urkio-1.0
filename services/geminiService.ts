
import { GoogleGenAI, Type } from "@google/genai";

// Initialize AI instance lazily to ensure it uses the latest environment variables
const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAiResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const ai = getAi();
    
    // We use gemini-3-flash-preview for fast, interactive chat
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.length > 0 ? [...history, { role: 'user', parts: [{ text: message }] }] : message,
      config: {
        systemInstruction: "You are the Urkio Guide, an empathetic AI assistant for a holistic wellness community. Help users navigate the app, find health tips, or provide gentle mental support. You are not a doctor; always include a brief medical disclaimer when giving health-related advice. Keep responses concise and encouraging.",
      }
    });

    return response.text || "I'm having trouble thinking right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I encountered an error connecting to my neural core. Please try again later.";
  }
}

/**
 * Analyzes user data to provide a wellness readiness score and summary.
 * Uses Pro model for better clinical-style reasoning.
 */
export async function analyzeUserSituation(userData: any) {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Analyze this user wellness data and provide a triage report: ${JSON.stringify(userData)}`,
      config: {
        systemInstruction: "You are a clinical triage AI. Analyze the provided user data (reflections, activity, mood) and return a JSON object with: readinessScore (0-100), summary (concise clinical narrative), and sentimentMetrics (array of {label, value} for Anxiety, Stability, Engagement, Urgency).",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            readinessScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            sentimentMetrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Analysis Error:", error);
    return null;
  }
}

/**
 * Generates a suggested action plan for an expert to review.
 */
export async function suggestActionPlan(userSummary: string) {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: `Based on this summary, suggest 3-5 specific wellness tasks: ${userSummary}`,
      config: {
        systemInstruction: "You are a wellness protocol assistant. Suggest specific, actionable tasks for a user. Return a JSON array of objects with: title, category (Nutrition, Mindset, or Physical), description, and frequency.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              frequency: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Action Plan Suggestion Error:", error);
    return [];
  }
}

/**
 * Summarizes expert session notes for management or patient review.
 */
export async function summarizeExpertNotes(notes: string) {
  try {
    const ai = getAi();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize these clinical notes for a non-expert reader: ${notes}`,
      config: {
        systemInstruction: "Summarize clinical notes into a clear, supportive paragraph that highlights progress and next steps. Avoid overly technical jargon.",
      }
    });

    return response.text || notes;
  } catch (error) {
    console.error("Summarization Error:", error);
    return notes;
  }
}
