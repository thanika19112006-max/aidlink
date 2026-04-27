import Types "types/core";
import CoreApi "mixins/core-api";
import MapsTranslationApi "mixins/maps-translation-api";
import CoreLib "lib/core";
import List "mo:core/List";

actor {
  // ── Counters ───────────────────────────────────────────────────────────────
  let nextNgoId = { var value : Nat = 6 };        // seeds use IDs 1-5
  let nextVolunteerId = { var value : Nat = 12 };  // seeds use IDs 1-11
  let nextRequestId = { var value : Nat = 16 };    // seeds use IDs 1-15
  let nextAssignmentId = { var value : Nat = 1 };

  // ── Gemini API key (configurable post-deployment) ─────────────────────────
  let geminiApiKey = { var value : Text = "" };

  // ── Maps and Translation API keys (configurable post-deployment) ──────────
  let googleMapsApiKey = { var value : Text = "" };
  let googleCloudTranslationApiKey = { var value : Text = "" };

  // ── Collections (seeded on first deployment) ──────────────────────────────
  let ngos : List.List<Types.NGO> = List.fromArray(CoreLib.seedNGOs());
  let volunteers : List.List<Types.Volunteer> = List.fromArray(CoreLib.seedVolunteers());
  let requests : List.List<Types.ResourceRequest> = List.fromArray(CoreLib.seedRequests());
  let assignments = List.empty<Types.Assignment>();

  // ── Compose mixins ─────────────────────────────────────────────────────────
  include CoreApi(
    ngos,
    volunteers,
    requests,
    assignments,
    nextNgoId,
    nextVolunteerId,
    nextRequestId,
    nextAssignmentId,
    geminiApiKey,
  );

  include MapsTranslationApi(
    googleMapsApiKey,
    googleCloudTranslationApiKey,
  );

  // ── Admin: update Gemini API key ──────────────────────────────────────────
  public shared func setGeminiApiKey(key : Text) : async () {
    geminiApiKey.value := key;
  };
};
