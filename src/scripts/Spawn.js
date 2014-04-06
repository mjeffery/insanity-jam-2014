(function(exports) {
	function Spawn(game, humans, orcs, arrows) {
		this.game = game;
		this.humans = humans;
		this.orcs = orcs;

		this.manblood = new BloodSpray(game, 'man-blood');
		this.orcblood = new BloodSpray(game, 'orc-blood');

		this.arrows = arrows;
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
			return new Soldier(this.game, x, y, this.manblood);
		},

		archer: function(x, y) {
			var x = tileXToWorld(x),
				y = tileYToWorld(y),
				unit = new Archer(this.game, x, y, this.manblood);

			unit.foes = this.orcs;
			unit.arrows = this.arrows;

			return unit;
		},

		peasant: function(x, y) {
			var x = tileXToWorld(x);
			var y = tileYToWorld(y);
			return new Peasant(this.game, x, y, this.manblood);
		},

		priest: function(x, y) {
			var x = tileXToWorld(x);
			var y = tileYToWorld(y);
			return new Priest(this.game, x, y, this.manblood);
		},

		orc: function(x, y) {
			var x = tileXToWorld(x),
				y = tileYToWorld(y),
				sex = this.game.rnd.pick(['male', 'female']),
			 	orc = new Orc(this.game, x, y, sex);

			orc.foes = this.humans;
			orc.blood = this.orcblood;

			return orc;
		}
	};

	exports.Spawn = Spawn;

})(this);