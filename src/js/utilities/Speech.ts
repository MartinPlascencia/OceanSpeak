export default class Speech {
    private _synth: SpeechSynthesis;
    private _speechCallback!: Function;
    constructor(speechCallback: Function) {
        this._synth = window.speechSynthesis;
        this._speechCallback = speechCallback;
    }

    public speak(text: string): void {
        const utterThis = new SpeechSynthesisUtterance(text);
        this._synth.speak(utterThis);
    }

    public speechRecognition(): void {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.start();
        recognition.onresult = (event: any) => {
            const speechToText = event.results[0][0].transcript;
            console.log(speechToText);
            this._speechCallback(speechToText);
        };
        recognition.onend = () => {
            this._speechCallback('');
        };

    }
}