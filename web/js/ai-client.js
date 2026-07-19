// Track C — direct client-side calls to Groq / Mistral.
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
    return localStorage.getItem("tb_ai_provider_active") || "groq";
  }

  function getKey(provider) {
    return localStorage.getItem("tb_ai_key_" + provider) || "";
  }

  function isAiEnabled() {
    return !!(window.TBUser && window.TBUser.aiEnabled === true);
  }

  async function callGroq(key, systemPrompt, userPrompt) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });
    if (!res.ok) throw new Error("Groq API error: " + res.status);
    const data = await res.json();
    return data.choices[0].message.content.trim();
  }

  async function callMistral(key, systemPrompt, userPrompt) {
    const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key,
      },
      body: JSON.stringify({
        model: "mistral-small-latest",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        max_tokens: 300,
      }),
    });
    if (!res.ok) throw new Error("Mistral API error: " + res.status);
    const data = await res.json();
    return data.choices[0].message.content.trim();
  }

  // Returns generated text, or throws if AI is disabled / no key / call fails.
  async function generate(systemPrompt, userPrompt) {
    if (!isAiEnabled()) throw new Error("AI disabled by permission setting");

    const provider = getActiveProvider();
    const key = getKey(provider);
    if (!key) throw new Error("No API key saved for " + provider);

    if (provider === "mistral") return callMistral(key, systemPrompt, userPrompt);
    return callGroq(key, systemPrompt, userPrompt);
  }

  return { generate, isAiEnabled, getActiveProvider };
})();
