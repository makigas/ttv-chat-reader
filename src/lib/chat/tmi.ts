import type { MessagePayload } from "../stores";

export function getEmoteUrl(id: string, style: 'light' | 'dark', scale: '1.0' | '2.0' | '3.0') {
    const template = "https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/default/{{theme_mode}}/{{scale}}";
    return template
        .replace("{{id}}", id)
        .replace("{{theme_mode}}", style)
        .replace("{{scale}}", scale);
}

export type ChatMessageComponent = {
    kind: 'text',
    content: string;
} | {
    kind: 'icon',
    id: string;
}

export function formatMessage(payload: MessagePayload): string {
    const { message, emotes } = payload;
    let formattedMessage = message;
    if (emotes == null) {
        return message;
    }
    Object.entries(emotes).forEach(([id, occurrences]) => {
        const url = getEmoteUrl(id, "dark", "3.0");
        occurrences.forEach((occurrence) => {
            const [start, end] = occurrence.split("-").map((i) => parseInt(i));
            const emote = message.substring(start, end + 1);
            const html = `<img src="${url}" style="height: 1em;">`;
            formattedMessage = formattedMessage.replace(emote, html);
        });
    });
    return formattedMessage;
}