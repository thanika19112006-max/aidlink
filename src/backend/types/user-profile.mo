import Common "common";

module {
  public type UserId = Text; // Principal.toText()
  public type RequestId = Common.RequestId;
  public type Timestamp = Common.Timestamp;

  public type UserProfile = {
    id : UserId;
    name : Text;
    email : Text;
    phone : Text;
    address : Text;
    profilePhotoUrl : ?Text;
    preferredRole : Text;
    notificationEmail : Bool;
    notificationTaskReminders : Bool;
    notificationRequestUpdates : Bool;
    lastLoginAt : Timestamp;
    createdAt : Timestamp;
  };

  public type UserProfileUpdate = {
    name : ?Text;
    email : ?Text;
    phone : ?Text;
    address : ?Text;
    profilePhotoUrl : ??Text;
    preferredRole : ?Text;
    notificationEmail : ?Bool;
    notificationTaskReminders : ?Bool;
    notificationRequestUpdates : ?Bool;
  };

  public type UserActivity = {
    id : Nat;
    userId : UserId;
    action : Text;
    description : Text;
    timestamp : Timestamp;
  };

  public type SavedRequest = {
    userId : UserId;
    requestId : RequestId;
    savedAt : Timestamp;
  };
};
