import Debug "mo:core/Debug";
import Types "../types/user-profile";
import CoreTypes "../types/core";
import Map "mo:core/Map";
import List "mo:core/List";

module {

  public func getUserProfile(
    userProfiles : Map.Map<Types.UserId, Types.UserProfile>,
    userId : Types.UserId,
  ) : ?Types.UserProfile {
    Debug.todo();
  };

  public func upsertUserProfile(
    userProfiles : Map.Map<Types.UserId, Types.UserProfile>,
    userId : Types.UserId,
    updates : Types.UserProfileUpdate,
    now : Types.Timestamp,
  ) : Types.UserProfile {
    Debug.todo();
  };

  public func recordActivity(
    userActivities : Map.Map<Nat, Types.UserActivity>,
    nextActivityId : { var value : Nat },
    userId : Types.UserId,
    action : Text,
    description : Text,
    now : Types.Timestamp,
  ) : () {
    Debug.todo();
  };

  public func getUserActivity(
    userActivities : Map.Map<Nat, Types.UserActivity>,
    userId : Types.UserId,
    limit : Nat,
  ) : [Types.UserActivity] {
    Debug.todo();
  };

  public func saveRequest(
    savedRequests : Map.Map<Types.UserId, [Types.RequestId]>,
    userId : Types.UserId,
    requestId : Types.RequestId,
  ) : Bool {
    Debug.todo();
  };

  public func getSavedRequests(
    savedRequests : Map.Map<Types.UserId, [Types.RequestId]>,
    requests : List.List<CoreTypes.ResourceRequest>,
    userId : Types.UserId,
  ) : [CoreTypes.ResourceRequest] {
    Debug.todo();
  };

  public func getRecentVolunteers(
    volunteers : List.List<CoreTypes.Volunteer>,
    limit : Nat,
  ) : [CoreTypes.Volunteer] {
    Debug.todo();
  };
};
