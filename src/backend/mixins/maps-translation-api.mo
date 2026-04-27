import MapsTranslationLib "../lib/maps-translation";
import OutCall "mo:caffeineai-http-outcalls/outcall";

mixin (
  googleMapsApiKey : { var value : Text },
  googleCloudTranslationApiKey : { var value : Text },
) {

  // ── HTTP transform (required by outcall library) ───────────────────────────

  public query func transformTranslation(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // ── Admin: store Google Maps API key ───────────────────────────────────────

  /// Stores the Google Maps JavaScript API key for frontend use.
  public shared func setGoogleMapsApiKey(key : Text) : async () {
    googleMapsApiKey.value := key;
  };

  // ── Admin: store Google Cloud Translation API key ─────────────────────────

  /// Stores the Google Cloud Translation API key for backend HTTP outcalls.
  public shared func setGoogleCloudTranslationApiKey(key : Text) : async () {
    googleCloudTranslationApiKey.value := key;
  };

  // ── Query: expose Maps API key for frontend script loading ────────────────

  /// Returns the stored Google Maps API key so the frontend can load the
  /// Google Maps JS API. This is the only safe pattern since Google Maps JS
  /// requires frontend loading.
  public query func getMapApiKey() : async Text {
    googleMapsApiKey.value;
  };

  // ── Update: translation ────────────────────────────────────────────────────

  /// Translates text into the given target language code (e.g. "ta", "hi", "en").
  /// Calls Google Cloud Translation REST API via HTTP outcall.
  /// Falls back to returning the original text on any error.
  public shared func translateText(text : Text, targetLang : Text) : async Text {
    await MapsTranslationLib.translateText(
      googleCloudTranslationApiKey.value,
      text,
      targetLang,
      transformTranslation,
    );
  };

  /// Detects the language of the given text.
  /// Calls Google Cloud Translation detect endpoint via HTTP outcall.
  /// Falls back to "en" on any error.
  public shared func detectLanguage(text : Text) : async Text {
    await MapsTranslationLib.detectLanguage(
      googleCloudTranslationApiKey.value,
      text,
      transformTranslation,
    );
  };
};
