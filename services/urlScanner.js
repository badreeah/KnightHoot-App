// src/services/urlScanner.js
const API_BASE =
  process.env.EXPO_PUBLIC_URL_MODEL_API ??
  "https://url-scam-detector-api-production.up.railway.app";

export const classifyUrlAI = async (inputUrl) => {
  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: inputUrl }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error (${response.status}): ${text}`);
  }

  const data = await response.json();

  const domain = (inputUrl || "")
    .replace(/^https?:\/\//, "")
    .split("/")[0]
    .toLowerCase();

  const isMalicious =
    data.prediction === "malicious" ||
    data.label === 1 ||
    data.label === "notsafe";

  const score =
    data.probability_malicious ??
    data.probability ??
    null;

  return {
    domain,
    label: isMalicious ? "notsafe" : "safe",
    score,
    reasons: [
      isMalicious
        ? "Model classified the URL as malicious/suspicious"
        : "Model classified the URL as safe",
    ],
    raw: data,
  };
};
