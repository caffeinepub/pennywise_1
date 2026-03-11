import Text "mo:core/Text";
import List "mo:core/List";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  public type UserProfile = {
    name : Text;
    contactInfo : Text;
    userType : { #provider; #taker; #both; #none };
  };

  type ServiceProvider = {
    name : Text;
    contactInfo : Text;
    ratings : [Nat];
    services : [Text];
  };

  type TakerProfile = {
    name : Text;
    contactInfo : Text;
    password : Text;
  };

  type Service = {
    provider : Principal;
    title : Text;
    description : Text;
    price : Nat;
    duration : Nat; // in minutes
  };

  type Booking = {
    id : Text;
    taker : Principal;
    service : Text;
    provider : Principal;
    startTime : Time.Time;
    endTime : Time.Time;
    price : Nat;
    completed : Bool;
  };

  type Message = {
    sender : Principal;
    receiver : Principal;
    content : Text;
    timestamp : Time.Time;
  };

  type Availability = {
    provider : Principal;
    availableSlots : [Text];
  };

  type ProviderAvailability = {
    provider : Principal;
    availableSlots : [Text];
  };

  let providers = Map.empty<Principal, ServiceProvider>();
  let takers = Map.empty<Principal, TakerProfile>();
  let services = Map.empty<Text, Service>();
  let bookings = Map.empty<Text, Booking>();
  let messages = List.empty<Message>();
  let availability = Map.empty<Principal, Availability>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Function to get ProviderAvailability records
  public query ({ caller }) func getProviderAvailabilities() : async [ProviderAvailability] {
    availability.values().toArray().map(
      func(availability) {
        { provider = availability.provider; availableSlots = availability.availableSlots };
      }
    );
  };

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Provider functions
  public shared ({ caller }) func addProvider(name : Text, contactInfo : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register as providers");
    };

    let provider : ServiceProvider = {
      name;
      contactInfo;
      ratings = [];
      services = [];
    };
    providers.add(caller, provider);

    // Update user profile
    let currentProfile = userProfiles.get(caller);
    let newUserType = switch (currentProfile) {
      case (?profile) {
        switch (profile.userType) {
          case (#taker) { #both };
          case (_) { #provider };
        };
      };
      case (null) { #provider };
    };

    let updatedProfile : UserProfile = {
      name;
      contactInfo;
      userType = newUserType;
    };
    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func addRating(provider : Principal, rating : Nat, bookingId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add ratings");
    };

    // Verify the caller has a completed booking with this provider
    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        if (booking.taker != caller) {
          Runtime.trap("Unauthorized: You can only rate providers you have booked");
        };
        if (booking.provider != provider) {
          Runtime.trap("Invalid: Booking does not match provider");
        };
        if (not booking.completed) {
          Runtime.trap("Cannot rate: Service not yet completed");
        };
      };
    };

    switch (providers.get(provider)) {
      case (null) { Runtime.trap("Provider not found") };
      case (?providerData) {
        let ratingsList = List.fromArray<Nat>(providerData.ratings);
        ratingsList.add(rating);
        let updatedProvider : ServiceProvider = {
          name = providerData.name;
          contactInfo = providerData.contactInfo;
          ratings = ratingsList.toArray();
          services = providerData.services;
        };
        providers.add(provider, updatedProvider);
      };
    };
  };

  public query ({ caller }) func getProviders() : async [ServiceProvider] {
    // Accessible to all users including guests
    providers.values().toArray();
  };

  public query ({ caller }) func getBookingsForProvider() : async [(Text, Booking)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };

    let providerBookings = List.empty<(Text, Booking)>();
    for ((id, booking) in bookings.entries()) {
      if (booking.provider == caller) {
        providerBookings.add((id, booking));
      };
    };
    providerBookings.toArray();
  };

  // Taker functions
  public shared ({ caller }) func registerTaker(name : Text, contactInfo : Text, password : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register as takers");
    };

    let taker : TakerProfile = { name; contactInfo; password };
    takers.add(caller, taker);

    // Update user profile
    let currentProfile = userProfiles.get(caller);
    let newUserType = switch (currentProfile) {
      case (?profile) {
        switch (profile.userType) {
          case (#provider) { #both };
          case (_) { #taker };
        };
      };
      case (null) { #taker };
    };

    let updatedProfile : UserProfile = {
      name;
      contactInfo;
      userType = newUserType;
    };
    userProfiles.add(caller, updatedProfile);
  };

  public query ({ caller }) func getBookingsForTaker() : async [(Text, Booking)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };

    let takerBookings = List.empty<(Text, Booking)>();
    for ((id, booking) in bookings.entries()) {
      if (booking.taker == caller) {
        takerBookings.add((id, booking));
      };
    };
    takerBookings.toArray();
  };

  // Service management
  public shared ({ caller }) func addService(title : Text, description : Text, price : Nat, duration : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add services");
    };

    switch (providers.get(caller)) {
      case (null) { Runtime.trap("Unauthorized: Only registered providers can add services") };
      case (_) {
        let service : Service = {
          provider = caller;
          title;
          description;
          price;
          duration;
        };
        services.add(title, service);
      };
    };
  };

  public query ({ caller }) func searchServicesByKeyword(keyword : Text) : async [Service] {
    services.values().toArray().filter(
      func(service) {
        service.title.contains(#text keyword) or service.description.contains(#text keyword)
      }
    );
  };

  public query ({ caller }) func getAllServices() : async [Service] {
    // Accessible to all users including guests
    services.values().toArray();
  };

  public shared ({ caller }) func makeBooking(serviceTitle : Text, startTime : Time.Time, endTime : Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can make bookings");
    };

    // Verify caller is a registered taker
    switch (takers.get(caller)) {
      case (null) { Runtime.trap("Unauthorized: Only registered takers can make bookings") };
      case (_) {};
    };

    switch (services.get(serviceTitle)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) {
        let bookingId = serviceTitle # caller.toText() # startTime.toText();
        let booking : Booking = {
          id = bookingId;
          taker = caller;
          service = serviceTitle;
          provider = service.provider;
          startTime = startTime;
          endTime = endTime;
          price = service.price;
          completed = false;
        };
        bookings.add(bookingId, booking);
      };
    };
  };

  public query ({ caller }) func getProviderAvailability(provider : Principal) : async [Text] {
    // Accessible to all users including guests
    switch (availability.get(provider)) {
      case (null) { [] };
      case (?available) { available.availableSlots };
    };
  };

  public shared ({ caller }) func updateAvailability(availableSlots : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update availability");
    };

    // Verify caller is a registered provider
    switch (providers.get(caller)) {
      case (null) { Runtime.trap("Unauthorized: Only registered providers can update availability") };
      case (_) {
        let newAvailability : Availability = { provider = caller; availableSlots };
        availability.add(caller, newAvailability);
      };
    };
  };

  public shared ({ caller }) func sendMessage(receiver : Principal, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    // Verify both sender and receiver are registered users
    let senderExists = providers.containsKey(caller) or takers.containsKey(caller);
    let receiverExists = providers.containsKey(receiver) or takers.containsKey(receiver);

    if (not senderExists) {
      Runtime.trap("Unauthorized: You must be registered as a provider or taker to send messages");
    };
    if (not receiverExists) {
      Runtime.trap("Invalid: Receiver must be a registered user");
    };

    let message : Message = {
      sender = caller;
      receiver;
      content;
      timestamp = Time.now();
    };
    messages.add(message);
  };

  public query ({ caller }) func getMessagesWithUser(user : Principal) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    let userMessages = List.empty<Message>();
    for (message in messages.values()) {
      if ((message.sender == caller and message.receiver == user) or
          (message.sender == user and message.receiver == caller)) {
        userMessages.add(message);
      };
    };
    userMessages.toArray();
  };

  public shared ({ caller }) func addDocument(title : Text, document : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add documents");
    };

    // Verify caller is a registered provider (assuming documents are for providers)
    switch (providers.get(caller)) {
      case (null) { Runtime.trap("Unauthorized: Only registered providers can add documents") };
      case (_) {
        let documents = Map.empty<Text, Storage.ExternalBlob>();
        documents.add(title, document);
      };
    };
  };

  public query ({ caller }) func findProvidersByService(serviceCategory : Text) : async [Text] {
    // Accessible to all users including guests
    let providersWithService = List.empty<Text>();

    for ((_, service) in services.entries()) {
      if (service.title.contains(#text serviceCategory)) {
        providersWithService.add(service.title);
      };
    };

    providersWithService.toArray();
  };

  public shared ({ caller }) func completeBooking(bookingId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete bookings");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        // Only the provider can mark a booking as completed
        if (booking.provider != caller) {
          Runtime.trap("Unauthorized: Only the service provider can complete this booking");
        };

        let updatedBooking : Booking = {
          id = booking.id;
          taker = booking.taker;
          service = booking.service;
          provider = booking.provider;
          startTime = booking.startTime;
          endTime = booking.endTime;
          price = booking.price;
          completed = true;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  // Additional admin functions
  public query ({ caller }) func getAdminStats() : async {
    totalUsers : Nat;
    totalProviders : Nat;
    totalTakers : Nat;
    totalBookings : Nat;
    totalRevenue : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access admin stats");
    };

    var totalRevenue = 0;
    for ((_, booking) in bookings.entries()) {
      totalRevenue += booking.price;
    };

    {
      totalUsers = userProfiles.size();
      totalProviders = providers.size();
      totalTakers = takers.size();
      totalBookings = bookings.size();
      totalRevenue;
    };
  };

  public query ({ caller }) func getAllUsers() : async [(Principal, UserProfile)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access all users");
    };

    let usersList = List.empty<(Principal, UserProfile)>();
    for ((principal, profile) in userProfiles.entries()) {
      usersList.add((principal, profile));
    };
    usersList.toArray();
  };

  public query ({ caller }) func getAllBookings() : async [(Text, Booking)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access all bookings");
    };

    let bookingsList = List.empty<(Text, Booking)>();
    for ((id, booking) in bookings.entries()) {
      bookingsList.add((id, booking));
    };
    bookingsList.toArray();
  };
};
