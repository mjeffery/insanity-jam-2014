(function(exports) {
	function FogOfWar(game, terrain) {
		this.game = game;
		this.terrain = terrain;
	}

	FogOfWar.preload = function(load) {
		load.image('fog-of-war-tiles', 'assets/img/fog of war tiles.png');
	}

	FogOfWar.prototype = {

	};

	exports.FogOfWar = FogOfWar;
})(this);