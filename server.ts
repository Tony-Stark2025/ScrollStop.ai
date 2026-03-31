import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import path from "path";
import multer from "multer";

// Initialize Gemini
if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/generate-structure", upload.single('file'), async (req, res) => {
    try {
      const { topic, audience, tone, goal } = req.body;
      const file = req.file;

      if (!topic && !file) {
        return res.status(400).json({ error: "Topic or file is required" });
      }

      const prompt = `
        You are an expert social media marketer and copywriter.
        Take the provided input (raw text, audio, video, or document) and turn it into a highly engaging, viral 5-to-7 slide carousel (e.g., for LinkedIn or Instagram).
        
        Context:
        - Topic/Input Text: "${topic || 'See attached file'}"
        - Target Audience: "${audience || 'General Audience'}"
        - Tone: "${tone || 'Professional'}"
        - Goal: "${goal || 'Educate'}"

        Structure the carousel as follows:
        - Slide 1: The Hook (Punchy, attention-grabbing title).
        - Slides 2 to N-1: The Body (The core value, steps, or story broken down into bite-sized, easy-to-read chunks).
        - Slide N: The CTA (Call to action, summary, or engaging question).

        For each slide, you must also provide an 'imagePrompt'. This prompt will be sent to an AI image generator to create the background/visual for that specific slide. The image prompt should describe a clean, abstract, or metaphorical visual that matches the slide's content. Keep the image prompts highly descriptive but focused on visual elements (e.g., "A glowing neon lightbulb shattering glass, dark background, cinematic lighting, 3d render"). DO NOT ask for text in the image prompts.

        Return the output as a JSON object matching the requested schema.
      `;

      const contents: any[] = [];
      if (file) {
        contents.push({
          inlineData: {
            data: file.buffer.toString("base64"),
            mimeType: file.mimetype
          }
        });
      }
      contents.push({ text: prompt });

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview", // Upgraded to Pro for complex multimodal reasoning
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING, description: "A short, catchy title for the overall carousel" },
              slides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING, description: "A unique string ID for the slide (e.g., 'slide-1')" },
                    title: { type: Type.STRING, description: "The punchy headline for this specific slide" },
                    content: { type: Type.STRING, description: "The main body text for this slide. Keep it concise." },
                    imagePrompt: { type: Type.STRING, description: "The prompt for the AI image generator to create the background visual" },
                  },
                  required: ["id", "title", "content", "imagePrompt"],
                },
              },
            },
            required: ["topic", "slides"],
          },
        },
      });
      
      const jsonText = response.text || "{}";
      const cleanedJsonText = jsonText.replace(/^```json\s*|```\s*$/g, '');
      const data = JSON.parse(cleanedJsonText);
      res.json(data);
    } catch (error) {
      console.error("Error generating structure:", error);
      res.status(500).json({ error: "Failed to generate structure" });
    }
  });

  app.post("/api/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image', // Updated to gemini-2.5-flash-image
        contents: {
          parts: [
            {
              text: prompt + " -- no text, no words, beautiful composition, high quality, modern aesthetic",
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            // imageSize is not supported for gemini-2.5-flash-image
          }
        },
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          imageUrl = `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
          break;
        }
      }

      if (!imageUrl) {
        throw new Error("No image data found in response.");
      }

      res.json({ imageUrl });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ error: "Failed to generate image" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
