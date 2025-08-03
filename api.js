export async function fetchEnhancement({ text, max_new_tokens = 200, temperature = 0.7 }) {
  const response = await fetch("http://192.168.1.53:8000/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: text,
      max_new_tokens,
      temperature
    })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch enhancement.");
  }

  const data = await response.json();
  return data.response; // The generated text string
}
