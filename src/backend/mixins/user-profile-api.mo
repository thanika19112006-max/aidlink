import Debug "mo:core/Debug";
import Types "../types/user-profile";
import CoreTypes "../types/core";
import UserProfileLib "../lib/user-profile";
import Map "mo:core/Map";
import List "mo:core/List";

mixin (
  userProfiles : Map.Map<Types.UserId, Types.UserProfile>,
  userActivities : Map.Map<Nat, Types.UserActivity>,
  savedRequests : Map.Map<Types.UserId, [Types.RequestId]>,
  nextActivityId : { var value : Nat },
  volunteers : List.List<CoreTypes.Volunteer>,
  requests : List.List<CoreTypes.ResourceRequest>,
) {

  // ── Query: user profile ────────────────────────────────────────────────────

  public query func getUserProfile(userId : Text) : async ?Types.UserProfile {
    Debug.todo();
  };

  // ── Update: user profile ───────────────────────────────────────────────────

  public shared func updateUserProfile(updates : Types.UserProfileUpdate) : async Types.UserProfile {
    Debug.todo();
  };

  // ── Query: activity ────────────────────────────────────────────────────────

  public query func getUserActivity(userId : Text, limit : Nat) : async [Types.UserActivity] {
    Debug.todo();
  };

  // ── Update: saved requests ─────────────────────────────────────────────────

  public shared func saveRequest(userId : Text, requestId : Types.RequestId) : async Bool {
    Debug.todo();
  };

  // ── Query: saved requests ──────────────────────────────────────────────────

  public query func getSavedRequests(userId : Text) : async [CoreTypes.ResourceRequest] {
    Debug.todo();
  };

  // ── Query: recent volunteers ───────────────────────────────────────────────

  public query func getRecentVolunteers(limit : Nat) : async [CoreTypes.Volunteer] {
    Debug.todo();
  };
};
