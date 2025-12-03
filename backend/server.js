import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Basic security / rate limit suggestions:
// - In production add rate-limiting (express-rate-limit) and auth (JWT / API key from frontend).
// - Do not log the API key anywhere.

const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY in environment variables. Exiting.");
  process.exit(1);
}

/**
 * callGemini(prompt)
 * - This shows using the official SDK style as an example.
 * - If your SDK usage is different, replace this function with the official call.
 */
async function callGemini(prompt) {
  // Example using the SDK pattern shown previously. If your SDK differs,
  // replace this section with the exact SDK/REST call.
  try {
    // Lazy import to keep startup lighter if not using SDK
    const { GoogleGenerativeAI } = await import("@google/generative-ai");

    // Initialize client (pattern used earlier). If the library uses a factory method, adapt.
    const genai = new GoogleGenerativeAI({
      apiKey: GEMINI_API_KEY
    });

    // Example model selection (change to your desired model)
    const model = genai.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    // Depending on the SDK, calling method names may differ.
    // This matches the earlier example: model.generateContent(prompt)
    const response = await model.generateContent({
      // some SDKs expect a structured request; adapt as required
      input: prompt
    });

    // The response shape will depend on SDK — adapt extraction accordingly.
    // Here we try a few common possibilities.
    if (response?.output?.[0]?.content?.[0]?.text) {
      return response.output[0].content[0].text;
    }
    if (response?.response?.text) {
      return response.response.text();
    }
    // fallback: stringify the entire response
    return JSON.stringify(response);
  } catch (err) {
    // If you prefer REST/axios instead of SDK, do it here.
    console.error("callGemini error:", err);
    throw err;
  }
}

app.post("/api/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'prompt' in request body." });
    }

    const reply = await callGemini(prompt);
    return res.json({ reply });
  } catch (err) {
    console.error("Server error:", err?.message ?? err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Gemini backend listening on port ${PORT}`);
});
