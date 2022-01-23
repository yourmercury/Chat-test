import { context } from 'near-sdk-core';
import { PostedMessage, messageMap, MessageObject } from './model';
import { userMap, User, UserInterface } from './users';

// const MESSAGE_LIMIT = 10;
// export function addMessage(text: string): void {
//   const message = new PostedMessage(text);
//   messages.push(message);
// }

// export function getMessages(): PostedMessage[] {
//   const numMessages = min(MESSAGE_LIMIT, messages.length);
//   const startIndex = messages.length - numMessages;
//   const result = new Array<PostedMessage>(numMessages);
//   for (let i = 0; i < numMessages; i++) {
//     result[i] = messages[i + startIndex];
//   }
//   return result;
// }


export function getMessagesFrom(user: string, length: i32): MessageObject[] | null {
  return messageMap.getMessages(user, length);
}

export function getMessageById(accountId: string, messageId: string): MessageObject | null {
  return messageMap.getMessageById(accountId, messageId);
}

export function sendMessage(message: string, id: string): void {
  messageMap.addMessage(message, id);
}

export function likeUnlike(user: string, id: string): void {
  messageMap.likeUnlike(user, id);
}

export function deleteMessage(accountId: string, messageId: string): void {
  messageMap.deleteMessage(accountId, messageId);
}




export function createUsers(accoundId: string, nick: string): void {
  let hasAccount = userMap.contains(context.sender);
  if (hasAccount) {
    return;
  }

  let user = new User(accoundId, nick);
  userMap.set(context.sender, user);
}

export function follow(accountId: string): void {
  let hasAccount = userMap.contains(accountId);
  assert(hasAccount, "Account does not exist");

  hasAccount = userMap.contains(context.sender);
  assert(hasAccount, "You have not account. Create one");

  let user = userMap.get(accountId);
  let sender = userMap.get(context.sender);

  if (user && sender) {
    user.followers.add(context.sender);
    sender.followings.add(accountId);
  }
}

export function unFollow(accountId: string): void {
  let hasAccount = userMap.contains(accountId);
  assert(hasAccount, "Account does not exist");

  hasAccount = userMap.contains(context.sender);
  assert(hasAccount, "You have not account. Create one");

  let user = userMap.get(accountId);
  let sender = userMap.get(context.sender);

  if (user && sender) {
    user.followers.delete(context.sender);
    sender.followings.delete(accountId);
  }
}

export function getUser(accountId: string): UserInterface | null {
  let user = userMap.get(accountId);

  if (user) {
    return user.getUser();
  } else {
    return null;
  }
  
}


// ["sendMessage", "likeUnlike", "deleteMessage", "createUsers", "follow", "unFollow",]
// ["getMessagesFrom", "getMessageById", "getUser"]