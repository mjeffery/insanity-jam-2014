(function(exports) {
	exports.Util = {
		override: function(proto, name, fn) {
			var superFn = proto[name];
			proto[name] = function() {
				var prev = this.__super;
				this.__super = superFn;
				var retVal = fn.apply(this, arguments);
				this.__super = prev;
				return retVal;
			}
		},

		distanceFrom: function(src, dest) {
			var array = [];
			(function f(obj) {
				if(obj instanceof Phaser.Group) {
					dest.forEach(f, true);
				}
				else if(obj) {
					insertByDistSq(array, src, obj);
				}
			})(dest);

			return array; 
		},

		findClosest: function(src, dest, n) {
			if(n === undefined) n = 1;
			var array = Util.distanceFrom(src, dest);
			var result = _(array)
				.first(n)
				.map(function(hash) {
					return {
						distance: Math.sqrt(hash.distSq),
						value: hash.value
					}
				})
				.valueOf();

			return n === 1 ? result[0] : result;
		},

		lobAtPoint: function(src, dest, velocity, gravity) {
			var x = dest.x - src.x,
				y = dest.y - src.y,
				v = velocity,
				vSq = v*v,
				g = -gravity,
				gx = g*x,
				disc = vSq*vSq - g*(gx*x + 2*y*vSq);

			if(disc <= 0)
				return undefined;
			else {
				var discSqrt = Math.sqrt(disc),
					a1 = Math.atan2(vSq + discSqrt, gx) + Math.PI;
					a2 = Math.atan2(vSq - discSqrt, gx) + Math.PI;

				return [a1, a2];
			}

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
		var insertAt = _.sortedIndex(array, toAdd, 'distSq');

		array.splice(insertAt, 0, toAdd); 
	}
})(this);