export interface Meeting {
    id: string,
    status: string,
    meetingDetails: MeetingDetail,
    meetingParticipants: MeetingParticipant[]
}

export interface MeetingDetail {
    description: string,
    ownerId: string,
    originalEta: string,
    currentEta: string,
    meetingLocation: Coordinate,   
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
    invitationID: string,
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
    transitType: string,
    tolls: boolean
}

export interface Coordinate {
    long: number,
    lat: number
}

export interface Notification {
    notificationId: string,
    userId: string,
    title: string,
    message: string
}