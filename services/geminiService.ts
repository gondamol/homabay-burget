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
      description: "List of the top 5 most common project themes or clusters. Include a total estimated budget for the entire category.",
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
          },
          cost: {
            type: Type.NUMBER,
            description: "A realistic, total estimated budget in Kenyan Shillings (KES) for the entire topic cluster. This should be an aggregate figure based on the number and scope of all submissions within this topic."
          }
        },
         required: ["topic", "count", "description", "cost"]
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
        { topic: 'Water Access', count: 3, description: 'Citizens are requesting new boreholes and wells for clean water.', cost: 2400000 },
        { topic: 'Roads & Infrastructure', count: 2, description: 'Requests focus on repairing roads and bridges for better transport.', cost: 10000000 },
        { topic: 'Healthcare', count: 2, description: 'Submissions highlight the need for better hospital facilities and equipment.', cost: 6500000 },
        { topic: 'Economic Empowerment', count: 2, description: 'Ideas include support for farmers and improving market infrastructure.', cost: 3000000 },
        { topic: 'Public Services', count: 2, description: 'Citizens want better waste management and security lighting.', cost: 2500000 },
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
    3.  For each topic, provide a realistic **total estimated budget** in Kenyan Shillings (KES). This budget should be an aggregation based on the number of submissions and their described scope. For example, if there are 3 requests for new boreholes, and a single borehole costs 800,000 KES, the total estimated budget for the 'Water Access' topic should be around 2,400,000 KES. If submissions describe larger projects (e.g., "rehabilitate the entire town's water piping"), the estimate should be significantly higher. Use your general knowledge of infrastructure costs in Kenya to make these estimates credible.
    4.  Identify the top 5 most frequently requested topics.
    5.  Analyze the overall sentiment of the submissions, categorizing each as positive, neutral, or negative based on the tone and urgency. Count the totals for each sentiment category.
    6.  Return the final analysis in a structured JSON object. Do not include any explanatory text before or after the JSON.
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
    
    if (result.topPriorities && result.sentiment) {
      return result as AIAnalysisResult;
    } else {
        throw new Error("Invalid JSON structure from Gemini API");
    }

  } catch (error) {
    console.error("Error analyzing submissions with Gemini API:", error);
    return {
      topPriorities: [
        { topic: 'Water Access', count: 3, description: 'Citizens are requesting new boreholes and wells for clean water.', cost: 2400000 },
        { topic: 'Roads & Infrastructure', count: 2, description: 'Requests focus on repairing roads and bridges for better transport.', cost: 10000000 },
        { topic: 'Healthcare', count: 2, description: 'Submissions highlight the need for better hospital facilities and equipment.', cost: 6500000 },
      ],
      sentiment: { positive: 4, neutral: 6, negative: 2 },
    };
  }
};

export const getConciergeResponse = async (newIdea: ProjectIdea, allIdeas: ProjectIdea[]): Promise<string> => {
    // This is a frontend simulation. In production, this logic would be on the backend.
    const similarIdeas = allIdeas.filter(idea => {
        const titleWords = new Set(idea.title.toLowerCase().split(' '));
        const newTitleWords = newIdea.title.toLowerCase().split(' ');
        return newTitleWords.some(word => titleWords.has(word) && word.length > 3);
    }).length;

    if (!API_KEY) {
      // Return mock response
       return `Thank you for your submission about "${newIdea.title}". We've received it and our team will review it. We found ${similarIdeas} other similar submission(s) from your fellow citizens. This helps us understand the priorities of the community. You can track the overall community priorities on the main dashboard.`;
    }
    
    const prompt = `
        You are a helpful and encouraging AI assistant for the Homa Bay County government.
        A citizen has just submitted a new project idea. Your task is to generate a warm, personal, and informative acknowledgment message.

        New Submission Details:
        - Title: "${newIdea.title}"
        - Description: "${newIdea.description}"
        - Location: "${newIdea.location}"
        
        Context:
        - There are already ${similarIdeas} other submissions that seem related to this one.

        Instructions:
        1. Thank the citizen for their submission, mentioning the title of their idea.
        2. Acknowledge that you see other similar requests from the community. Mention the number of similar ideas found.
        3. Reassure them that their voice is important for identifying community needs.
        4. Encourage them to view the public dashboard to see how their idea contributes to the overall priorities.
        5. Keep the tone positive and empowering. The response should be a single paragraph.
    `;

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        return response.text;
    } catch(error) {
        console.error("Error generating concierge response:", error);
        return `Thank you for your submission about "${newIdea.title}". We have successfully received it. Your participation is valuable to us. Please check the public dashboard for updates on community priorities.`;
    }
}