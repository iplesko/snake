var Wall = function(scene) {

	var coords = new Array();
	var ttl = 100;

	this.getCoords = function() {
		return coords;
	};

	this.draw = function() {
		var context = scene.getContext();
		var blockSize = scene.getBlockSize();

		context.fillStyle = "black";

		for(var i in coords) {
			context.beginPath();
			context.rect(coords[i].x * blockSize.width, coords[i].y * blockSize.height, blockSize.width, blockSize.height);
			context.stroke();
			context.fill();
		}
	};
	
	function createCoords(callbacks) {
		for(var i in callbacks) {
			var j = callbacks[i].c;
			var coord = {x: callbacks[i].x, y: callbacks[i].y}
			do {
				coords.push(coord);
				coord = callbacks[i].f(coord);
			} while(--j >= 0);
		}
	}

	this.activate = function() {
		if(coords.length > 0) {
			return false;
		}
		createCoords([
			{c : 10,x: 10,y: 10,f: function(coords) {return {x: coords.x+1,y: coords.y}}},
			{c : 15,x: 35,y: 5,f: function(coords) {return {x: coords.x,y: coords.y+1}}},
			{c : 8,x: 8,y: 15,f: function(coords) {return {x: coords.x+1,y: coords.y+1}}}
		]);
		return true;
	};

	this.update = function() {
		var snakeCoords = scene.getSnake().getCoords();
		for(var i in coords) {
			if (coords[i].x === snakeCoords.x && coords[i].y === snakeCoords.y) {
				scene.stop();
				return true;
			}
		}
	};

	this.destroy = function() {
		return false;
	};


};
