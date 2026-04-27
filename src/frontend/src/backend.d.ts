import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ResourceRequest {
    id: RequestId;
    lat: number;
    lng: number;
    status: RequestStatus;
    title: string;
    urgency: Urgency;
    assignedVolunteers: Array<VolunteerId>;
    createdAt: Timestamp;
    description: string;
    deadline: Timestamp;
    resourceType: ResourceType;
    ngoId: NgoId;
    quantity: bigint;
}
export interface CreateNGOInput {
    lat: number;
    lng: number;
    name: string;
    description: string;
    contactEmail: string;
}
export type NgoId = bigint;
export type VolunteerId = bigint;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CreateVolunteerInput {
    lat: number;
    lng: number;
    name: string;
    skills: Array<string>;
}
export interface CreateRequestInput {
    lat: number;
    lng: number;
    title: string;
    urgency: Urgency;
    description: string;
    deadline: Timestamp;
    resourceType: ResourceType;
    ngoId: NgoId;
    quantity: bigint;
}
export interface ChatMessage {
    content: string;
    role: ChatRole;
    timestamp: Timestamp;
}
export type AssignmentId = bigint;
export interface Volunteer {
    id: VolunteerId;
    lat: number;
    lng: number;
    completedTasks: bigint;
    name: string;
    isAvailable: boolean;
    rating: number;
    skills: Array<string>;
}
export type RequestId = bigint;
export interface NGO {
    id: NgoId;
    lat: number;
    lng: number;
    name: string;
    createdAt: Timestamp;
    description: string;
    isVerified: boolean;
    contactEmail: string;
}
export interface Assignment {
    id: AssignmentId;
    status: AssignmentStatus;
    completedAt?: Timestamp;
    requestId: RequestId;
    volunteerId: VolunteerId;
    acceptedAt: Timestamp;
}
export enum AssignmentStatus {
    active = "active",
    cancelled = "cancelled",
    completed = "completed"
}
export enum ChatRole {
    user = "user",
    assistant = "assistant"
}
export enum RequestStatus {
    pending = "pending",
    completed = "completed",
    ongoing = "ongoing"
}
export enum ResourceType {
    other = "other",
    food = "food",
    education = "education",
    shelter = "shelter",
    medical = "medical"
}
export enum Urgency {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export interface backendInterface {
    assignVolunteer(requestId: RequestId, volunteerId: VolunteerId): Promise<Assignment | null>;
    createRequest(input: CreateRequestInput): Promise<ResourceRequest>;
    detectLanguage(text: string): Promise<string>;
    getAllAssignments(): Promise<Array<Assignment>>;
    getAllNGOs(): Promise<Array<NGO>>;
    getAllRequests(): Promise<Array<ResourceRequest>>;
    getAllVolunteers(): Promise<Array<Volunteer>>;
    getAvailableVolunteers(): Promise<Array<Volunteer>>;
    getMapApiKey(): Promise<string>;
    getNearbyRequests(lat: number, lng: number, radiusKm: number): Promise<Array<ResourceRequest>>;
    getRequestsByNgo(ngoId: NgoId): Promise<Array<ResourceRequest>>;
    registerNGO(input: CreateNGOInput): Promise<NGO>;
    registerVolunteer(input: CreateVolunteerInput): Promise<Volunteer>;
    sendChatMessage(messages: Array<ChatMessage>): Promise<string>;
    setGeminiApiKey(key: string): Promise<void>;
    setGoogleCloudTranslationApiKey(key: string): Promise<void>;
    setGoogleMapsApiKey(key: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    transformTranslation(input: TransformationInput): Promise<TransformationOutput>;
    translateText(text: string, targetLang: string): Promise<string>;
    updateRequestStatus(requestId: RequestId, status: RequestStatus): Promise<boolean>;
}
