export async function streamEnhancement({ prompt, max_new_tokens = 200, temperature = 0.7 }) {
  const controller = new AbortController();

  const response = await fetch("http://192.168.1.53:8000/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: controller.signal,
    body: JSON.stringify({
      prompt,
      max_new_tokens,
      temperature
    })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch enhancement.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  async function* streamText() {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield decoder.decode(value);
    }
  }

  return { stream: streamText(), controller };
}
