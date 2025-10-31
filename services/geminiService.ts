import { GoogleGenAI, Type } from "@google/genai";
import type { ProjectIdea, AIAnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key should be set.
  console.warn("Gemini API key not found. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    topPriorities: {
      type: Type.ARRAY,
      description: "List of the top 5 most common project themes or clusters.",
      items: {
        type: Type.OBJECT,
        properties: {
          topic: {
            type: Type.STRING,
            description: "A short, descriptive name for the topic cluster (e.g., 'Water Access', 'Road Repair')."
          },
          count: {
            type: Type.INTEGER,
            description: "The number of submissions that fall into this topic."
          },
          description: {
              type: Type.STRING,
              description: "A brief one-sentence summary of what this topic entails based on the submissions."
          }
        },
         required: ["topic", "count", "description"]
      }
    },
    sentiment: {
      type: Type.OBJECT,
      description: "Analysis of the overall sentiment of the submissions.",
      properties: {
        positive: {
          type: Type.INTEGER,
          description: "Count of submissions with a positive or hopeful tone."
        },
        neutral: {
          type: Type.INTEGER,
          description: "Count of submissions with a neutral or factual tone."
        },
        negative: {
          type: Type.INTEGER,
          description: "Count of submissions with a negative, urgent, or complaining tone."
        }
      },
      required: ["positive", "neutral", "negative"]
    }
  },
  required: ["topPriorities", "sentiment"]
};


export const analyzeSubmissions = async (submissions: ProjectIdea[]): Promise<AIAnalysisResult> => {
  if (!API_KEY) {
    // Return mock data if API key is not available
    return {
      topPriorities: [
        { topic: 'Water Access', count: 3, description: 'Citizens are requesting new boreholes and wells for clean water.' },
        { topic: 'Roads & Infrastructure', count: 2, description: 'Requests focus on repairing roads and bridges for better transport.' },
        { topic: 'Healthcare', count: 2, description: 'Submissions highlight the need for better hospital facilities and equipment.' },
        { topic: 'Economic Empowerment', count: 2, description: 'Ideas include support for farmers and improving market infrastructure.' },
        { topic: 'Public Services', count: 2, description: 'Citizens want better waste management and security lighting.' },
      ],
      sentiment: { positive: 4, neutral: 6, negative: 2 },
    };
  }

  const prompt = `
    You are an expert policy analyst for Homa Bay County. Your task is to analyze project ideas submitted by citizens.
    Some submissions from SMS have been pre-categorized. Use these categories as a strong hint for clustering.
    Here is a list of submissions in JSON format:
    ${JSON.stringify(submissions.map(s => ({ title: s.title, description: s.description, location: s.location, category: s.category })), null, 2)}

    Please perform the following analysis:
    1.  Read all submissions and group them into logical clusters or topics (e.g., "Water & Sanitation", "Road Repairs", "Healthcare Facilities"). Consider the provided 'category' as a primary grouping factor.
    2.  Count how many submissions belong to each cluster.
    3.  Identify the top 5 most frequently requested topics.
    4.  Analyze the overall sentiment of the submissions, categorizing each as positive, neutral, or negative based on the tone and urgency. Count the totals for each sentiment category.
    5.  Return the final analysis in a structured JSON object. Do not include any explanatory text before or after the JSON.
    `;
    
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Ensure the result structure is valid before returning
    if (result.topPriorities && result.sentiment) {
      return result as AIAnalysisResult;
    } else {
        throw new Error("Invalid JSON structure from Gemini API");
    }

  } catch (error) {
    console.error("Error analyzing submissions with Gemini API:", error);
    // Fallback to mock data on error
    return {
      topPriorities: [
        { topic: 'Water Access', count: 3, description: 'Citizens are requesting new boreholes and wells for clean water.' },
        { topic: 'Roads & Infrastructure', count: 2, description: 'Requests focus on repairing roads and bridges for better transport.' },
        { topic: 'Healthcare', count: 2, description: 'Submissions highlight the need for better hospital facilities and equipment.' },
      ],
      sentiment: { positive: 4, neutral: 6, negative: 2 },
    };
  }
};