import { PublicUserData } from "@types";

export interface PublicUserDto {
    id: string,
    email: string,
    publicData: PublicUserData
}
