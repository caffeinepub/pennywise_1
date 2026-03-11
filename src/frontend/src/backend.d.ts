import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ProviderAvailability {
    provider: Principal;
    availableSlots: Array<string>;
}
export type Time = bigint;
export interface Service {
    title: string;
    duration: bigint;
    provider: Principal;
    description: string;
    price: bigint;
}
export interface Message {
    content: string;
    sender: Principal;
    timestamp: Time;
    receiver: Principal;
}
export interface Booking {
    id: string;
    service: string;
    startTime: Time;
    taker: Principal;
    provider: Principal;
    endTime: Time;
    completed: boolean;
    price: bigint;
}
export interface ServiceProvider {
    contactInfo: string;
    name: string;
    ratings: Array<bigint>;
    services: Array<string>;
}
export interface UserProfile {
    userType: Variant_taker_provider_both_none;
    contactInfo: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_taker_provider_both_none {
    taker = "taker",
    provider = "provider",
    both = "both",
    none = "none"
}
export interface backendInterface {
    addDocument(title: string, document: ExternalBlob): Promise<void>;
    addProvider(name: string, contactInfo: string): Promise<void>;
    addRating(provider: Principal, rating: bigint, bookingId: string): Promise<void>;
    addService(title: string, description: string, price: bigint, duration: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeBooking(bookingId: string): Promise<void>;
    findProvidersByService(serviceCategory: string): Promise<Array<string>>;
    getAdminStats(): Promise<{
        totalTakers: bigint;
        totalBookings: bigint;
        totalProviders: bigint;
        totalUsers: bigint;
        totalRevenue: bigint;
    }>;
    getAllBookings(): Promise<Array<[string, Booking]>>;
    getAllServices(): Promise<Array<Service>>;
    getAllUsers(): Promise<Array<[Principal, UserProfile]>>;
    getBookingsForProvider(): Promise<Array<[string, Booking]>>;
    getBookingsForTaker(): Promise<Array<[string, Booking]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMessagesWithUser(user: Principal): Promise<Array<Message>>;
    getProviderAvailabilities(): Promise<Array<ProviderAvailability>>;
    getProviderAvailability(provider: Principal): Promise<Array<string>>;
    getProviders(): Promise<Array<ServiceProvider>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    makeBooking(serviceTitle: string, startTime: Time, endTime: Time): Promise<void>;
    registerTaker(name: string, contactInfo: string, password: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchServicesByKeyword(keyword: string): Promise<Array<Service>>;
    sendMessage(receiver: Principal, content: string): Promise<void>;
    updateAvailability(availableSlots: Array<string>): Promise<void>;
}
