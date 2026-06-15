const OPENAI_API_KEY =
  process.env.OPENAI_KEY || process.env.REACT_APP_OPENAI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API key is not configured" });
  }

  const { messages, max_tokens, model } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Missing messages" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages,
        max_tokens,
        model: model || "gpt-3.5-turbo",
      }),
    });
    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Failed to fetch OpenAI chat completion:", error);
    return res.status(502).json({ error: "Failed to fetch chat completion" });
  }
}
