export interface Meeting {
    id: string,
    status: MeetingStatus,
    ownerId: string,
    eta: string,
    details: MeetingDetail,
    participants: MeetingParticipant[]
}

export enum MeetingStatus {
    ACTIVE = "active",
    PENDING = "pending",
    WAITING = "waiting",
    COMPLETE = "complete"
}

export interface MeetingDetail {
    name: string,
    description: string,
    time: string,
    location: Coordinate,
    tolerance: number
}

export interface MeetingParticipant {
    userId: string,
    journeyId: string
}

export interface User {
    id: string,
    email: string,
    expoPushToken?: string,
    publicData: PublicUserData,
    privateData: PrivateUserData
}

export interface PublicUserData {
    username: string,
    displayName: string,
    displayPicture: string
}

export interface PrivateUserData {
    password: string
}

export interface Invitation {
    id: string,
    meetingId: string,
    userId: string,
    status: string
}

export interface Journey {
    id: string, 
    status: JourneyStatus
    userId: string,
    meetingId: string,
    travelTime: number,
    eta: string,
    lastUpdated: string,
    locations: Coordinate[],
    path: Coordinate[],
    settings: JourneySetting
}

export enum JourneyStatus {
    PENDING = "pending", 
    ACTIVE = "active", 
    COMPLETE = "complete"
}

export interface JourneySetting {
    startLocation: Coordinate,
    travelMode?: TravelMode,
    avoid?: TravelRestriction[]
}

export enum TravelMode {
    driving = "driving",
    walking = "walking",
    bicycling = "bicycling",
    transit = "transit"
}

export enum TravelRestriction {
    tolls = "tolls",
    highways = "highways",
}

export interface Coordinate {
    lng: number,
    lat: number
}

export interface Notification {
    id?: string,
    userId: string,
    link?: string,
    data? : any,
    title: string,
    body: string,
    read?: boolean
}

export interface DirectionResponse {
    path: Coordinate[],
    eta: string,
    distance: number
}

export enum SocketEvents{
    NOTIFICATION = 'NOTIFICATION',
    LOCATION = 'LOCATION',
}
