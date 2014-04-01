(function(exports) {
	function Boot() { }

	Boot.prototype = {
		preload: function() {
			this.load.image('loading-bar-overlay', 'assets/img/loading-bar-overlay.png');
			this.load.image('loading-bar', 'assets/img/loading-bar.png');
		},
		create: function() {
			this.game.state.start('preloader');
		}
	};

	exports.Boot = Boot;
})(this);