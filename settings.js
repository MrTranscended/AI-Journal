// Register module settings
Hooks.once("init", () => {
  const namespace = "ai-journal-enhancer";

  game.settings.register(namespace, "defaultStyle", {
    name: "Default Style",
    hint: "Choose a default rewrite style.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      Epic: "Epic",
      Poetic: "Poetic",
      Mystery: "Mystery",
      Noir: "Film Noir"
    },
    default: "Epic"
  });

  game.settings.register(namespace, "enableLanguage", {
    name: "Enable Translation",
    hint: "Show language dropdown for translation mode",
    scope: "world",
    config: true,
    type: Boolean,
    default: false
  });

  game.settings.register(namespace, "languages", {
    name: "Languages",
    hint: "Top 10 languages available for translation",
    scope: "world",
    config: true,
    type: String,
    default: "Spanish,German,French,Russian,Tagalog,Italian,Portuguese,Japanese,Korean,Chinese"
  });

  game.settings.register(namespace, "defaultLanguage", {
    name: "Default Language",
    hint: "Choose a default translation language.",
    scope: "world",
    config: true,
    type: String,
    default: "Spanish"
  });
});