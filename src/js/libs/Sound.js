class Sound{

	constructor(){
		this.decodedSounds = {}
		this.soundVolume = 1
		this.musicVolume = 1
		this.songName = null
		this.game = null;
	}

	playWithDelay(soundId,delay) {
		this.game.time.delayedCall(delay,()=>{
			this.play(soundId);
		})
	}

	setContext(context) {
		this.game = context;
	}

	decode(soundStringArray,gameRerence){
		if(!soundStringArray) {
			console.warn("No sounds to decode")
			return
		}

		this.game = gameRerence;
		console.log("Decoding Sounds...")
		for(var indexSound = 0; indexSound < soundStringArray.length; indexSound++) {
			var currentSoundData = soundStringArray[indexSound]
			if(this.game.cache.audio.get(currentSoundData)) {
				var currentLoadedAudio = this.game.sound.add(currentSoundData)
				this.decodedSounds[currentSoundData] = currentLoadedAudio
			} else {
				console.warn(currentSoundData + ' audio did not load correctly')
			}
			
		}

		//this.game.sound.setDecodedCallback(this.decodedSounds, function(){}, this)
	}

	pause(soundId,active){
		if(typeof this.decodedSounds[soundId] !== "undefined") {
			active?this.decodedSounds[soundId].pause():this.decodedSounds[soundId].resume();
		} else {
			console.warn("[Sound]"+"Not found Sound: "+soundId);
		}
	}

	play(soundId, params){

		params = params || {}
		params.volume = params.loop?this.musicVolume:this.soundVolume

		if(typeof this.decodedSounds[soundId] !== "undefined") {
			
			this.decodedSounds[soundId].play(params)
			return this.decodedSounds[soundId]
		} else {
			console.warn("[Sound]"+"Not found Sound: "+soundId)
		}
	}

	playSong(soundId){

		if(!this.musicActive) {
			return;
		}
		if(this.songName) {
			stop(this.songName);
		}
		if(this.decodedSounds[soundId]) {
			this.songName = soundId;
			this.play(this.songName,{loop:true})
		}
	}

	pauseSong(active){
		if(this.songName) {
			this.pause(this.songName,active)
		}
	}

	stop(soundId) {
		if(this.decodedSounds[soundId]) {
			this.decodedSounds[soundId].stop()
		}
	}

	stopSong(){
		if(this.songName) {
			this.stop(this.songName)
		}
	}

	stopAll() {
		for(var key in this.decodedSounds) {
			var sound = this.decodedSounds[key]
			if(sound) {
				sound.stop()
			}
		}
	}

}

module.exports = new Sound();