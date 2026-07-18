// Track C — direct client-side calls to Grok (xAI) / Cerebras.
// No server/Cloud Function in between (see PROJECT_STATE.md decision).
//
// ⚠️ KNOWN RISK: these APIs are primarily meant for server-side use. Calling
// them directly from a browser page (GitHub Pages) may be blocked by CORS,
// depending on whether the provider sends Access-Control-Allow-Origin
// headers. If it fails in the web version, try it from the Android app
// (Capacitor apps run in a WebView that behaves the same as a browser for
// fetch(), so if CORS blocks it there too, we'll need to switch to the
// native CapacitorHttp plugin instead of fetch() — noted as an open item).
//
// Every function here throws on failure. Callers (lesson-generator.js,
// ai-coach.js) MUST catch and fall back to rule-based content.

const AIClient = (function () {
  function getActiveProvider() {
    return localStorage.getItem("tb_ai_provider_active") || "grok";
  }

  function getKey(provider) {
    return localStorage.getItem("tb_ai_key_" + provider) || "";
  }

  function isAiEnabled() {
    return localStorage.getItem("tb_ai_enabled") === "true";
  }

  async function callGrok(key, systemPrompt, userPrompt) {
    const res = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key,
      },
      body: JSON.stringify({
        model: "grok-4.3",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });
    if (!res.ok) throw new Error("Grok API error: " + res.status);
    const data = await res.json();
    return data.choices[0].message.content.trim();
  }

  async function callCerebras(key, systemPrompt, userPrompt) {
    const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });
    if (!res.ok) throw new Error("Cerebras API error: " + res.status);
    const data = await res.json();
    return data.choices[0].message.content.trim();
  }

  // Returns generated text, or throws if AI is disabled / no key / call fails.
  async function generate(systemPrompt, userPrompt) {
    if (!isAiEnabled()) throw new Error("AI disabled by permission setting");

    const provider = getActiveProvider();
    const key = getKey(provider);
    if (!key) throw new Error("No API key saved for " + provider);

    if (provider === "cerebras") return callCerebras(key, systemPrompt, userPrompt);
    return callGrok(key, systemPrompt, userPrompt);
  }

  return { generate, isAiEnabled, getActiveProvider };
})();
