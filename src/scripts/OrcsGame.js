(function(exports) {
	missions = ['test-map-0'];

	function OrcsGame() {
		Phaser.Game.apply(this, arguments);

		var state = this.state;
		
		state.add('boot', Boot);
		state.add('preloader', Preloader);
		state.add('menu', MainMenu)
		state.add('mission', Mission);
		state.add('defeat', Defeat);
		state.add('victory', Victory);

		state.start('boot');

		this.resetProgress();
	}

	OrcsGame.prototype = Object.create(Phaser.Game.prototype);
	OrcsGame.prototype.constructor = OrcsGame;

	_.extend(OrcsGame.prototype, {
		
		mainMenu: function() {
			this.resetProgress();
			this.state.start('menu');
		},

		resetProgress: function() {
			this.currentMission = 0;
		},

		nextMission: function() {
			var mission = this.currentMission || 0;
			if(mission < missions.length) {
				this.state.start('mission', true, false, missions[mission]);
				mission++;
			}

			this.currenMission = mission;
		},

		defeat: function(score) {
			this.state.start('defeat');
		},

		victory: function(score) {
			this.state.start('victory', true, false, score);
		}
	});

	exports.OrcsGame = OrcsGame;
})(this);