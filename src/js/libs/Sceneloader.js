export default class SceneLoader {
	constructor(context) {
	  this.errorFiles = 0;
	  this.game = context;
	}

	gotError(){
		return this.errorFiles
	}

	createNewLoader(callbacks = {}){
		
		const newLoader =  this.game.load;

		newLoader.on('start', () =>{
			if(typeof(callbacks.onStart) === "function"){
				callbacks.onStart();
			}
		})

		newLoader.on('progress',(progress) => {
			if(typeof(callbacks.onLoadFile) === "function"){
				callbacks.onLoadFile({progress:progress});
			}
		})

		newLoader.on('filecomplete', (file,type) => {
			//console.log(type + ' ' + file + ' loaded correctly');
		});

		newLoader.on('loaderror', (file) => {
			this.errorFiles++;
			console.log(file.type + ' ' + file.key + ' not loaded correctly');
		});

		newLoader.on('complete', () => {
			//console.log('loading complete')
			if(typeof(callbacks.onComplete) === "function"){
				callbacks.onComplete();
			}
		})

		return newLoader
	}


	preload(currentScene, callbacks){

		const currentLoader = this.createNewLoader(callbacks)

		if(currentScene.assets !== "undefined"){
			var assets = currentScene.assets

			if(typeof assets.jsons == "object"){
				for(var indexJson = 0; indexJson < assets.jsons.length; indexJson++){
					var currentJson = assets.jsons[indexJson]
					currentLoader.json(currentJson.name, currentJson.file)
				}
			}

			if(typeof assets.spritesheets == "object"){
				for(var indexSprite = 0; indexSprite < assets.spritesheets.length; indexSprite++){
					var currentSprite = assets.spritesheets[indexSprite]
					if(!this.game.textures.exists(currentSprite.name))
						currentLoader.spritesheet(currentSprite.name, currentSprite.file, {frameWidth:currentSprite.size.x, frameHeight:currentSprite.size.y,endFrame:currentSprite.frames})
				}
			}

			if(typeof assets.spines == "object"){
				for(var indexSpine = 0; indexSpine < assets.spines.length; indexSpine++){
					var currentSpine = assets.spines[indexSpine]
					currentLoader.spine(currentSpine.name, currentSpine.json, [currentSpine.atlas], true)
				}
			}

			if(typeof assets.images == "object"){
				for(var indexImage = 0; indexImage < assets.images.length; indexImage++){
					var currentImage = assets.images[indexImage]
					if(!this.game.textures.exists(currentImage.name))
						currentLoader.image(currentImage.name, currentImage.file)
				}
			}
			
			if(typeof assets.sounds == "object"){
				for(var indexSound = 0; indexSound < assets.sounds.length; indexSound++){
					var currentSound = assets.sounds[indexSound]
					if(!this.game.cache.audio.get(currentSound.name))
						currentLoader.audio(currentSound.name, currentSound.file,{instances:2})
				}
			}
			

			if(typeof assets.fonts == "object"){
				for(var indexFont = 0; indexFont < assets.fonts.length; indexFont++){
					var currentFont = assets.fonts[indexFont]
					if(!this.game.textures.exists(currentFont.name))
						currentLoader.bitmapFont(currentFont.name, currentFont.image, currentFont.font)
				}
			}

			let soundFormat = assets.sound_format || '.mp3'
			if(typeof assets.sounds_list == "object"){
				for(var indexSound = 0; indexSound < assets.sounds_list.length; indexSound++){
					var currentSound = assets.sounds_list[indexSound]
					if(!this.game.cache.audio.get(currentSound))
						currentLoader.audio(currentSound, assets.sounds_location + currentSound + soundFormat)
				}
			}

			if(typeof assets.atlases == "object"){
				for(var indexAtlas = 0; indexAtlas < assets.atlases.length; indexAtlas++){
					var currentAtlas = assets.atlases[indexAtlas]
					if(!this.game.textures.exists(currentAtlas.name))
						currentLoader.atlas(currentAtlas.name, currentAtlas.image, currentAtlas.json)
				}
			}

			if(typeof assets.multiatlases == "object"){
				for(var indexMultiAtlas = 0; indexMultiAtlas < assets.multiatlases.length; indexMultiAtlas++){
					var currentMultiAtlas = assets.multiatlases[indexMultiAtlas]
					if(!this.game.textures.exists(currentMultiAtlas.name))
						currentLoader.multiatlas(currentMultiAtlas.name, currentMultiAtlas.file, currentMultiAtlas.path)
				}
			}

			if(typeof assets.plugins == "object"){
				for(var indexPlugin = 0; indexPlugin < assets.plugins.length; indexPlugin++){
					var currentPlugin = assets.plugins[indexPlugin]
					if(!this.game.plugins.isActive(currentPlugin.name))
						currentLoader.plugin(currentPlugin.name, currentPlugin.file, true);
				}
			}
		}else {
			console.warn("Scene with no Assets to preload")
		}

		if(callbacks){
			this.errorFiles = 0
			currentLoader.start()
		}
	}
}