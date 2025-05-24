import { streamEnhancement } from "./api.js";

function buildPrompt(text, style, mode) {
  if (mode === "translate") {
    return `Translate the following text into ${style} only:\n\n${text}`;
  }
  return `Rewrite the following text in a ${style} tone:\n\n${text}`;
}

async function enhanceWithProgress(text, style, mode = "rewrite") {
  return new Promise(async (resolve, reject) => {
    let accumulated = "";
    let controller;

    const dialog = new Dialog({
      title: "AI Journal Enhancer",
      content: `
        <div class="progress-modal">
          <i class="fas fa-spinner fa-pulse fa-2x"></i>
          <span>Enhancing with AI…</span>
          <pre id="ai-progress" style="max-height:300px;overflow:auto;"></pre>
        </div>`,
      buttons: {
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: "Cancel",
          callback: () => controller?.abort()
        }
      },
      default: "cancel",
      close: () => controller?.abort()
    }, { width: 400 }).render(true);

    try {
      const result = await streamEnhancement({ text, style, mode });
      controller = result.controller;

      for await (const chunk of result.stream) {
        accumulated += chunk;
        document.getElementById("ai-progress").textContent = accumulated;
      }

      dialog.close();
      resolve(accumulated);
    } catch (err) {
      console.warn("AI Enhancer error:", err);
      dialog.close();
      ui.notifications.error("AI enhancement was canceled or failed.");
      reject(err);
    }
  });
}

// Enhance a single journal entry
Hooks.on("renderJournalSheet", (app, html) => {
  if (!game.user.isGM) return;

  const btn = $(`<a class="header-button"><i class="fas fa-magic"></i> Enhance AI</a>`);
  btn.on("click", async () => {
    const original = app.document.content;
    const style = game.settings.get("ai-journal-enhancer", "defaultStyle");
    const enableLang = game.settings.get("ai-journal-enhancer", "enableLanguage");
    const language = game.settings.get("ai-journal-enhancer", "defaultLanguage");
    const mode = enableLang ? "translate" : "rewrite";
    const enhanced = await enhanceWithProgress(original, enableLang ? language : style, mode);

    await app.document.update({
      content: `${original}<hr><h3>AI Enhanced (${enableLang ? language : style})</h3>\n<p>${enhanced}</p>`
    });
  });

  html.closest(".app").find(".window-title").after(btn);
});

// Add "Enhance All Journals" to Journal Directory
Hooks.on("renderJournalDirectory", (app, html) => {
  if (!game.user.isGM) return;

  const header = html.find(".directory-header");
  const button = $(`<button class="enhance-all"><i class="fas fa-magic"></i> Enhance All Journals</button>`);
  button.css({ margin: "0 10px" });

  button.on("click", async () => {
    const style = game.settings.get("ai-journal-enhancer", "defaultStyle");
    const enableLang = game.settings.get("ai-journal-enhancer", "enableLanguage");
    const language = game.settings.get("ai-journal-enhancer", "defaultLanguage");
    const mode = enableLang ? "translate" : "rewrite";

    for (let journal of game.journal.contents) {
      const original = journal.content;
      const enhanced = await enhanceWithProgress(original, enableLang ? language : style, mode);
      await journal.update({
        content: `${original}<hr><h3>AI Enhanced (${enableLang ? language : style})</h3>\n<p>${enhanced}</p>`
      });
    }

    ui.notifications.info("✅ All journal entries enhanced.");
  });

  header.append(button);
});