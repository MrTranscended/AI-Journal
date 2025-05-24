// scripts/api.js
/**
 * Send a POST request to the AI backend for rewriting or translation.
 * Assumes the backend expects a JSON payload and returns { text: string }.
 */
export async function callAIEndpoint({ text, style, language, prompt, mode }) {
  const apiUrl = game.settings.get("ai-journal-enhancer", "apiEndpoint");
  const payload = { mode, text, style, prompt };
  if (language) payload.language = language;
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`AI API error: ${response.statusText}`);
  const data = await response.json();
  return data.text;
}