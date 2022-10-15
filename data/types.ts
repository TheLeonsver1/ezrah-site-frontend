import { type } from "os";

export type Bill = {
    id: number,
    knsBillId: number,
    knessetNum?: number
    name: string,
    officialLawSummary?: string,
    publicationDate?: string,
    knsLastUpdatedDate?: string;
    governmentalNumber?: number;
    privateNumber?: number;
    billInitiators?: [BillInitiator]
}

export type BillInitiator = {
    id: number,
    bill?: Bill,
    person: Person,
    isInitiator?: boolean,
    ordinal?: number
}

export type Person = {
    id: number,
    firstName: string,
    lastName: string,
    email?: string,
    billsInitiated?: [BillInitiator],
    positionHistory?: [PersonPosition],
}

export type PersonPosition = {
    id?: number,
    person?: Person,
    position?: Position,
    knessetNum: number
    startDate: string,
    finishDate: string,
}

export type Position = {
    id: number,
}

export type UserPost = {
    id: number,
    latestContentVersion: string,
    postCreator: User,
    createdDate: string,
    lastModifiedDate: string,
}

export type User = {
    id: number,
    username: string,
}

export type ItemType = {

}

export type LoggedInUserProp = {
    loggedInUser: LoggedInUser
}

export type LoggedInUser = AuthenticatedUser | AnonymousUser;

export function isAuthenticatedUser(loggedInUserDetails: LoggedInUser): loggedInUserDetails is AuthenticatedUser {
    return (loggedInUserDetails as AuthenticatedUser).userId !== undefined;
}

type AuthenticatedUser = {
    isLoggedIn: true;
    userId: number;
    userName: string;
}

type AnonymousUser = {
    isLoggedIn: false;
}

export const DEFAULT_LOGGED_IN_USER_PROPS: LoggedInUserProp = {
    loggedInUser: {
        isLoggedIn: false
    }
}