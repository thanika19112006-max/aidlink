import Text "mo:core/Text";
import OutCall "mo:caffeineai-http-outcalls/outcall";

module {
  /// Calls Google Cloud Translation API to translate text into targetLang.
  /// Returns translated text, or original text on error.
  public func translateText(
    apiKey : Text,
    text : Text,
    targetLang : Text,
    transform : shared query OutCall.TransformationInput -> async OutCall.TransformationOutput,
  ) : async Text {
    let url = "https://translation.googleapis.com/language/translate/v2?key=" # apiKey;
    let body = "{\"q\":\"" # escapeJson(text) # "\",\"target\":\"" # targetLang # "\",\"format\":\"text\"}";
    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/json" },
    ];

    try {
      let response = await OutCall.httpPostRequest(url, headers, body, transform);
      // Extract translatedText from JSON response
      // Response shape: {"data":{"translations":[{"translatedText":"..."}]}}
      switch (extractJsonStringField(response, "translatedText")) {
        case (?translated) { translated };
        case null { text };
      };
    } catch (_) {
      text;
    };
  };

  /// Calls Google Cloud Translation detect endpoint to identify the language of text.
  /// Returns BCP-47 language code (e.g. "en", "ta", "hi"), or "en" on error.
  public func detectLanguage(
    apiKey : Text,
    text : Text,
    transform : shared query OutCall.TransformationInput -> async OutCall.TransformationOutput,
  ) : async Text {
    let url = "https://translation.googleapis.com/language/translate/v2/detect?key=" # apiKey;
    let body = "{\"q\":\"" # escapeJson(text) # "\"}";
    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/json" },
    ];

    try {
      let response = await OutCall.httpPostRequest(url, headers, body, transform);
      // Extract language from JSON response
      // Response shape: {"data":{"detections":[[{"language":"...","confidence":...}]]}}
      switch (extractJsonStringField(response, "language")) {
        case (?lang) { lang };
        case null { "en" };
      };
    } catch (_) {
      "en";
    };
  };

  /// Extract the value of a JSON string field by key using simple text search.
  /// Handles: "key":"value" and "key": "value"
  private func extractJsonStringField(json : Text, field : Text) : ?Text {
    let needle = "\"" # field # "\":\"";
    let needleWithSpace = "\"" # field # "\": \"";
    let startOpt = switch (findSubstring(json, needle)) {
      case (?pos) { ?(pos + needle.size()) };
      case null {
        switch (findSubstring(json, needleWithSpace)) {
          case (?pos) { ?(pos + needleWithSpace.size()) };
          case null { null };
        };
      };
    };
    switch (startOpt) {
      case null { null };
      case (?start) {
        // Collect chars after the opening quote until closing quote
        var idx = 0;
        var result = "";
        var found = false;
        for (c in json.toIter()) {
          if (not found) {
            if (idx >= start) {
              if (c == '\"') {
                found := true;
              } else {
                result #= Text.fromChar(c);
              };
            };
            idx += 1;
          };
        };
        if (result == "" and not found) { null } else { ?result };
      };
    };
  };

  /// Find the byte-offset of the first occurrence of needle in haystack.
  private func findSubstring(haystack : Text, needle : Text) : ?Nat {
    let hSize = haystack.size();
    let nSize = needle.size();
    if (nSize == 0) { return ?0 };
    if (nSize > hSize) { return null };

    let hChars = haystack.toArray();
    let nChars = needle.toArray();

    var i = 0;
    while (i + nSize <= hSize) {
      var match = true;
      var j = 0;
      while (j < nSize) {
        if (hChars[i + j] != nChars[j]) {
          match := false;
          j := nSize; // break
        };
        j += 1;
      };
      if (match) { return ?i };
      i += 1;
    };
    null;
  };

  /// Escape special characters for JSON string embedding
  private func escapeJson(text : Text) : Text {
    var result = "";
    for (c in text.toIter()) {
      let escaped : Text = switch (c) {
        case ('\"') { "\\\"" };
        case ('\\') { "\\\\" };
        case ('\n') { "\\n" };
        case ('\r') { "\\r" };
        case ('\t') { "\\t" };
        case (other) { Text.fromChar(other) };
      };
      result #= escaped;
    };
    result;
  };
};
