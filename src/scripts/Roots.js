(function(exports) {
	function solveQuadratic(a, b, c) {
		if(a == 0) return [ -c / b ];
		var discriminant = b * b - 4 * a * c;

		if(discriminant < 0) return [];
		else if(Math.abs(discriminant) <= 0.0001) return [ -b / 2 * a ]; 
		else {
			var sqrtDisc = Math.sqrt(discriminant);
			return [
				(-b + sqrtDisc) / (2 * a),
				(-b - sqrtDisc) / (2 * a)
			];
		}
	}
})(this);