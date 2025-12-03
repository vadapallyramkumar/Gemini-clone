// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     res.status(405).json({ error: "Method not allowed" });
//     return;
//   }

//   try {
//     const body = await new Promise((resolve, reject) => {
//       let data = "";
//       req.on("data", chunk => (data += chunk));
//       req.on("end", () => resolve(JSON.parse(data || "{}")));
//       req.on("error", reject);
//     });

//     const { prompt } = body;

//     if (!prompt) {
//       res.status(400).json({ error: "Prompt is required" });
//       return;
//     }

//     const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

//     const { GoogleGenerativeAI } = await import("@google/generative-ai");
//     const ai = new GoogleGenerativeAI({ apiKey: GEMINI_API_KEY });
//     const model = ai.getGenerativeModel({ model: "models/gemini-2.5-flash" });

//     const result = await model.generateContent(prompt);
//     const reply =
//       result?.response?.text?.() ||
//       result?.output?.[0]?.content?.[0]?.text ||
//       JSON.stringify(result);

//     res.status(200).json({ reply });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// }

// frontend/api/chat.js — debug version (deploy this temporarily)
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // parse body safely
    const raw = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", (chunk) => (data += chunk));
      req.on("end", () => {
        try { resolve(JSON.parse(data || "{}")); }
        catch (e) { reject(e); }
      });
      req.on("error", reject);
    });

    const { prompt } = raw;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    // Check env var
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.error("Missing GEMINI_API_KEY");
      return res.status(500).json({ error: "Server not configured (missing GEMINI_API_KEY)" });
    }

    // Optional: quick placeholder reply to verify everything else works
    // Comment this out when you want to call the real SDK.
    // const reply = `echo: ${prompt}`;
    // return res.status(200).json({ reply });

    // Real call: wrap in try/catch and log errors
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const ai = new GoogleGenerativeAI({ apiKey: key });
      const model = ai.getGenerativeModel({ model: "models/gemini-2.5-flash" });
      const result = await model.generateContent({ input: prompt });

      // adapt to the shape your SDK returns
      const reply =
        result?.output?.[0]?.content?.[0]?.text ??
        (typeof result?.response?.text === "function" ? result.response.text() : JSON.stringify(result));

      return res.status(200).json({ reply });
    } catch (sdkErr) {
      console.error("SDK error:", sdkErr);
      // Return a generic error but show message in logs
      return res.status(500).json({ error: "Failed to call Gemini (check function logs)" });
    }
  } catch (err) {
    console.error("api/chat unexpected error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
