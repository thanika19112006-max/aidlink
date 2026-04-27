module {
  /// Supported translation target languages
  public type LanguageCode = Text; // e.g. "en", "ta", "hi"

  /// Input for a translation request
  public type TranslateInput = {
    text : Text;
    targetLang : LanguageCode;
  };

  /// Result of a translation request
  public type TranslateResult = {
    translatedText : Text;
    sourceText : Text;
    targetLang : LanguageCode;
  };

  /// Result of a language detection request
  public type DetectResult = {
    detectedLang : LanguageCode;
    sourceText : Text;
  };
};
