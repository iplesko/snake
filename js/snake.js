function Snake() {

	var keyBuffer = new Array();

	var x = -1;
	var y = 0;
	
	var dt = 0;

	var direction = 'r';

	var length = 10;

	var history = [{x: -1, y: 0}];
	var colors = [];

	var scene;

	var randomColor = function() {
		var g = Math.round(Math.random() * 255);
		var b = Math.round(Math.random() * 255);
		var r = Math.round(Math.random() * 255);
		return "rgb(" + r + "," + g + "," + b + ")";
	};

	this.draw = function() {

		var context = scene.getContext();
		if (history.length > colors.length) {
			colors.unshift(randomColor());
		}

		var blockSize = scene.getBlockSize();
		var dx, dy;
		var speed = scene.getSpeed();

		var i;
		for (i in history) {
			i *= 1;
			context.beginPath();
			context.fillStyle = colors[i + (colors.length - history.length - 1)];
			context.strokeStyle = '#111111';

			if (i > 0) {

				dx = history[i].x - history[i - 1].x;
				dy = history[i].y - history[i - 1].y;

				if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
					var ddx = 0;
					var ddy = 0;

					switch (history[i].direction) {
						case 'u' :
							ddy = -1;
							break;
						case 'r' :
							ddx = +1;
							break;
						case 'd' :
							ddy = 1;
							break;
						case 'l' :
							ddx = -1;
							break;
					}

					context.rect(
							(history[i].x - ddx + (ddx * dt / speed)) * blockSize.width,
							(history[i].y - ddy + (ddy * dt / speed)) * blockSize.height,
							blockSize.width, blockSize.height);
					context.rect(
							(history[i - 1].x + (ddx * dt / speed)) * blockSize.width,
							(history[i - 1].y + (ddy * dt / speed)) * blockSize.height,
							blockSize.width, blockSize.height);
				} else {
					context.rect(
							(history[i - 1].x + ((history[i].x - history[i - 1].x) * dt / speed)) * blockSize.width,
							(history[i - 1].y + ((history[i].y - history[i - 1].y) * dt / speed)) * blockSize.height,
							blockSize.width, blockSize.height);
				}

				context.fill();
				context.stroke();
			}
		}

	};

	this.move = function(_dt) {

		dt += _dt;
		if (dt <= scene.getSpeed()) {
			return;
		}
		dt = 0;
		changeDirection();

		switch (direction) {
			case 'u' :
				y--;
				break;
			case 'r' :
				x++;
				break;
			case 'd' :
				y++;
				break;
			case 'l' :
				x--;
				break;
		}

		var gridSize = scene.getGridSize();
		if (scene.getLoopWalls()) {
			if (x > gridSize.width - 1) {
				x = 0;
			} else if (x < 0) {
				x = gridSize.width - 1;
			} else if (y > gridSize.height - 1) {
				y = 0;
			} else if (y < 0) {
				y = gridSize.height - 1;
			}
		}

		if (this.collision()) {
			dt = scene.getSpeed();
			return;
		}

		history.push({x: x, y: y, direction: direction});

		if (history.length > length + 1) {
			history.shift();
		}

	};

	this.incrementLength = function(count, color) {
		if (typeof count === 'undefined') {
			length++;
		} else {
			length += count;
		}
		if (typeof color === 'undefined') {
			color = randomColor();
		}
		for (var i = 0; i < count; i++) {
			colors.unshift(color);
		}
	};

	this.decrementLength = function(count) {
		if (typeof count === 'undefined') {
			count = 1;
		}

		if (length - count < 1) {
			history.splice(0, length - 1);
			colors.splice(0, length - 1);
			length = 1;
		} else {
			length -= count;
			history.splice(0, count);
			colors.splice(0, count);
		}

	};

	this.inHistory = function(coords) {
		for (var i in history) {
			if (history[i].x === coords.x && history[i].y === coords.y) {
				return true;
			}
		}
		return false;
	};

	this.collision = function() {

		var gridSize = scene.getGridSize();

		var collision =
				x > gridSize.width - 1 || x < 0
				|| y > gridSize.height - 1 || y < 0;

		collision = collision || this.inHistory({x: x, y: y});

		if (collision) {
			scene.stop();
		}
		return collision;
	};

	this.keyPressed = function(key) {
		var keys = [37, 38, 39, 40];
		if (keys.indexOf(key) >= 0) {
			keyBuffer.push(key);
			return true;
		}
		return false;
	};

	var keyBufferIterator = 0;
	var keyBufferMaxLength = 100;

	var changeDirection = function() {

		var key = '';
		while (keyBuffer.length > keyBufferIterator) {
			key = keyBuffer[keyBufferIterator];
			if (keyBufferIterator > keyBufferMaxLength) {
				keyBuffer.splice(0, keyBufferMaxLength);
				keyBufferIterator -= keyBufferMaxLength;
			}
			keyBufferIterator++;
			switch (key) {
				case 38:
					if (direction !== 'd' && direction !== 'u') {
						direction = 'u';
						return;
					}
					break;
				case 39:
					if (direction !== 'l' && direction !== 'r') {
						direction = 'r';
						return;
					}
					break;
				case 40:
					if (direction !== 'u' && direction !== 'd') {
						direction = 'd';
						return;
					}
					break;
				case 37:
					if (direction !== 'r' && direction !== 'l') {
						direction = 'l';
						return;
					}
					break;
			}
		}


	};

	this.setScene = function(_scene) {
		scene = _scene;
	};

	this.moveHead = function(coords) {
		x = coords.x;
		y = coords.y;
	};

	this.getCoords = function() {
		return {x: x, y: y};
	};

}
