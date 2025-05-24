// scripts/settings.js
export function registerSettings() {
  game.settings.register("ai-journal-enhancer", "genrePresets", {
    name: "AIJournalEnhancer.SettingsGenre",
    hint: "AIJournalEnhancer.SettingsGenreHint",
    scope: "world", type: String, default: "Poetic, Noir, Fantasy, Epic, Western",
    config: true
  });
  game.settings.register("ai-journal-enhancer", "enableLanguageDropdown", {
    name: "AIJournalEnhancer.SettingsEnableLang",
    hint: "AIJournalEnhancer.SettingsEnableLangHint",
    scope: "world", type: Boolean, default: false, config: true
  });
  game.settings.register("ai-journal-enhancer", "languagePresets", {
    name: "AIJournalEnhancer.SettingsLangList",
    hint: "AIJournalEnhancer.SettingsLangListHint",
    scope: "world", type: String,
    default: "English, Spanish, French, German, Russian, Chinese, Japanese, Tagalog, Arabic, Hindi",
    config: true
  });
  game.settings.register("ai-journal-enhancer", "enableCustomPrompts", {
    name: "AIJournalEnhancer.SettingsCustomPrompt",
    hint: "AIJournalEnhancer.SettingsCustomPromptHint",
    scope: "world", type: Boolean, default: true, config: true
  });
  game.settings.register("ai-journal-enhancer", "apiEndpoint", {
    name: "AIJournalEnhancer.SettingsAPIUrl",
    hint: "AIJournalEnhancer.SettingsAPIUrlHint",
    scope: "world", type: String, default: "http://localhost:3000/api/enhance", config: true
  });
  game.settings.register("ai-journal-enhancer", "autoCollapse", {
    name: "AIJournalEnhancer.SettingsAutoCollapse",
    hint: "AIJournalEnhancer.SettingsAutoCollapseHint",
    scope: "world", type: Boolean, default: true, config: true
  });
  game.settings.register("ai-journal-enhancer", "showMetadata", {
    name: "AIJournalEnhancer.SettingsShowMeta",
    hint: "AIJournalEnhancer.SettingsShowMetaHint",
    scope: "world", type: Boolean, default: false, config: true
  });
}