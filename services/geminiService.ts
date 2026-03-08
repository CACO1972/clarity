
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeClinicalCase(evidenceDescription: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this dental clinical evidence for an implant case: ${evidenceDescription}. 
      Use Google Search to find the latest clinical standards for this type of case if necessary.
      Provide a "Predictive Risk Analysis" and a "Preventive Recommendation" for the patient. 
      Also, suggest 3-4 treatments and for each, specify which P4 Medicine category it belongs to (Predictive, Preventive, Personalized, or Participatory) and why.
      Keep it professional but accessible.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING, description: 'High, Medium, or Low' },
            prediction: { type: Type.STRING, description: 'What will happen without treatment' },
            prevention: { type: Type.STRING, description: 'What we will achieve with treatment' },
            patientExplanation: { type: Type.STRING, description: 'A simple, motivating explanation for the patient' },
            suggestedTreatments: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  p4Category: { type: Type.STRING, description: 'Predictive, Preventive, Personalized, or Participatory' },
                  reasoning: { type: Type.STRING, description: 'Why it fits this P4 category' }
                },
                required: ['name', 'p4Category', 'reasoning']
              },
              description: 'List of 3-4 suggested treatments with P4 mapping'
            }
          },
          required: ['riskLevel', 'prediction', 'prevention', 'patientExplanation', 'suggestedTreatments']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}

export async function suggestTreatmentDetails(treatment: string, p4Category: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest clinical details for the dental treatment: "${treatment}" under the P4 Medicine category: "${p4Category}".
      Provide a detailed clinical description, an estimated duration, and follow-up care instructions.
      The tone should be professional and clinical.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detailedDescription: { type: Type.STRING },
            durationEstimate: { type: Type.STRING },
            followUpCareInstructions: { type: Type.STRING }
          },
          required: ['detailedDescription', 'durationEstimate', 'followUpCareInstructions']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return null;
  }
}
