import { writable } from "svelte/store";

type Emote = Record<string, Array<string>>;

export interface MessagePayload {
    /** UUID of the message (mostly useful for deletions). */
    uuid: string;
    /** The user who sent the message. */
    user: string;
    /** The message that was sent. */
    message: string;
    /** The color that the user is using. */
    userColor: string;
    /** Emojis in this message. */
    emotes: Emote;
    /** UNIX timestamp with the message sent at. */
    datetime: number;
}

export interface MessageList {
    /** The list of messages contained here. */
    messages: Array<MessagePayload>;
}

export function newMessagePayload(): MessageList {
    return { messages: [] };
}

export function pushMessagePayload(list: MessageList, payload: MessagePayload) {
    return { ...list, messages: [...list.messages, payload] };
}

export function popMessagePayload(list: MessageList) {
    const [_head, ...tail] = list.messages;
    return { ...list, messages: tail };
}

export function deleteMessagePayload(list: MessageList, uuid: string) {
    const messages = list.messages.filter(msg => msg.uuid != uuid);
    return { ...list, messages };
}

export const messages = writable(newMessagePayload());