(function(exports) {
	function Spawn(game, humans, orcs) {
		this.game = game;
		this.humans = humans;
		this.orcs = orcs;
	}

	function tileYToWorld(y) {
		return y * 32 + 16;
	}

	function tileXToWorld(x) {
		return x * 32 + 16;
	}

	Spawn.prototype = {
		soldier: function(x, y) {
			var x = tileXToWorld(x);
			var y = tileYToWorld(y);
			return new Soldier(this.game, x, y);
		},

		archer: function(x, y) {
			var x = tileXToWorld(x);
			var y = tileYToWorld(y);
			return new Archer(this.game, x, y);
		},

		peasant: function(x, y) {
			var x = tileXToWorld(x);
			var y = tileYToWorld(y);
			return new Peasant(this.game, x, y);
		},

		priest: function(x, y) {
			var x = tileXToWorld(x);
			var y = tileYToWorld(y);
			return new Priest(this.game, x, y);
		},

		orc: function(x, y) {
			var x = tileXToWorld(x),
				y = tileYToWorld(y),
				sex = this.game.rnd.pick(['male', 'female']),
			 	orc = new Orc(this.game, x, y, sex);

			orc.foes = this.humans;

			return orc;
		}
	};

	exports.Spawn = Spawn;

})(this);