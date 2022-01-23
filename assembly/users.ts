import { context, u128, PersistentVector, PersistentMap } from "near-sdk-as";

@nearBindgen
export class UserInterface {
    nickName: string;
    accountId: string;
    followings: Set<string>
    followers: Set<string>
    website: string;
    displayPicture: string;
    socialMedia: Array<string>;
    joined: u64;

    constructor(id: string, nick: string) {
        this.accountId = id;
        this.nickName = nick;
    }
}

export class User {
    nickName: string;
    accountId: string;
    followings: Set<string>
    followers: Set<string>
    website: string;
    displayPicture: string;
    socialMedia: Array<string>;
    private accountCreated: u64;

    constructor(id: string, nick: string) {
        this.accountId = id;
        this.nickName = nick;
        this.accountCreated = context.blockTimestamp;
        this.website = "";
        this.followers = new Set<string>();
        this.followings = new Set<string>();
        this.socialMedia = new Array<string>();
        this.displayPicture = "";
    }

    updateUser(user: User): void {
        this.nickName = user.nickName;
        this.website = user.website;
        this.socialMedia = user.socialMedia;
        this.displayPicture = user.displayPicture
    }

    getUser(): UserInterface {
        let payload = new UserInterface(
            this.nickName,
            this.accountId,
        )

        payload.socialMedia = this.socialMedia;
        payload.displayPicture = this.displayPicture;
        payload.website = this.website;
        payload.joined = this.accountCreated;
        payload.followers = this.followers;
        payload.followings = this.followings;


        return payload;
    }
}


export const userMap = new PersistentMap<string, User>("usersStorage200");
