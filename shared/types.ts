export interface User {
    _id: string,
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