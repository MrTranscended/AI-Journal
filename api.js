export async function streamEnhancement({ text, style, mode = "rewrite" }) {
  const controller = new AbortController();

  const response = await fetch("http://192.168.1.53:3000/api/enhance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: controller.signal,
    body: JSON.stringify({
      mode,
      text,
      style,
      stream: true
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