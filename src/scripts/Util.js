(function(exports) {
	exports.Util = {
		override: function(proto, name, fn) {
			var superFn = proto[name];
			proto[name] = function() {
				var prev = this.__super;
				this.__super = superFn;
				fn.apply(this, arguments);
				this.__super = prev;
			}
		},

		distanceFrom: function(src, dest) {
			var array = [];
			(function f(obj) {
				if(obj instanceof Phaser.Group) {
					var grp = dest,
						start = grp.cursor,
						i = start;

					do {
						f(i);
						grp.next();
						i = grp.cursor;
					}
					while(i && i != start);

					grp.cursor = start;
				}
				else 
					insertByDistSq(array, src, obj);
			})(dest);

			return array; 
		},

		findClosest: function(src, dest, n) {
			if(n === undefined) n = 1;

			var result = _(Util.distanceFrom(src, dest))
				.first(n)
				.map(function(hash) {
					return {
						distance: Math.sqrt(hash.distSq),
						value: hash.value
					}
				})
				.valueOf();

			return n === 1 ? result[0] : result;
		}

	};

	function distanceSquared(a, b) {
		var dx = a.x - b.x,
			dy = a.y - b.y;

		return dx*dx + dy*dy;
	}

	function insertByDistSq(array, a, b) {
		var toAdd = { 
			distSq: distanceSquared(a, b), 
			value: b
		};
		var insertAt = _.sortedIndex(array, 'distSq');

		array.splice(insertAt, 0, toAdd); 
	}
})(this);