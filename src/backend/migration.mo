import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  public type OldUserProfile = {
    name : Text;
    contactInfo : Text;
    userType : { #provider; #taker; #both; #none };
  };

  public type OldServiceProvider = {
    name : Text;
    contactInfo : Text;
    ratings : [Nat];
    services : [Text];
  };

  public type OldTakerProfile = {
    name : Text;
    contactInfo : Text;
    password : Text;
  };

  public type OldService = {
    provider : Principal;
    title : Text;
    description : Text;
    price : Nat;
    duration : Nat; // in minutes
  };

  public type OldBooking = {
    taker : Principal;
    service : Text;
    provider : Principal;
    startTime : Int;
    endTime : Int;
    price : Nat;
    completed : Bool;
  };

  public type OldMessage = {
    sender : Principal;
    receiver : Principal;
    content : Text;
    timestamp : Int;
  };

  public type OldAvailability = {
    provider : Principal;
    availableSlots : [Text];
  };

  public type OldActor = {
    providers : Map.Map<Principal, OldServiceProvider>;
    takers : Map.Map<Principal, OldTakerProfile>;
    services : Map.Map<Text, OldService>;
    bookings : Map.Map<Text, OldBooking>;
    messages : List.List<OldMessage>;
    availability : Map.Map<Principal, OldAvailability>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  public type NewBooking = {
    id : Text;
    taker : Principal;
    service : Text;
    provider : Principal;
    startTime : Int;
    endTime : Int;
    price : Nat;
    completed : Bool;
  };

  public type NewActor = {
    providers : Map.Map<Principal, OldServiceProvider>;
    takers : Map.Map<Principal, OldTakerProfile>;
    services : Map.Map<Text, OldService>;
    bookings : Map.Map<Text, NewBooking>;
    messages : List.List<OldMessage>;
    availability : Map.Map<Principal, OldAvailability>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newBookings = old.bookings.map<Text, OldBooking, NewBooking>(
      func(bookingId, oldBooking) {
        {
          id = bookingId;
          taker = oldBooking.taker;
          service = oldBooking.service;
          provider = oldBooking.provider;
          startTime = oldBooking.startTime;
          endTime = oldBooking.endTime;
          price = oldBooking.price;
          completed = oldBooking.completed;
        };
      }
    );

    {
      old with
      bookings = newBookings;
    };
  };
};
