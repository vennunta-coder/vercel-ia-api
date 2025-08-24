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
    const key = process.env.STABILITY_API_KEY;
    if (!key) return res.status(500).json({ error: "Falta STABILITY_API_KEY" });
    const format = (process.env.DEFAULT_FORMAT || "wav").toLowerCase() === "mp3" ? "mp3" : "wav";
    const duration = 45 + Math.floor(Math.random() * 15); // Hobby-safe 45–60s
    const bpm = 70 + Math.floor(Math.random() * 80);
    const prompts = (process.env.PROMPTS || "ambient cinematic, evolving pads, {bpm} bpm|indie pop clean guitars, {bpm} bpm|lo-fi mellow, {bpm} bpm").split("|");
    const prompt = prompts[Math.floor(Math.random() * prompts.length)].replace("{bpm}", String(bpm));
    const endpoint = process.env.STABILITY_ENDPOINT || "https://api.stability.ai/v2beta/audio/generate";
    const r = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, duration, format })
    });
    if (!r.ok) return res.status(502).send(await r.text());
    const ab = await r.arrayBuffer();
    const buf = Buffer.from(ab);
    res.setHeader("Content-Type", format === "mp3" ? "audio/mpeg" : "audio/wav");
    res.setHeader("X-Prompt", encodeURIComponent(prompt));
    res.send(buf);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}