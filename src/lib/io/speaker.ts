const replaces = {
    '*quack*': '',
}

export class SpeakerQueue {

    private messages: string[] = [];

    private muted: boolean;

    private voice: SpeechSynthesisVoice;

    constructor(name: string, lang: string) {
        this.voice = window.speechSynthesis.getVoices().find((v) => {
            return v.name == name && v.lang == lang;
        });
    }

    pushMessage(message: string) {
        let cleanMessage = message;
        Object.entries(replaces).forEach((msg) => {
            const [from, replaced] = msg;
            cleanMessage = cleanMessage.replace(from, replaced);
        });

        // Only if not speaking now, speak this message.
        if (!window.speechSynthesis.speaking) {
            this.speakNext();
        }
    }

    speakNext() {
        if (this.messages.length === 0) {
            return;
        }
        const message = this.messages.pop();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.voice = this.voice;
        utterance.addEventListener('end', () => {
            this.speakNext();
        });
        window.speechSynthesis.speak(utterance);
    }

}