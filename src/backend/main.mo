import Types "types/core";
import CoreApi "mixins/core-api";
import MapsTranslationApi "mixins/maps-translation-api";
import CoreLib "lib/core";
import List "mo:core/List";
import Map "mo:core/Map";

actor {
  // ── Counters (persist across upgrades via enhanced orthogonal persistence) ─
  let nextNgoId = { var value : Nat = 1 };
  let nextVolunteerId = { var value : Nat = 1 };
  let nextRequestId = { var value : Nat = 1 };
  let nextAssignmentId = { var value : Nat = 1 };

  // ── Gemini API key (configurable post-deployment) ─────────────────────────
  let geminiApiKey = { var value : Text = "" };

  // ── Maps and Translation API keys (configurable post-deployment) ──────────
  let googleMapsApiKey = { var value : Text = "" };
  let googleCloudTranslationApiKey = { var value : Text = "" };

  // ── Collections (empty on first install; seeded lazily via initSeedData) ──
  let ngos = List.empty<Types.NGO>();
  let volunteers = List.empty<Types.Volunteer>();
  let requests = List.empty<Types.ResourceRequest>();
  let assignments = List.empty<Types.Assignment>();

  // ── Email indexes for duplicate detection ─────────────────────────────────
  let ngoEmailIndex = Map.empty<Text, Types.NgoId>();
  let volunteerNameIndex = Map.empty<Text, Types.VolunteerId>();

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
    ngoEmailIndex,
    volunteerNameIndex,
  );

  include MapsTranslationApi(
    googleMapsApiKey,
    googleCloudTranslationApiKey,
  );

  // ── Admin: update Gemini API key ──────────────────────────────────────────
  public shared func setGeminiApiKey(key : Text) : async () {
    geminiApiKey.value := key;
  };

  // ── Seed data on first install (idempotent — skipped if data exists) ───────
  public shared func initSeedData() : async () {
    if (ngos.isEmpty()) {
      let seedNgos = CoreLib.seedNGOs();
      for (ngo in seedNgos.vals()) {
        ngos.add(ngo);
        ngoEmailIndex.add(ngo.contactEmail, ngo.id);
        if (ngo.id >= nextNgoId.value) {
          nextNgoId.value := ngo.id + 1;
        };
      };
    };
    if (volunteers.isEmpty()) {
      let seedVols = CoreLib.seedVolunteers();
      for (vol in seedVols.vals()) {
        volunteers.add(vol);
        volunteerNameIndex.add(vol.name, vol.id);
        if (vol.id >= nextVolunteerId.value) {
          nextVolunteerId.value := vol.id + 1;
        };
      };
    };
    if (requests.isEmpty()) {
      let seedReqs = CoreLib.seedRequests();
      for (req in seedReqs.vals()) {
        requests.add(req);
        if (req.id >= nextRequestId.value) {
          nextRequestId.value := req.id + 1;
        };
      };
    };
  };
};
