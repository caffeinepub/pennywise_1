import type { Principal } from "@dfinity/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Booking,
  Message,
  Service,
  ServiceProvider,
  UserProfile,
} from "../backend";
import { Variant_taker_provider_both_none } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useRegisterProvider() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      contactInfo,
    }: { name: string; contactInfo: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addProvider(name, contactInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useRegisterTaker() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      contactInfo,
      password,
    }: { name: string; contactInfo: string; password: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.registerTaker(name, contactInfo, password);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useGetAllServices() {
  const { actor, isFetching } = useActor();

  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      price,
      duration,
    }: {
      title: string;
      description: string;
      price: bigint;
      duration: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addService(title, description, price, duration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useSearchServices() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (keyword: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.searchServicesByKeyword(keyword);
    },
  });
}

export function useGetProviders() {
  const { actor, isFetching } = useActor();

  return useQuery<ServiceProvider[]>({
    queryKey: ["providers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProviders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProviderAvailability(
  providerPrincipal: Principal | null,
) {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ["availability", providerPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !providerPrincipal) return [];
      return actor.getProviderAvailability(providerPrincipal);
    },
    enabled: !!actor && !isFetching && !!providerPrincipal,
  });
}

export function useUpdateAvailability() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (availableSlots: string[]) => {
      if (!actor) throw new Error("Actor not available");
      await actor.updateAvailability(availableSlots);
    },
    onSuccess: () => {
      if (identity) {
        queryClient.invalidateQueries({
          queryKey: ["availability", identity.getPrincipal().toString()],
        });
      }
    },
  });
}

export function useMakeBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      serviceTitle,
      startTime,
      endTime,
    }: { serviceTitle: string; startTime: bigint; endTime: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.makeBooking(serviceTitle, startTime, endTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useCompleteBooking() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      if (!actor) throw new Error("Actor not available");
      await actor.completeBooking(bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      receiver,
      content,
    }: { receiver: Principal; content: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.sendMessage(receiver, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

export function useGetMessagesWithUser(userPrincipal: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ["messages", userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      return actor.getMessagesWithUser(userPrincipal);
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
  });
}

export function useAddRating() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      provider,
      rating,
      bookingId,
    }: { provider: Principal; rating: bigint; bookingId: string }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.addRating(provider, rating, bookingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
}

export function useGetBookingsForProvider() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, Booking]>>({
    queryKey: ["bookings", "provider"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookingsForProvider();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookingsForTaker() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, Booking]>>({
    queryKey: ["bookings", "taker"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookingsForTaker();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdminStats() {
  const { actor, isFetching } = useActor();

  return useQuery<{
    totalTakers: bigint;
    totalBookings: bigint;
    totalProviders: bigint;
    totalUsers: bigint;
    totalRevenue: bigint;
  }>({
    queryKey: ["adminStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAdminStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[Principal, UserProfile]>>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, Booking]>>({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}
