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
    private: PrivateUserData,
    public: PublicUserData
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