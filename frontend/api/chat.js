export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", chunk => (data += chunk));
      req.on("end", () => resolve(JSON.parse(data || "{}")));
      req.on("error", reject);
    });

    const { prompt } = body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const ai = new GoogleGenerativeAI({ apiKey: GEMINI_API_KEY });
    const model = ai.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const reply =
      result?.response?.text?.() ||
      result?.output?.[0]?.content?.[0]?.text ||
      JSON.stringify(result);

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
