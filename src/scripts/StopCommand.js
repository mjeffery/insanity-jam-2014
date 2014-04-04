(function(exports) {
	function StopCommand() { }

	StopCommand.prototype = {
		start: function(callback) {
			callback(null, function(unit) {
				unit.send({ command: 'stop' });
			});
		}
	}

	exports.StopCommand = StopCommand;
})(this);