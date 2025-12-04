import { GoogleGenAI } from "@google/genai";
import { Message, Platform } from '../types';

// Do not initialize "ai" here at the top level. 
// It causes the app to crash on Vercel if process.env is undefined during the initial JS load.

export const generateSmartReply = async (
  history: Message[],
  contactName: string,
  platform: Platform,
  role?: string
): Promise<string> => {
  try {
    // Initialize inside the function call
    // This ensures we only access process.env.API_KEY when the function is actually called,
    // and after the app has fully mounted.
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.warn("Gemini API Key is missing");
      return "Thinking... (API Key Missing)";
    }

    const ai = new GoogleGenAI({ apiKey });

    const context = history.map(m => `${m.sender === 'me' ? 'Me' : contactName}: ${m.text}`).join('\n');
    
    let personaInstruction = '';
    switch (platform) {
      case 'linkedin':
        personaInstruction = `You are ${contactName}, a professional ${role || 'connection'} on LinkedIn. Keep the tone professional, polite, and business-oriented.`;
        break;
      case 'instagram':
        personaInstruction = `You are ${contactName}, a friend on Instagram. Keep the tone casual, use emojis, maybe slang if appropriate. Short messages.`;
        break;
      case 'whatsapp':
        personaInstruction = `You are ${contactName}, a close contact on WhatsApp. Tone is personal, direct, and friendly.`;
        break;
      case 'messenger':
        personaInstruction = `You are ${contactName}, a Facebook friend. Casual and conversational tone.`;
        break;
    }

    const prompt = `
      ${personaInstruction}
      
      Here is our chat history:
      ${context}
      
      Me: [User just sent a message, reply to it]
      ${contactName}: 
      
      Generate a realistic reply strictly from the perspective of ${contactName}. Do not include "Me:" or "${contactName}:" in the output. Just the message content.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Thinking..."; // Fallback if API fails or key is missing
  }
};