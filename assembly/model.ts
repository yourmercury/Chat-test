import { context, u128, PersistentVector, PersistentMap } from "near-sdk-as";


@nearBindgen
export class MessageObject {

  constructor(
    public message: string,
    public id: string,
    public likes: Set<string>,
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


export class Messages {
  messageMap: PersistentMap<string, Array<MessageObject>>;
  constructor() {
    this.messageMap = new PersistentMap<string, Array<MessageObject>>("dessage-100");
  }

  addMessage(message: string, id: string): void {
    let messages = this.messageMap.get(context.sender);
    if (!messages) {
      messages = new Array<MessageObject>();
    }

    let obj = new MessageObject(
      message,
      id,
      new Set<string>(),
      context.blockTimestamp,
      context.sender,
    );

    messages.push(obj);

    this.messageMap.set(context.sender, messages);
  }

  getMessages(account_id: string, length: i32): MessageObject[] | null {
    let messages = this.messageMap.get(account_id);
    let comp: i32 = 0;
    if (!messages || messages.length < 1) {
      messages = new Array<MessageObject>();
    }
    let lim = length != comp ? min(length, messages.length) : messages.length;
    let index = messages.length - lim;
    let result: MessageObject[] = [];
    for (let i = 0; i < lim; i++) {
      result[i] = messages[i + index];
    }

    return result;
  }

  getMessageById(accountId: string, messageId: string): MessageObject | null {
    let messages = this.messageMap.get(accountId);
    let message: MessageObject | null = null;
    if (messages) {
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].id = messageId) {
          message = messages[i];
          break;
        }
      }
      return message;
    } else {
      return message;
    }
  }

  deleteMessage(accountId: string, messageId: string): void {
    let messages = this.messageMap.get(accountId);
    if (messages) {
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].id = messageId) {
          messages.splice(i, 1);
          break;
        }
      }
    }
  }

  likeUnlike(accountId: string, messageId: string): void {
    let messages = this.messageMap.get(accountId);
    let obj: MessageObject;
    if (!messages || messages.length == 0) {
      return;
    }

    else {
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].id == messageId) {
          obj = messages[i];
          obj.likes.delete(context.sender) || obj.likes.add(context.sender);
          messages[i] = obj;
          this.messageMap.set(accountId, messages);
          break;
        }
      }
    }
  }

}


// export const messages = new PersistentVector<PostedMessage>("m");
export const messageMap: Messages = new Messages();