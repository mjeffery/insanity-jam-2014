(function(exports) {
	function Preloader() { }

	Preloader.FADE_OUT_TIME = 250;
	Preloader.STAY_DARK_TIME = 100;
	Preloader.NEXT_STATE = 'game';

	Preloader.prototype = {
		preload: function() {
			var load = this.load,
				add = this.add;

			this.bar = add.sprite(303, 281,'loading-bar');
			this.overlay = add.sprite(298, 276, 'loading-bar-overlay');
			
			load.onLoadComplete.addOnce(this.onLoadComplete, this);
			load.setPreloadSprite(this.bar);

			//PRELOAD RESOURCES HERE
			Game.preload(load);	
			Unit.preload(load);
			Soldier.preload(load);
			Archer.preload(load);
			Peasant.preload(load);
			Priest.preload(load);
			Orc.preload(load);
			IconBar.preload(load);
			CommandIndicator.preload(load);
			Backdrop.preload(load);
			HealthBar.preload(load);
			BloodSpray.preload(load);
			SlashEffect.preload(load);
			//END PRELOAD
		},
		onLoadComplete: function() {
			this.add.tween(this.bar).to({ alpha: 0 }, Preloader.FADE_OUT_TIME)
				.start()
				.onComplete.addOnce(function() {
					this.time.events.add(Preloader.STAY_DARK_TIME, function() {
						this.game.state.start(Preloader.NEXT_STATE); 
					}, this);
				}, this);

			this.add.tween(this.overlay).to({ alpha: 0 }, Preloader.FADE_OUT_TIME)
				.start();	
		}
	};

	exports.Preloader = Preloader;

})(this);