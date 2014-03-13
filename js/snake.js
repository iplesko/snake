function Snake(scene) {

	var keyBuffer = new Array();

	var x = -1;
	var y = 0;
	
	var dt = 0;

	var direction = 'r';

	var length = 10;

	var history = [{x: -1, y: 0}];
	var colors = [];

	var randomColor = function() {
		var g = Math.round(Math.random() * 255);
		var b = Math.round(Math.random() * 255);
		var r = Math.round(Math.random() * 255);
		return "rgb(" + r + "," + g + "," + b + ")";
	};

	this.draw = function() {

		dt += scene.getDt();
		if (dt > scene.getSpeed()) {
			dt = 0;
		}
		
		var context = scene.getContext();
		if (history.length > colors.length) {
			colors.unshift(randomColor());
		}

		var blockSize = scene.getBlockSize();
		var dx, dy;
		var speed = scene.getSpeed();
		var dtSpeed = dt / speed;
		var dsXI = 0, dsXO = 0, dsWI = 1, dsWO = 1;
		var dsYI = 0, dsYO = 0, dsHI = 1, dsHO = 1;

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
							dsYO = (1 - dtSpeed);
							dsHO = dtSpeed;
							dsHI = (1 - dtSpeed);
							//~ context.rect(
									//~ (history[i - 1].x) * blockSize.width,
									//~ (history[i - 1].y) * blockSize.height,
									//~ blockSize.width, blockSize.height * (1 - dtSpeed));
							//~ context.rect(
									//~ (history[i].x) * blockSize.width,
									//~ (history[i].y + (1 - dtSpeed)) * blockSize.height,
									//~ blockSize.width, blockSize.height * dtSpeed);
							break;
						case 'd' :
							dsYI = dtSpeed;
							dsHO = dtSpeed;
							dsHI = (1 - dtSpeed);
							//~ context.rect(
									//~ (history[i - 1].x) * blockSize.width,
									//~ (history[i - 1].y + dtSpeed) * blockSize.height,
									//~ blockSize.width, blockSize.height * (1 - dtSpeed));
							//~ context.rect(
									//~ (history[i].x) * blockSize.width,
									//~ (history[i].y) * blockSize.height,
									//~ blockSize.width, blockSize.height * dtSpeed);
							break;
						case 'r' :
							dsXI = dtSpeed;
							dsWO = dtSpeed;
							dsWI = (1 - dtSpeed);
							//~ context.rect(
									//~ (history[i - 1].x + dtSpeed) * blockSize.width,
									//~ (history[i - 1].y) * blockSize.height,
									//~ blockSize.width * (1 - dtSpeed), blockSize.height);
							//~ context.rect(
									//~ (history[i].x) * blockSize.width,
									//~ (history[i].y) * blockSize.height,
									//~ blockSize.width * dtSpeed, blockSize.height);
							break;
						case 'l' :
							dsXO = (1 - dtSpeed);
							dsWO = dtSpeed;
							dsWI = (1 - dtSpeed);
							//~ context.rect(
									//~ (history[i - 1].x) * blockSize.width,
									//~ (history[i - 1].y) * blockSize.height,
									//~ blockSize.width * (1 - dtSpeed), blockSize.height);
							//~ context.rect(
									//~ (history[i].x + (1 - dtSpeed)) * blockSize.width,
									//~ (history[i].y) * blockSize.height,
									//~ blockSize.width * dtSpeed, blockSize.height);
							break;
					}
					//input
					context.rect(
							(history[i - 1].x + dsXI) * blockSize.width,
							(history[i - 1].y + dsYI) * blockSize.height,
							blockSize.width * dsWI, blockSize.height * dsHI);
					//output
					context.rect(
							(history[i].x + dsXO) * blockSize.width,
							(history[i].y + dsYO) * blockSize.height,
							blockSize.width * dsWO, blockSize.height * dsHO);

					//~ context.rect(
							//~ (history[i].x - ddx + (ddx * dt / speed)) * blockSize.width,
							//~ (history[i].y - ddy + (ddy * dt / speed)) * blockSize.height,
							//~ blockSize.width, blockSize.height);
					//~ context.rect(
							//~ (history[i - 1].x + (ddx * dt / speed)) * blockSize.width,
							//~ (history[i - 1].y + (ddy * dt / speed)) * blockSize.height,
							//~ blockSize.width, blockSize.height);
				} else {
					context.rect(
							(history[i - 1].x + ((history[i].x - history[i - 1].x) * dtSpeed)) * blockSize.width,
							(history[i - 1].y + ((history[i].y - history[i - 1].y) * dtSpeed)) * blockSize.height,
							blockSize.width, blockSize.height);
				}

				context.fill();
				context.stroke();
			}
		}

	};
	
	this.preupdate = function() {
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
	}

	this.move = function() {
		var gridSize = scene.getGridSize();
		
		if (this.collision()) {
			dt = scene.getSpeed();
			return false;
		}

		history.push({x: x, y: y, direction: direction});

		if (history.length > length + 1) {
			history.shift();
		}
		return true;
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
			if(i == 0) {
				continue;
			}
			if (history[i].x === coords.x && history[i].y === coords.y) {
				return true;
			}
		}
		return false;
	};
	
	this.getHistory = function() {
		//TODO: remove first element
		return history;
	}

	this.collision = function() {

		var gridSize = scene.getGridSize();

		var collision =
				x > gridSize.width - 1 || x < 0
				|| y > gridSize.height - 1 || y < 0;

		collision = collision || this.inHistory({x: x, y: y});

		if (collision) {
			console.debug(x, y);
			console.debug("Collision");
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

	this.moveHead = function(coords) {
		if(coords.x !== undefined) {
			x = coords.x;
		}
		if(coords.y !== undefined) {
			y = coords.y;
		}
	};

	this.getCoords = function() {
		return {x: x, y: y};
	};

}
