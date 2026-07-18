// Simple mobile/desktop view toggle.
// Default: mobile layout. User can switch to "Desktop Version" and it's
// remembered for the session via sessionStorage.

(function () {
  const KEY = "tb_view_mode";
  const btn = document.getElementById("viewToggleBtn");

  function applyMode(mode) {
    if (mode === "desktop") {
      document.body.classList.add("desktop-mode");
      if (btn) btn.textContent = "Mobile Version";
    } else {
      document.body.classList.remove("desktop-mode");
      if (btn) btn.textContent = "Desktop Version";
    }
  }

  const saved = sessionStorage.getItem(KEY) || "mobile";
  applyMode(saved);

  if (btn) {
    btn.addEventListener("click", function () {
      const current = sessionStorage.getItem(KEY) || "mobile";
      const next = current === "mobile" ? "desktop" : "mobile";
      sessionStorage.setItem(KEY, next);
      applyMode(next);
    });
  }
})();
