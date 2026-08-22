import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

let genAIClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) });
  });

  // Multi-turn Gemini Chatbot endpoint for Travel Saarthi
  app.post('/api/saarthi/chat', async (req, res) => {
    try {
      const {
        messages = [],
        mood,
        tripContext,
        modelName = 'gemini-3.5-flash',
      } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      const client = getGeminiClient();

      // Determine appropriate model
      let selectedModel = modelName;
      if (selectedModel !== 'gemini-3.1-pro-preview' && selectedModel !== 'gemini-3.1-flash-lite' && selectedModel !== 'gemini-3.5-flash') {
        selectedModel = 'gemini-3.5-flash';
      }

      const systemInstruction = `You are Travel Saarthi, an expert AI travel strategist and personal trip co-pilot in the GlobeTrotter application.
Your personality is enthusiastic, friendly, culturally insightful, and practical.
You specialize in Indian travel routes (Ahmedabad, Mumbai, Goa, Udaipur, Kerala, Manali, Jaipur, Delhi, Varanasi, etc.) as well as worldwide destinations.
You assist travelers with:
1. Multi-city itinerary crafting with balanced pacing.
2. Smart budget optimization (giving estimates in INR ₹ or local currency) and money-saving hacks.
3. Authentic local food recommendations, street food trails, and cultural etiquette.
4. Hidden gems, scenic photography spots, and offbeat adventures.
${mood ? `The user is currently in a "${mood}" travel mood. Tailor your recommendations to emphasize this vibe.` : ''}
${tripContext ? `The user is planning a trip called "${tripContext.name || 'My Trip'}" across [${(tripContext.destinations || []).join(', ')}] lasting ${tripContext.totalDays || 5} days with a budget of ₹${tripContext.budget || 30000}.` : ''}

Response Guidelines:
- Keep answers engaging, structured, and easy to scan with bullet points and bold highlights.
- Avoid overwhelming walls of text.
- At the very end of your response, output a single line with 2 to 4 suggested quick follow-up actions in JSON format prefixed with "SUGGESTIONS:", like this:
SUGGESTIONS: ["Plan a 5-day route", "Show top vegetarian food spots", "Reduce budget under ₹25,000"]`;

      if (client) {
        // Format previous turns for Gemini multi-turn
        const contents = messages.map((m: { role: string; content: string }) => {
          const role =
            m.role === 'model' || m.role === 'assistant' || m.role === 'saarthi'
              ? 'model'
              : 'user';
          return {
            role,
            parts: [{ text: m.content || '' }],
          };
        });

        const response = await client.models.generateContent({
          model: selectedModel,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.95,
          },
        });

        const rawText = response.text || '';

        // Extract suggestions if present
        let cleanContent = rawText;
        let suggestedActions: string[] = [];

        const suggestionsMatch = rawText.match(/SUGGESTIONS:\s*(\[.*?\])/s);
        if (suggestionsMatch && suggestionsMatch[1]) {
          try {
            suggestedActions = JSON.parse(suggestionsMatch[1]);
            cleanContent = rawText.replace(/SUGGESTIONS:\s*\[.*?\]/s, '').trim();
          } catch (e) {
            // Ignore parse errors, fallback
          }
        }

        if (suggestedActions.length === 0) {
          suggestedActions = [
            'Customize itinerary for this',
            'Find local food spots',
            'Optimize my trip budget',
          ];
        }

        return res.json({
          content: cleanContent,
          suggestedActions,
          modelUsed: selectedModel,
        });
      } else {
        // Fallback simulated intelligent response if no API key is set yet
        const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
        const lower = lastUserMessage.toLowerCase();

        let content = `I have received your query: "${lastUserMessage}".\n\nTo provide personalized AI travel guidance with live Gemini intelligence, ensure your Gemini API key is configured. Here are curated suggestions for your journey:\n- **Recommended Route**: Explore top-rated stops with optimal transit connections.\n- **Pacing**: Dedicate 2 nights per major destination for immersive local discovery.\n- **Budget Tip**: Book inter-city express trains (e.g. Vande Bharat) in advance.`;
        let suggestedActions = ['Plan 5-day itinerary', 'Reduce my trip budget', 'Find hidden gems'];

        if (lower.includes('ahmedabad') || lower.includes('5 day') || lower.includes('goa')) {
          content = `I’ve mapped out a vibrant **5-day West Coast Odyssey: Ahmedabad → Mumbai → Goa**! 🌅\n\n- **Days 1–2 (Ahmedabad)**: Historic UNESCO Pols heritage walk, Sabarmati Riverfront sunset cycling, and Manek Chowk midnight street food.\n- **Day 3 (Mumbai)**: Scenic Vande Bharat rail transit, Gateway of India, Kala Ghoda art walk, and Marine Drive evening breeze.\n- **Days 4–5 (Goa)**: Fontainhas Latin quarter photography trail, Dudhsagar jungle safari, and an acoustic sunset catamaran cruise.`;
          suggestedActions = ['Apply this route to my trip', 'Optimize for food & culture', 'Keep under ₹30,000'];
        }

        return res.json({
          content,
          suggestedActions,
          modelUsed: `${selectedModel} (Mock Mode)`,
        });
      }
    } catch (error: any) {
      console.error('Gemini Saarthi Chat Error:', error);
      return res.status(500).json({
        error: error.message || 'Failed to generate response with Gemini',
      });
    }
  });

  // Vite middleware for development vs static production serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GlobeTrotter server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
