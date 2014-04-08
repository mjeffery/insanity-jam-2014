(function(exports) {
	function Spawn(game, humans, orcs, arrows, spells, gravityEffect) {
		this.game = game;
		this.humans = humans;
		this.orcs = orcs;

		this.manblood = new BloodSpray(game, 'man-blood');
		this.orcblood = new BloodSpray(game, 'orc-blood');

		this.arrows = arrows;
		this.spells = spells;
		this.gravityEffect = gravityEffect;

		this.events = {
			onSpawn: new Phaser.Signal()
		}
	}

	function tileYToWorld(y) {
		return y * 32 + 16;
	}

	function tileXToWorld(x) {
		return x * 32 + 16;
	}

	Spawn.prototype = {
		soldier: function(x, y) {
			var x = tileXToWorld(x),
				y = tileYToWorld(y),
				unit = new Soldier(this.game, x, y, this.manblood);

			unit.foes = this.orcs;
			this.humans.add(unit);

			this.events.onSpawn.dispatch(unit);

			return unit;
		},

		archer: function(x, y) {
			var x = tileXToWorld(x),
				y = tileYToWorld(y),
				unit = new Archer(this.game, x, y, this.manblood);

			unit.foes = this.orcs;
			unit.arrows = this.arrows;
			this.humans.add(unit);

			this.events.onSpawn.dispatch(unit);

			return unit;
		},

		peasant: function(x, y) {
			var x = tileXToWorld(x);
			var y = tileYToWorld(y);
			var unit = new Peasant(this.game, x, y, this.manblood);

			this.events.onSpawn.dispatch(unit);
			this.humans.add(unit);

			return unit;
		},

		priest: function(x, y) {
			var x = tileXToWorld(x),
				y = tileYToWorld(y),
				unit = new Priest(this.game, x, y, this.manblood);
		
			unit.gravityEffect = this.gravityEffect;
			unit.spellsGroup = this.spells;
			this.humans.add(unit);

			this.events.onSpawn.dispatch(unit);

			return unit;
		},

		orc: function(x, y) {
			var x = tileXToWorld(x),
				y = tileYToWorld(y),
				sex = this.game.rnd.pick(['male', 'female']),
			 	unit = new Orc(this.game, x, y, sex);

			unit.foes = this.humans;
			unit.blood = this.orcblood;
			this.orcs.add(unit);

			this.events.onSpawn.dispatch(unit);

			return unit;
		}
	};

	exports.Spawn = Spawn;

})(this);