export default class SceneLoader {
    private _errorFiles: number;
    private _game: Phaser.Scene;

    constructor(context: Phaser.Scene) {
        this._errorFiles = 0;
        this._game = context;
    }

    gotError(): number {
        return this._errorFiles;
    }

    createNewLoader(callbacks: {
        onStart?: () => void;
        onLoadFile?: (progress: { progress: number }) => void;
        onComplete?: () => void;
        } = {}): Phaser.Loader.LoaderPlugin {
        const newLoader = this._game.load;

        newLoader.on('start', () => {
            if (typeof callbacks.onStart === "function") {
                callbacks.onStart();
            }
        });

        newLoader.on('progress', (progress: number) => {
            if (typeof callbacks.onLoadFile === "function") {
                callbacks.onLoadFile({ progress });
            }
        });

        newLoader.on('filecomplete', (file: string, type: string) => {
            // console.log(`${type} ${file} loaded correctly`);
        });

        newLoader.on('loaderror', (file: Phaser.Loader.File) => {
            this._errorFiles++;
            console.log(`${file.type} ${file.key} not loaded correctly`);
        });

        newLoader.on('complete', () => {
            if (typeof callbacks.onComplete === "function") {
                callbacks.onComplete();
            }
        });

        return newLoader;
    }

    preload(currentScene: { assets?: any }, callbacks?: {
        onStart?: () => void;
        onLoadFile?: (progress: { progress: number }) => void;
        onComplete?: () => void;
    }): void {
        const currentLoader = this.createNewLoader(callbacks);

        if (currentScene.assets !== undefined) {
            const assets = currentScene.assets;

            if (Array.isArray(assets.jsons)) {
                for (const currentJson of assets.jsons) {
                    currentLoader.json(currentJson.name, currentJson.file);
                }
            }

            if (Array.isArray(assets.spritesheets)) {
                for (const currentSprite of assets.spritesheets) {
                    if (!this._game.textures.exists(currentSprite.name)) {
                        currentLoader.spritesheet(currentSprite.name, currentSprite.file, {
                            frameWidth: currentSprite.size.x,
                            frameHeight: currentSprite.size.y,
                            endFrame: currentSprite.frames
                        });
                    }
                }
            }

            if (Array.isArray(assets.images)) {
                for (const currentImage of assets.images) {
                    if (!this._game.textures.exists(currentImage.name)) {
                        currentLoader.image(currentImage.name, currentImage.file);
                    }
                }
            }

            if (Array.isArray(assets.sounds)) {
                for (const currentSound of assets.sounds) {
                    if (!this._game.cache.audio.get(currentSound.name)) {
                        currentLoader.audio(currentSound.name, currentSound.file, { instances: 2 });
                    }
                }
            }

            if (Array.isArray(assets.fonts)) {
                for (const currentFont of assets.fonts) {
                    if (!this._game.textures.exists(currentFont.name)) {
                        currentLoader.bitmapFont(currentFont.name, currentFont.image, currentFont.font);
                    }
                }
            }

            const soundFormat = assets.sound_format || '.mp3';
            if (Array.isArray(assets.sounds_list)) {
                for (const currentSound of assets.sounds_list) {
                    if (!this._game.cache.audio.get(currentSound)) {
                        currentLoader.audio(currentSound, `${assets.sounds_location}${currentSound}${soundFormat}`);
                    }
                }
            }

            if (Array.isArray(assets.atlases)) {
                for (const currentAtlas of assets.atlases) {
                    if (!this._game.textures.exists(currentAtlas.name)) {
                        currentLoader.atlas(currentAtlas.name, currentAtlas.image, currentAtlas.json);
                    }
                }
            }
        } else {
            console.warn("Scene with no Assets to preload");
        }

        if (callbacks) {
            this._errorFiles = 0;
            currentLoader.start();
        }
    }
}
