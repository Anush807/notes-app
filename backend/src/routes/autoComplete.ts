import { Hono } from "hono";
import axios from "axios";

export const aiRoute = new Hono<{
  Bindings: { HF_API_KEY: string };
}>();

aiRoute.post("/autocomplete", async (c) => {
  try {
    const { prompt } = await c.req.json();

    if (!prompt) {
      return c.json({ error: "Prompt is required" }, 400);
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B",
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 20, // adjust for short autocompletion
          temperature: 0.7,
          top_p: 0.9,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${c.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data[0]?.generated_text || "";
    return c.json({ completion: text });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to generate completion" }, 500);
  }
});
