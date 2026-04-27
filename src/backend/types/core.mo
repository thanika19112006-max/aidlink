import Common "common";

module {
  public type NgoId = Common.NgoId;
  public type VolunteerId = Common.VolunteerId;
  public type RequestId = Common.RequestId;
  public type AssignmentId = Common.AssignmentId;
  public type Timestamp = Common.Timestamp;

  public type NGO = {
    id : NgoId;
    name : Text;
    description : Text;
    lat : Float;
    lng : Float;
    contactEmail : Text;
    isVerified : Bool;
    createdAt : Timestamp;
  };

  public type Volunteer = {
    id : VolunteerId;
    name : Text;
    skills : [Text];
    lat : Float;
    lng : Float;
    isAvailable : Bool;
    completedTasks : Nat;
    rating : Float;
  };

  public type ResourceType = {
    #food;
    #shelter;
    #medical;
    #education;
    #other;
  };

  public type Urgency = {
    #low;
    #medium;
    #high;
    #critical;
  };

  public type RequestStatus = {
    #pending;
    #ongoing;
    #completed;
  };

  public type ResourceRequest = {
    id : RequestId;
    ngoId : NgoId;
    title : Text;
    description : Text;
    resourceType : ResourceType;
    urgency : Urgency;
    status : RequestStatus;
    lat : Float;
    lng : Float;
    quantity : Nat;
    deadline : Timestamp;
    assignedVolunteers : [VolunteerId];
    createdAt : Timestamp;
  };

  public type AssignmentStatus = {
    #active;
    #completed;
    #cancelled;
  };

  public type Assignment = {
    id : AssignmentId;
    requestId : RequestId;
    volunteerId : VolunteerId;
    acceptedAt : Timestamp;
    completedAt : ?Timestamp;
    status : AssignmentStatus;
  };

  public type ChatRole = {
    #user;
    #assistant;
  };

  public type ChatMessage = {
    role : ChatRole;
    content : Text;
    timestamp : Timestamp;
  };

  // Input types for creating records (no id/createdAt — those are generated)
  public type CreateNGOInput = {
    name : Text;
    description : Text;
    lat : Float;
    lng : Float;
    contactEmail : Text;
  };

  public type CreateVolunteerInput = {
    name : Text;
    skills : [Text];
    lat : Float;
    lng : Float;
  };

  public type CreateRequestInput = {
    ngoId : NgoId;
    title : Text;
    description : Text;
    resourceType : ResourceType;
    urgency : Urgency;
    lat : Float;
    lng : Float;
    quantity : Nat;
    deadline : Timestamp;
  };
};
