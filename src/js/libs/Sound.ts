// Sound.ts
class Sound {
    private _decodedSounds: Record<string, Phaser.Sound.BaseSound>;
    private _soundVolume: number;
    private _musicVolume: number;
    private _songName: string | null;
    private _game: Phaser.Scene | null;

    private static instance: Sound;

    private constructor() {
        this._decodedSounds = {};
        this._soundVolume = 1;
        this._musicVolume = 1;
        this._songName = null;
        this._game = null;
    }

    public static getInstance(): Sound {
        if (!Sound.instance) {
            Sound.instance = new Sound();
        }
        return Sound.instance;
    }

    public setContext(context: Phaser.Scene): void {
        this._game = context;
    }

    public decode(soundStringArray: string[], gameReference: Phaser.Scene): void {
        if (!soundStringArray) {
            console.warn("No sounds to decode");
            return;
        }

        this._game = gameReference;
        console.log("Decoding Sounds...");
        for (let indexSound = 0; indexSound < soundStringArray.length; indexSound++) {
            const currentSoundData = soundStringArray[indexSound];
            if (this._game?.cache?.audio.get(currentSoundData)) {
                const currentLoadedAudio = this._game?.sound?.add(currentSoundData);
                if (currentLoadedAudio) {
                    this._decodedSounds[currentSoundData] = currentLoadedAudio;
                }
            } else {
                console.warn(`${currentSoundData} audio did not load correctly`);
            }
        }
    }

    public pause(soundId: string, active: boolean): void {
        if (this._decodedSounds[soundId]) {
            active ? this._decodedSounds[soundId].pause() : this._decodedSounds[soundId].resume();
        } else {
            console.warn(`[Sound] Not found Sound: ${soundId}`);
        }
    }

    public play(soundId: string, params: Phaser.Types.Sound.SoundConfig = {}): void {
        params.volume = params.volume ?? (params.loop ? this._musicVolume : this._soundVolume);

        if (this._decodedSounds[soundId]) {
            this._decodedSounds[soundId].play(params);
        } else {
            console.warn(`[Sound] Not found Sound: ${soundId}`);
        }

    }

    public playSong(soundId: string, params: Phaser.Types.Sound.SoundConfig = {}): void {
        if (this._songName) {
            this.stop(this._songName);
        }

        params.loop = true;

        if (this._decodedSounds[soundId]) {
            this._songName = soundId;
            this.play(this._songName, params);
        }
    }

    public pauseSong(active: boolean): void {
        if (this._songName) {
            this.pause(this._songName, active);
        }
    }

    public stop(soundId: string): void {
        if (this._decodedSounds[soundId]) {
            this._decodedSounds[soundId].stop();
        }
    }

    public stopSong(): void {
        if (this._songName) {
            this.stop(this._songName);
        }
    }

}

export default Sound.getInstance();
