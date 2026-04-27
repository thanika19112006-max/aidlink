import Types "../types/core";
import List "mo:core/List";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Time "mo:core/Time";

module {
  // ── Geo helpers ────────────────────────────────────────────────────────────

  /// Haversine distance in kilometres between two lat/lng points.
  public func haversineKm(
    lat1 : Float,
    lng1 : Float,
    lat2 : Float,
    lng2 : Float,
  ) : Float {
    let r : Float = 6371.0;
    let dLat = (lat2 - lat1) * Float.pi / 180.0;
    let dLng = (lng2 - lng1) * Float.pi / 180.0;
    let sinDlat = Float.sin(dLat / 2.0);
    let sinDlng = Float.sin(dLng / 2.0);
    let cosLat1 = Float.cos(lat1 * Float.pi / 180.0);
    let cosLat2 = Float.cos(lat2 * Float.pi / 180.0);
    let a = sinDlat * sinDlat + cosLat1 * cosLat2 * sinDlng * sinDlng;
    let c = 2.0 * Float.arctan2(Float.sqrt(a), Float.sqrt(1.0 - a));
    r * c;
  };

  // ── NGO helpers ────────────────────────────────────────────────────────────

  public func createNGO(
    ngos : List.List<Types.NGO>,
    nextId : Nat,
    input : Types.CreateNGOInput,
    now : Types.Timestamp,
  ) : Types.NGO {
    let ngo : Types.NGO = {
      id = nextId;
      name = input.name;
      description = input.description;
      lat = input.lat;
      lng = input.lng;
      contactEmail = input.contactEmail;
      isVerified = false;
      createdAt = now;
    };
    ngos.add(ngo);
    ngo;
  };

  public func getNGOById(
    ngos : List.List<Types.NGO>,
    id : Types.NgoId,
  ) : ?Types.NGO {
    ngos.find(func(n) { n.id == id });
  };

  // ── Volunteer helpers ──────────────────────────────────────────────────────

  public func createVolunteer(
    volunteers : List.List<Types.Volunteer>,
    nextId : Nat,
    input : Types.CreateVolunteerInput,
    now : Types.Timestamp,
  ) : Types.Volunteer {
    let v : Types.Volunteer = {
      id = nextId;
      name = input.name;
      skills = input.skills;
      lat = input.lat;
      lng = input.lng;
      isAvailable = true;
      completedTasks = 0;
      rating = 5.0;
    };
    volunteers.add(v);
    v;
  };

  public func getAvailableVolunteers(
    volunteers : List.List<Types.Volunteer>,
  ) : [Types.Volunteer] {
    volunteers.filter(func(v) { v.isAvailable }).toArray();
  };

  public func getNearbyVolunteers(
    volunteers : List.List<Types.Volunteer>,
    lat : Float,
    lng : Float,
    radiusKm : Float,
  ) : [Types.Volunteer] {
    volunteers.filter(func(v) {
      haversineKm(lat, lng, v.lat, v.lng) <= radiusKm
    }).toArray();
  };

  // ── Request helpers ────────────────────────────────────────────────────────

  public func createRequest(
    requests : List.List<Types.ResourceRequest>,
    nextId : Nat,
    input : Types.CreateRequestInput,
    now : Types.Timestamp,
  ) : Types.ResourceRequest {
    let req : Types.ResourceRequest = {
      id = nextId;
      ngoId = input.ngoId;
      title = input.title;
      description = input.description;
      resourceType = input.resourceType;
      urgency = input.urgency;
      status = #pending;
      lat = input.lat;
      lng = input.lng;
      quantity = input.quantity;
      deadline = input.deadline;
      assignedVolunteers = [];
      createdAt = now;
    };
    requests.add(req);
    req;
  };

  public func getAllRequests(
    requests : List.List<Types.ResourceRequest>,
  ) : [Types.ResourceRequest] {
    requests.toArray();
  };

  public func getRequestsByNgo(
    requests : List.List<Types.ResourceRequest>,
    ngoId : Types.NgoId,
  ) : [Types.ResourceRequest] {
    requests.filter(func(r) { r.ngoId == ngoId }).toArray();
  };

  public func getNearbyRequests(
    requests : List.List<Types.ResourceRequest>,
    lat : Float,
    lng : Float,
    radiusKm : Float,
  ) : [Types.ResourceRequest] {
    requests.filter(func(r) {
      haversineKm(lat, lng, r.lat, r.lng) <= radiusKm
    }).toArray();
  };

  public func updateRequestStatus(
    requests : List.List<Types.ResourceRequest>,
    requestId : Types.RequestId,
    status : Types.RequestStatus,
  ) : Bool {
    var found = false;
    requests.mapInPlace(func(r) {
      if (r.id == requestId) {
        found := true;
        { r with status = status };
      } else { r };
    });
    found;
  };

  // ── Assignment helpers ─────────────────────────────────────────────────────

  public func createAssignment(
    assignments : List.List<Types.Assignment>,
    requests : List.List<Types.ResourceRequest>,
    nextId : Nat,
    requestId : Types.RequestId,
    volunteerId : Types.VolunteerId,
    now : Types.Timestamp,
  ) : ?Types.Assignment {
    // Ensure the request exists
    switch (requests.find(func(r) { r.id == requestId })) {
      case null { null };
      case (?_req) {
        let assignment : Types.Assignment = {
          id = nextId;
          requestId = requestId;
          volunteerId = volunteerId;
          acceptedAt = now;
          completedAt = null;
          status = #active;
        };
        assignments.add(assignment);
        // Update request to include the volunteer and set to ongoing
        requests.mapInPlace(func(r) {
          if (r.id == requestId) {
            {
              r with
              assignedVolunteers = r.assignedVolunteers.concat([volunteerId]);
              status = #ongoing;
            };
          } else { r };
        });
        ?assignment;
      };
    };
  };

  // ── Seed data ──────────────────────────────────────────────────────────────

  public func seedNGOs() : [Types.NGO] {
    let now = Time.now();
    [
      {
        id = 1;
        name = "Global Relief Foundation";
        description = "Providing emergency relief and sustainable development support worldwide.";
        lat = 40.7128;
        lng = -74.006;
        contactEmail = "contact@globalrelief.org";
        isVerified = true;
        createdAt = now;
      },
      {
        id = 2;
        name = "HungerFree Alliance";
        description = "Dedicated to eliminating food insecurity through community-based programs.";
        lat = 34.0522;
        lng = -118.2437;
        contactEmail = "info@hungerfree.org";
        isVerified = true;
        createdAt = now;
      },
      {
        id = 3;
        name = "MedReach International";
        description = "Delivering medical care and healthcare access to underserved populations.";
        lat = 51.5074;
        lng = -0.1278;
        contactEmail = "ops@medreach.int";
        isVerified = true;
        createdAt = now;
      },
      {
        id = 4;
        name = "ShelterNow";
        description = "Rapid-response housing and shelter solutions for disaster-affected communities.";
        lat = 48.8566;
        lng = 2.3522;
        contactEmail = "help@shelternow.org";
        isVerified = false;
        createdAt = now;
      },
      {
        id = 5;
        name = "EduBridge";
        description = "Connecting children in conflict zones to quality educational resources.";
        lat = 35.6762;
        lng = 139.6503;
        contactEmail = "team@edubridge.org";
        isVerified = true;
        createdAt = now;
      },
    ];
  };

  public func seedVolunteers() : [Types.Volunteer] {
    [
      {
        id = 1;
        name = "Amara Osei";
        skills = ["first aid", "logistics", "translation"];
        lat = 40.73;
        lng = -74.0;
        isAvailable = true;
        completedTasks = 14;
        rating = 4.9;
      },
      {
        id = 2;
        name = "Lena Fischer";
        skills = ["medical", "emergency response", "counselling"];
        lat = 40.71;
        lng = -74.01;
        isAvailable = true;
        completedTasks = 22;
        rating = 5.0;
      },
      {
        id = 3;
        name = "Carlos Mendez";
        skills = ["construction", "shelter", "carpentry"];
        lat = 34.06;
        lng = -118.25;
        isAvailable = false;
        completedTasks = 8;
        rating = 4.7;
      },
      {
        id = 4;
        name = "Priya Nair";
        skills = ["education", "child welfare", "social work"];
        lat = 34.05;
        lng = -118.24;
        isAvailable = true;
        completedTasks = 31;
        rating = 4.8;
      },
      {
        id = 5;
        name = "James Okafor";
        skills = ["food distribution", "logistics", "driving"];
        lat = 51.51;
        lng = -0.13;
        isAvailable = true;
        completedTasks = 19;
        rating = 4.6;
      },
      {
        id = 6;
        name = "Yuki Tanaka";
        skills = ["translation", "IT support", "data management"];
        lat = 35.68;
        lng = 139.65;
        isAvailable = true;
        completedTasks = 7;
        rating = 4.5;
      },
      {
        id = 7;
        name = "Sofia Bellini";
        skills = ["nursing", "first aid", "hygiene training"];
        lat = 48.86;
        lng = 2.35;
        isAvailable = false;
        completedTasks = 26;
        rating = 4.9;
      },
      {
        id = 8;
        name = "Marcus Webb";
        skills = ["water sanitation", "engineering", "project management"];
        lat = 40.72;
        lng = -73.99;
        isAvailable = true;
        completedTasks = 11;
        rating = 4.7;
      },
      {
        id = 9;
        name = "Fatima Al-Rashid";
        skills = ["psychosocial support", "social work", "Arabic"];
        lat = 51.52;
        lng = -0.12;
        isAvailable = true;
        completedTasks = 18;
        rating = 4.8;
      },
      {
        id = 10;
        name = "Diego Rivera";
        skills = ["food preparation", "nutrition", "community outreach"];
        lat = 34.07;
        lng = -118.26;
        isAvailable = true;
        completedTasks = 4;
        rating = 4.4;
      },
      {
        id = 11;
        name = "Nadia Kowalski";
        skills = ["legal aid", "documentation", "advocacy"];
        lat = 48.87;
        lng = 2.34;
        isAvailable = true;
        completedTasks = 9;
        rating = 4.6;
      },
    ];
  };

  public func seedRequests() : [Types.ResourceRequest] {
    let now = Time.now();
    let week : Int = 7 * 24 * 60 * 60 * 1_000_000_000;
    [
      {
        id = 1;
        ngoId = 1;
        title = "Emergency Food Supplies – NYC East District";
        description = "500 families displaced by flooding need immediate food aid.";
        resourceType = #food;
        urgency = #critical;
        status = #ongoing;
        lat = 40.715;
        lng = -73.995;
        quantity = 500;
        deadline = now + week;
        assignedVolunteers = [1, 2];
        createdAt = now;
      },
      {
        id = 2;
        ngoId = 2;
        title = "Weekly Food Drive – LA South";
        description = "Regular food distribution for low-income households.";
        resourceType = #food;
        urgency = #medium;
        status = #pending;
        lat = 34.045;
        lng = -118.255;
        quantity = 200;
        deadline = now + 2 * week;
        assignedVolunteers = [];
        createdAt = now;
      },
      {
        id = 3;
        ngoId = 3;
        title = "Mobile Clinic – East London";
        description = "Provide basic medical screening and medication for 300 patients.";
        resourceType = #medical;
        urgency = #high;
        status = #pending;
        lat = 51.515;
        lng = -0.055;
        quantity = 300;
        deadline = now + week;
        assignedVolunteers = [];
        createdAt = now;
      },
      {
        id = 4;
        ngoId = 4;
        title = "Temporary Shelter Setup – Paris Suburb";
        description = "Erect 50 temporary shelters for a migrant camp.";
        resourceType = #shelter;
        urgency = #critical;
        status = #ongoing;
        lat = 48.862;
        lng = 2.367;
        quantity = 50;
        deadline = now + 3 * week;
        assignedVolunteers = [7];
        createdAt = now;
      },
      {
        id = 5;
        ngoId = 5;
        title = "School Supplies for Refugee Children – Tokyo";
        description = "Notebooks, pencils and basic supplies for 120 children.";
        resourceType = #education;
        urgency = #medium;
        status = #completed;
        lat = 35.674;
        lng = 139.648;
        quantity = 120;
        deadline = now - week;
        assignedVolunteers = [6];
        createdAt = now - 2 * week;
      },
      {
        id = 6;
        ngoId = 1;
        title = "Clean Water Distribution – Brooklyn";
        description = "Distribute 10,000 litres of clean water after contamination alert.";
        resourceType = #other;
        urgency = #critical;
        status = #pending;
        lat = 40.678;
        lng = -73.944;
        quantity = 10000;
        deadline = now + week / 2;
        assignedVolunteers = [];
        createdAt = now;
      },
      {
        id = 7;
        ngoId = 2;
        title = "Nutrition Programme – LA West";
        description = "Provide balanced meal kits to 80 elderly residents.";
        resourceType = #food;
        urgency = #low;
        status = #completed;
        lat = 34.062;
        lng = -118.298;
        quantity = 80;
        deadline = now - 2 * week;
        assignedVolunteers = [3, 10];
        createdAt = now - 4 * week;
      },
      {
        id = 8;
        ngoId = 3;
        title = "Vaccinations Drive – Central London";
        description = "Administer flu vaccines to 400 vulnerable adults.";
        resourceType = #medical;
        urgency = #high;
        status = #ongoing;
        lat = 51.5074;
        lng = -0.1278;
        quantity = 400;
        deadline = now + week;
        assignedVolunteers = [5, 9];
        createdAt = now;
      },
      {
        id = 9;
        ngoId = 4;
        title = "Winter Clothing Distribution – Paris Centre";
        description = "Warm jackets and blankets for 200 homeless individuals.";
        resourceType = #shelter;
        urgency = #high;
        status = #pending;
        lat = 48.857;
        lng = 2.352;
        quantity = 200;
        deadline = now + week;
        assignedVolunteers = [];
        createdAt = now;
      },
      {
        id = 10;
        ngoId = 5;
        title = "Online Tutoring – Japanese Refugees";
        description = "Virtual tutoring sessions for 40 refugee students.";
        resourceType = #education;
        urgency = #low;
        status = #pending;
        lat = 35.676;
        lng = 139.65;
        quantity = 40;
        deadline = now + 3 * week;
        assignedVolunteers = [];
        createdAt = now;
      },
      {
        id = 11;
        ngoId = 1;
        title = "Hygiene Kits – Bronx";
        description = "Distribute hygiene kits to 350 displaced families.";
        resourceType = #other;
        urgency = #medium;
        status = #ongoing;
        lat = 40.844;
        lng = -73.865;
        quantity = 350;
        deadline = now + week;
        assignedVolunteers = [8];
        createdAt = now;
      },
      {
        id = 12;
        ngoId = 2;
        title = "Community Kitchen – Compton";
        description = "Staff a community kitchen serving 150 hot meals daily.";
        resourceType = #food;
        urgency = #medium;
        status = #completed;
        lat = 33.896;
        lng = -118.22;
        quantity = 150;
        deadline = now - week;
        assignedVolunteers = [4, 10];
        createdAt = now - 3 * week;
      },
      {
        id = 13;
        ngoId = 3;
        title = "Mental Health Support – London";
        description = "Trauma counselling sessions for 60 conflict-affected adults.";
        resourceType = #medical;
        urgency = #high;
        status = #pending;
        lat = 51.499;
        lng = -0.135;
        quantity = 60;
        deadline = now + 2 * week;
        assignedVolunteers = [];
        createdAt = now;
      },
      {
        id = 14;
        ngoId = 4;
        title = "Emergency Tent Procurement – Paris";
        description = "Source and deploy 30 emergency tents within 48 hours.";
        resourceType = #shelter;
        urgency = #critical;
        status = #pending;
        lat = 48.87;
        lng = 2.34;
        quantity = 30;
        deadline = now + week / 3;
        assignedVolunteers = [];
        createdAt = now;
      },
      {
        id = 15;
        ngoId = 5;
        title = "STEM Workshops – Tokyo Youth";
        description = "Deliver 10 STEM workshops for 80 underprivileged children.";
        resourceType = #education;
        urgency = #low;
        status = #ongoing;
        lat = 35.679;
        lng = 139.653;
        quantity = 80;
        deadline = now + 2 * week;
        assignedVolunteers = [6, 11];
        createdAt = now;
      },
    ];
  };
};
