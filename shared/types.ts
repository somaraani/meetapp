export interface Meeting {
    id: string,
    status: string,
    ownerId: string,
    eta: string,
    details: MeetingDetail,
    participants: MeetingParticipant[]
}

export interface MeetingDetail {
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
    publicData: PublicUserData
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
    meetingID: string,
    userID: string,
    status: string
}

export interface Journey {
    id: string, 
    meetingId: string,
    startLocation: Coordinate,
    eta: string,
    lastUpdated: string,
    locations: Coordinate[],
    path: Coordinate[],
    journeySetting: JourneySetting
}

export interface JourneySetting {
    transitMode?: TransitMode[],
    avoid?: TravelRestriction[]
}

export enum TransitMode {
    bus = "bus",
    subway = "subway",
    train = "train",
    tram = "tram",
    rail = "rail"
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
    id: string,
    userId: string,
    title: string,
    message: string,
    read: boolean
}

export interface DirectionResponse {
    path: Coordinate[],
    eta: string,
    distance: number
}