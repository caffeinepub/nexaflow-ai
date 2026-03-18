import Principal "mo:core/Principal";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat "mo:core/Nat";

actor {
  type Submission = { name : Text; email : Text; message : Text };
  type Admin = { principal : Principal; email : Text };
  type Service = { id : Nat; title : Text; description : Text; icon : Text; colorKey : Text };
  type Testimonial = { id : Nat; quote : Text; name : Text; title : Text; company : Text; initials : Text; colorKey : Text };

  module Admin {
    public func compare(admin1 : Admin, admin2 : Admin) : Order.Order {
      Text.compare(admin1.email, admin2.email);
    };
  };

  let submissions = List.empty<Submission>();
  let admins = Map.empty<Principal, Admin>();
  let services = Map.empty<Nat, Service>();
  let testimonials = Map.empty<Nat, Testimonial>();
  var nextServiceId : Nat = 1;
  var nextTestimonialId : Nat = 1;

  func requireAdmin(caller : Principal) {
    if (not admins.containsKey(caller)) {
      Runtime.trap("Unauthorized: caller is not an admin.");
    };
  };

  // --- Admin management ---
  public shared ({ caller }) func addAdmin(email : Text) : async () {
    if (admins.containsKey(caller)) { Runtime.trap("Principal is already an admin.") };
    let newAdmin : Admin = { principal = caller; email };
    admins.add(caller, newAdmin);
  };

  public query ({ caller }) func isAdmin() : async Bool {
    admins.containsKey(caller);
  };

  public shared ({ caller }) func updateAdminEmail(newEmail : Text) : async () {
    switch (admins.get(caller)) {
      case (null) { Runtime.trap("Principal is not an admin.") };
      case (?admin) {
        let updatedAdmin : Admin = { admin with email = newEmail };
        admins.add(caller, updatedAdmin);
      };
    };
  };

  public shared ({ caller }) func removeAdmin() : async () {
    switch (admins.containsKey(caller)) {
      case (true) { admins.remove(caller) };
      case (false) { Runtime.trap("Principal is not an admin.") };
    };
  };

  public query ({ caller }) func getAllAdmins() : async [Admin] {
    admins.values().toArray().sort();
  };

  // --- Contact form submissions ---
  public shared ({ caller }) func submitForm(name : Text, email : Text, message : Text) : async () {
    let submission : Submission = { name; email; message };
    submissions.add(submission);
  };

  public query ({ caller }) func getAllSubmissions() : async [Submission] {
    submissions.values().toArray();
  };

  public shared ({ caller }) func deleteSubmission(index : Nat) : async Bool {
    requireAdmin(caller);
    let arr = submissions.values().toArray();
    if (index >= arr.size()) { return false };
    submissions.clear();
    var i = 0;
    for (s in arr.vals()) {
      if (i != index) { submissions.add(s) };
      i += 1;
    };
    true;
  };

  // --- Services ---
  public shared ({ caller }) func addService(title : Text, description : Text, icon : Text, colorKey : Text) : async Nat {
    requireAdmin(caller);
    let id = nextServiceId;
    nextServiceId += 1;
    let svc : Service = { id; title; description; icon; colorKey };
    services.add(id, svc);
    id;
  };

  public shared ({ caller }) func updateService(id : Nat, title : Text, description : Text, icon : Text, colorKey : Text) : async Bool {
    requireAdmin(caller);
    switch (services.get(id)) {
      case (null) { false };
      case (?_) {
        let svc : Service = { id; title; description; icon; colorKey };
        services.add(id, svc);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteService(id : Nat) : async Bool {
    requireAdmin(caller);
    if (services.containsKey(id)) {
      services.remove(id);
      true;
    } else {
      false;
    };
  };

  public query func getServices() : async [Service] {
    services.values().toArray();
  };

  // --- Testimonials ---
  public shared ({ caller }) func addTestimonial(quote : Text, name : Text, title : Text, company : Text, initials : Text, colorKey : Text) : async Nat {
    requireAdmin(caller);
    let id = nextTestimonialId;
    nextTestimonialId += 1;
    let t : Testimonial = { id; quote; name; title; company; initials; colorKey };
    testimonials.add(id, t);
    id;
  };

  public shared ({ caller }) func updateTestimonial(id : Nat, quote : Text, name : Text, title : Text, company : Text, initials : Text, colorKey : Text) : async Bool {
    requireAdmin(caller);
    switch (testimonials.get(id)) {
      case (null) { false };
      case (?_) {
        let t : Testimonial = { id; quote; name; title; company; initials; colorKey };
        testimonials.add(id, t);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteTestimonial(id : Nat) : async Bool {
    requireAdmin(caller);
    if (testimonials.containsKey(id)) {
      testimonials.remove(id);
      true;
    } else {
      false;
    };
  };

  public query func getTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };
};
