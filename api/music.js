import fetch from "node-fetch";
export default async function handler(req, res) {
  const ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || "*";
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    return res.status(200).end();
  }
  res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
    const key = process.env.STABILITY_API_KEY;
    if (!key) return res.status(500).json({ error: "Falta STABILITY_API_KEY" });
    const { prompt, duration = 50, bpm, format = "wav" } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "Campo 'prompt' é obrigatório" });
    const dur = Math.max(10, Math.min(Number(duration) || 50, 60)); // Hobby-safe
    const fullPrompt = `${prompt}${bpm ? `, ${bpm} bpm` : ""}`.trim();
    const endpoint = process.env.STABILITY_ENDPOINT || "https://api.stability.ai/v2beta/audio/generate";
    const r = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: fullPrompt, duration: dur, format })
    });
    if (!r.ok) return res.status(502).send(await r.text());
    const ab = await r.arrayBuffer();
    const buf = Buffer.from(ab);
    res.setHeader("Content-Type", format === "mp3" ? "audio/mpeg" : "audio/wav");
    res.send(buf);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}