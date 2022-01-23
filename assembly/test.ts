import { context, u128, PersistentVector, PersistentMap, } from "near-sdk-as";


export class MessageObject {

    constructor(
        public message: string,
        public id: string,
        public likes: Array<string>,
        public createdAt: u64,
        public sender: string,
    ) {

    }
}

export class PostedMessage {
    premium: boolean;
    sender: string;
    constructor(public text: string) {
        this.premium = context.attachedDeposit >= u128.from('10000000000000000000000');
        this.sender = context.sender;
    }
}
/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */

// @nearBindgen
export class Users {
    _userMap: PersistentMap<string, string>;
    _messageMap: PersistentMap<string, Array<MessageObject>>;
    _id: string;

    constructor() {
        this._userMap = new PersistentMap<string, string>("user_messages");
        this._messageMap = new PersistentMap<string, Array<MessageObject>>("message_map3");
        this._id = "";
    }

    sayHello(): string {
        return "hello"
    }

    _getUsername(name: string | null): string | null {
        let username: string | null;

        if (name) {
            username = this._userMap.contains(name) ? this._userMap.get(name) : null;
        } else {
            username = this._userMap.contains(context.sender) ? this._userMap.get(context.sender) : null;
        }

        return username;
    }

    _setUsername(username: string | null): void {
        if (username) {
            this._userMap.set(context.sender, (username));
        }
        this._userMap.set(context.sender, (context.sender));
    }

    _addMessage(message: string): void {
        let messageVec = this._messageMap.get(context.sender);
        if (!messageVec) {
            messageVec = [];
        }

        let messageObj: MessageObject = new MessageObject(
            message,
            "0",
            new Array<string>(),
            context.blockTimestamp,
            context.sender
        )

        messageVec.push(messageObj);
        this._messageMap.set(context.sender, messageVec);
    }

    _getMessages(account_id: string, limit: i32): MessageObject[] {
        let messageVec: Array<MessageObject> | null = this._messageMap.get(context.sender);
        if (!messageVec || messageVec.length == 0) {
            messageVec = [];
        }

        let lim = limit != 0 ? min(limit, messageVec.length) : messageVec.length;
        let startIndex = messageVec.length - lim;
        let messages = new Array<MessageObject>(lim);

        for (let i = 0; i < lim; i++) {
            messages[i] = messageVec[i + startIndex];
        }

        return messages;
    }

    _getMessageByID(id: string, user?: string): MessageObject | null {
        let messageVec: Array<MessageObject> | null;

        if (user) {
            messageVec = this._messageMap.get(user);
        } else {
            messageVec = this._messageMap.get(context.sender);
        }

        if (!messageVec || messageVec.length == 0) {
            return null;
        }

        let arr: MessageObject | null = null;

        for (let i = 0; i < messageVec.length; i++) {
            if (messageVec[i].id == id) {
                arr = messageVec[i];
                break;
            }
        }

        return arr;
    }

    _likeUnlikePost(id: string, user: string | null = null): void {
        let messageVec: Array<MessageObject> | null;

        if (user) {
            messageVec = this._messageMap.get(user);
        } else {
            messageVec = this._messageMap.get(context.sender);
        }

        if (!messageVec || messageVec.length == 0) {
            return;
        }

        else {
            for (let i = 0; i < messageVec.length; i++) {
                if (messageVec[i].id == id) {
                    let index = messageVec[i].likes.indexOf(id);
                    if (index != -1) {
                        messageVec[i].likes.splice(index, 1);
                    } else {
                        messageVec[i].likes.push(id);
                    }
                }
            }
        }
    }

    // likeUnlikePost(user: string, id: string): void {
    //     let messageVec = this.messageMap.get(user);

    //     let obj: MessageObject;

    //     if (!messageVec || messageVec.length == 0) {
    //         return;
    //     }

    //     else {
    //         for (let i = 0; i < messageVec.length; i++) {
    //             if (messageVec[i].id == id) {
    //                 obj = messageVec[i]
    //                 let index = messageVec[i].likes.indexOf(context.sender);
    //                 if (index != -1) {
    //                     obj.likes.splice(index, 1);
    //                 } else {
    //                     obj.likes.push(context.sender);
    //                 }
    //                 messageVec[i] = obj
    //                 this.messageMap.set(user, messageVec);
    //                 break;
    //             }
    //         }
    //     }
    // }

}