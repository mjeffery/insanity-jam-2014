(function(exports) {
	function FadingState() {}

	FadingState.preload = function(load) {
		load.image('black', 'assets/img/black.png');
	}

	FadingState.prototype = {

		fader: function() {
			var game = this.game,
				fader = game.add.sprite(0, 0, 'black');
			
			fader.width = game.width;
			fader.height = game.height;
			fader.fixedToCamera = true;
			game.world.bringToTop(fader);

			return fader;
		},

		fadeIn: function(duration, delay) {
			var game = this.game, 
				fader = this.fader(),
				tween = game.add.tween(fader)
								.to({ alpha: 0 }, duration, null, true, delay);

				//tween.onComplete.add(fader.destroy, fader);

			return {
				onComplete: tween.onComplete
			}
		},

		fadeOut: function(duration, delay) {
			var game = this.game,
				fader = this.fader(), 
				tween = game.add.tween(fader)
								.to({ alpha: 1 }, duration)
								.to({ alpha: 1 }, delay || 0);

			fader.alpha = 0;
			//tween.onComplete.add(fader.destroy, fader);
			tween.start();

			return {
				onComplete: tween.onComplete
			};
		}
	}

	exports.FadingState = FadingState;
})(this);