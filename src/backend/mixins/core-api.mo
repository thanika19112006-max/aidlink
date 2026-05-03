import Types "../types/core";
import CoreLib "../lib/core";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import OutCall "mo:caffeineai-http-outcalls/outcall";

mixin (
  ngos : List.List<Types.NGO>,
  volunteers : List.List<Types.Volunteer>,
  requests : List.List<Types.ResourceRequest>,
  assignments : List.List<Types.Assignment>,
  nextNgoId : { var value : Nat },
  nextVolunteerId : { var value : Nat },
  nextRequestId : { var value : Nat },
  nextAssignmentId : { var value : Nat },
  geminiApiKey : { var value : Text },
  ngoEmailIndex : Map.Map<Text, Types.NgoId>,
  volunteerNameIndex : Map.Map<Text, Types.VolunteerId>,
) {

  // ── Query: requests ────────────────────────────────────────────────────────

  public query func getAllRequests() : async [Types.ResourceRequest] {
    CoreLib.getAllRequests(requests);
  };

  public query func getRequestsByNgo(ngoId : Types.NgoId) : async [Types.ResourceRequest] {
    CoreLib.getRequestsByNgo(requests, ngoId);
  };

  public query func getNearbyRequests(lat : Float, lng : Float, radiusKm : Float) : async [Types.ResourceRequest] {
    CoreLib.getNearbyRequests(requests, lat, lng, radiusKm);
  };

  // ── Query: volunteers ──────────────────────────────────────────────────────

  public query func getAvailableVolunteers() : async [Types.Volunteer] {
    CoreLib.getAvailableVolunteers(volunteers);
  };

  // ── Query: NGOs ────────────────────────────────────────────────────────────

  public query func getAllNGOs() : async [Types.NGO] {
    ngos.toArray();
  };

  public query func getAllVolunteers() : async [Types.Volunteer] {
    volunteers.toArray();
  };

  public query func getAllAssignments() : async [Types.Assignment] {
    assignments.toArray();
  };

  // ── Update: requests ───────────────────────────────────────────────────────

  public shared func createRequest(input : Types.CreateRequestInput) : async Types.ResourceRequest {
    let id = nextRequestId.value;
    nextRequestId.value += 1;
    CoreLib.createRequest(requests, id, input, Time.now());
  };

  public shared func updateRequestStatus(requestId : Types.RequestId, status : Types.RequestStatus) : async Bool {
    CoreLib.updateRequestStatus(requests, requestId, status);
  };

  public shared func assignVolunteer(requestId : Types.RequestId, volunteerId : Types.VolunteerId) : async ?Types.Assignment {
    let id = nextAssignmentId.value;
    nextAssignmentId.value += 1;
    CoreLib.createAssignment(assignments, requests, id, requestId, volunteerId, Time.now());
  };

  // ── Update: registration ───────────────────────────────────────────────────

  public shared func registerNGO(input : Types.CreateNGOInput) : async Types.NGO {
    // Duplicate email check
    if (ngoEmailIndex.containsKey(input.contactEmail)) {
      Runtime.trap("An NGO with this email address is already registered: " # input.contactEmail);
    };
    let id = nextNgoId.value;
    nextNgoId.value += 1;
    let ngo = CoreLib.createNGO(ngos, id, input, Time.now());
    ngoEmailIndex.add(input.contactEmail, id);
    ngo;
  };

  public shared func registerVolunteer(input : Types.CreateVolunteerInput) : async Types.Volunteer {
    // Duplicate name check (volunteers have no email — guard by name)
    if (volunteerNameIndex.containsKey(input.name)) {
      Runtime.trap("A volunteer with this name is already registered: " # input.name);
    };
    let id = nextVolunteerId.value;
    nextVolunteerId.value += 1;
    let volunteer = CoreLib.createVolunteer(volunteers, id, input, Time.now());
    volunteerNameIndex.add(input.name, id);
    volunteer;
  };

  // ── AI chatbot ─────────────────────────────────────────────────────────────

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared func sendChatMessage(messages : [Types.ChatMessage]) : async Text {
    let systemPrompt = "You are AidLink AI, a knowledgeable humanitarian aid advisor and intelligent assistant for the AidLink platform — a smart resource allocation system connecting NGOs, volunteers, and critical resources during crises and everyday operations. Your expertise covers: resource allocation and logistics optimisation, matching volunteers to aid requests based on skills and proximity, tracking and managing aid requests from creation to resolution, NGO coordination and inter-agency collaboration, emergency response planning and disaster relief operations, volunteer onboarding, training guidance, and engagement, real-time field reporting and status updates, and impact measurement and reporting for donors and stakeholders. You help NGO coordinators streamline operations, reduce response times, and maximise impact. You support volunteers in finding the right opportunities, understanding their assignments, and staying safe in the field. Always be empathetic, professional, action-oriented, and focused on maximising humanitarian impact. Provide concise, practical answers with clear next steps when appropriate.";

    // Build the messages JSON array
    var messagesJson = "[{\"role\":\"user\",\"parts\":[{\"text\":\"" # escapeJson(systemPrompt) # "\"}]},{\"role\":\"model\",\"parts\":[{\"text\":\"Understood. I am AidLink AI, ready to help with resource allocation and humanitarian coordination.\"}]}";

    for (msg in messages.vals()) {
      let role = switch (msg.role) {
        case (#user) { "user" };
        case (#assistant) { "model" };
      };
      messagesJson #= ",{\"role\":\"" # role # "\",\"parts\":[{\"text\":\"" # escapeJson(msg.content) # "\"}]}";
    };
    messagesJson #= "]";

    let body = "{\"contents\":" # messagesJson # ",\"generationConfig\":{\"temperature\":0.7,\"maxOutputTokens\":1024}}";

    let apiKey = geminiApiKey.value;
    let url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" # apiKey;

    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/json" },
    ];

    let responseText = await OutCall.httpPostRequest(url, headers, body, transform);
    responseText;
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
