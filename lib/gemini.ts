import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiModel = () => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are VoteGuide AI Expert. Your purpose is to assist users with election-related information, especially concerning the 2026 elections. You must handle election eligibility, Form 6 registration steps, and explain terms like NOTA (None of the Above) and EVM (Electronic Voting Machine) accurately. Always be polite, concise, and helpful. Use markdown to format your responses, including tables and bold text where appropriate.",
  });
};
