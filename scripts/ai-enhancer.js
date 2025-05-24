// scripts/ai-enhancer.js
import { registerSettings } from "./settings.js";
import { callAIEndpoint } from "./api.js";

Hooks.once("init", () => {
  registerSettings();
});

Hooks.on("getApplicationHeaderButtons", (app, buttons) => {
  // Add button to Journal Sheet header
  if (app.constructor.name === "JournalSheet") {
    buttons.push({
      label: "Make better with AI",
      class: "ai-enhance-btn",
      icon: "fas fa-robot",
      onClick: () => openEnhanceDialog(app.document)
    });
  }
});

// Function to open the enhancement dialog for a given JournalEntry
async function openEnhanceDialog(journal) {
  const genres = game.settings.get("ai-journal-enhancer", "genrePresets")
    .split(/\s*,\s*/);
  const enableLang = game.settings.get("ai-journal-enhancer", "enableLanguageDropdown");
  const languages = game.settings.get("ai-journal-enhancer", "languagePresets")
    .split(/\s*,\s*/);
  const template = `
    <form>
      <div class="form-group">
        <label>Style/Genre:</label>
        <select id="genre">
          ${genres.map(g => `<option>${g.trim()}</option>`).join("")}
        </select>
      </div>
      ${enableLang ? `
      <div class="form-group">
        <label>Translate to:</label>
        <select id="language">
          <option value="">None</option>
          ${languages.map(l => `<option>${l.trim()}</option>`).join("")}
        </select>
      </div>` : ''}
      ${game.settings.get("ai-journal-enhancer", "enableCustomPrompts") ? `
      <div class="form-group">
        <label>Custom Prompt (optional):</label>
        <input type="text" id="prompt" placeholder="Enter custom instructions...">
      </div>` : ''}
    </form>
  `;
  new Dialog({
    title: `Enhance "${journal.name}" with AI`,
    content: template,
    buttons: {
      enhance: {
        icon: '<i class="fas fa-magic"></i>',
        label: "Enhance",
        callback: async (html) => {
          const style = html.find("#genre").val();
          const language = enableLang ? html.find("#language").val() : "";
          const prompt = game.settings.get("ai-journal-enhancer", "enableCustomPrompts")
                         ? html.find("#prompt").val() : "";
          await applyEnhancement(journal, style, language, prompt);
        }
      }
    }
  }).render(true);
}

// Apply enhancement to all text pages of the journal
async function applyEnhancement(journal, style, language, prompt) {
  const autoCollapse = game.settings.get("ai-journal-enhancer", "autoCollapse");
  const showMeta = game.settings.get("ai-journal-enhancer", "showMetadata");
  const timestamp = new Date().toLocaleString();
  for (let page of journal.pages) {
    if (page.text) {
      const originalText = page.text;
      // Call backend for rewrite
      let enhanced = await callAIEndpoint({ text: originalText, style, prompt, mode: "rewrite" });
      // Build AI-enhanced section
      let meta = showMeta ? ` (Style: ${style}, Time: ${timestamp})` : "";
      let detailsHTML = `<details${autoCollapse?"": " open"} class="ai-enhanced">
        <summary>AI Enhanced${meta}</summary>
        <div>${enhanced}</div>
      </details>`;
      // If language selected, call translation
      if (language) {
        let translated = await callAIEndpoint({ text: enhanced, language, mode: "translate" });
        let langMeta = showMeta ? ` (${language}, ${timestamp})` : "";
        detailsHTML += `<details${autoCollapse?"": " open"} class="ai-enhanced">
          <summary>AI Translation (${language})${langMeta}</summary>
          <div>${translated}</div>
        </details>`;
      }
      // Append to existing page text
      const newText = originalText + detailsHTML;
      await journal.updateEmbeddedDocuments("JournalEntryPage", [
        { _id: page.id, text: newText }
      ]);
    }
  }
}

// Allow GM to remove an AI section
Hooks.on("renderJournalSheet", (sheet, html) => {
  // Append a remove icon to each AI section summary
  html.find("details.ai-enhanced > summary").append(`<a href="#" class="remove-ai" style="margin-left:10px;"><i class="fas fa-trash"></i></a>`);
  html.on("click", "a.remove-ai", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const summary = $(event.currentTarget).closest("summary");
    const details = summary.parent();
    const contentToRemove = details[0].outerHTML;
    const pageDiv = summary.closest(".journal-page");
    const pageId = pageDiv.data("pageId");  // Assumes each page container has data-page-id
    const journal = sheet.document;
    // Find the JournalEntryPage document to update
    const pageDoc = journal.pages.get(pageId);
    if (!pageDoc) return ui.notifications.error("AI Journal Enhancer: Could not find page to update.");
    const updatedText = pageDoc.text.replace(contentToRemove, "");
    await journal.updateEmbeddedDocuments("JournalEntryPage", [
      { _id: pageId, text: updatedText }
    ]);
    // Re-render to update UI
    sheet.render();
  });
});