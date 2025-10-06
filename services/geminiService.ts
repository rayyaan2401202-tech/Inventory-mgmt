
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Sale, RestockRecommendation } from '../types';

export const getRestockRecommendations = async (products: Product[], sales: Sale[]): Promise<RestockRecommendation[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const lowStockProducts = products.flatMap(p => 
    p.variants
      .filter(v => v.stock <= v.reorderLevel)
      .map(v => ({...v, productName: p.name}))
  );

  if (lowStockProducts.length === 0) {
      return [];
  }

  const recentSales = sales.filter(s => s.timestamp > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  const prompt = `
    You are an expert e-commerce inventory analyst for a fashion retailer.
    Based on the following inventory data for items with low stock and the recent sales history from the past 7 days, provide restocking recommendations.
    - Identify which SKUs are selling fastest and are at most risk of stocking out.
    - Recommend a specific quantity to reorder for each SKU.
    - The 'reorderLevel' for each product is the minimum stock before a reorder is recommended.
    - Provide a brief justification for each recommendation.
    - Base your suggested quantity on sales velocity, current stock, and a goal of maintaining at least 30 days of stock.

    Low Stock Inventory Data:
    ${JSON.stringify(lowStockProducts, null, 2)}

    Recent Sales History (past 7 days):
    ${JSON.stringify(recentSales, null, 2)}

    Provide your response in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sku: { type: Type.STRING },
              productName: { type: Type.STRING },
              currentStock: { type: Type.INTEGER },
              recommendation: { 
                type: Type.STRING, 
                description: "A brief justification for the recommendation." 
              },
              suggestedRestockQuantity: { type: Type.INTEGER }
            },
            required: ["sku", "productName", "currentStock", "recommendation", "suggestedRestockQuantity"]
          }
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as RestockRecommendation[];

  } catch (error) {
    console.error("Error fetching restock recommendations:", error);
    throw new Error("Failed to get recommendations from Gemini API.");
  }
};
