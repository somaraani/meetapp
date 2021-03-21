export interface Meeting {
    id: string,
    status: string,
    ownerId: string,
    eta: string,
    details: MeetingDetail,
    participants: MeetingParticipant[]
}

export interface MeetingDetail {
    name: string,
    description: string,
    time: string,
    location: Coordinate,   
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
    userId: string,
    meetingId: string,
    travelTime: number,
    lastUpdated: string,
    locations: Coordinate[],
    path: Coordinate[],
    settings: JourneySetting
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
    INVITATION = 'INVITATION',
    LOCATION = 'LOCATION',
    MEMBERUPDATE = 'MEMBERUPDATE',
    JOIN = 'JOIN',
    LEAVE = 'LEAVE',
}

export interface PublicUserResponse {
    id: string,
    publicData: PublicUserData
}