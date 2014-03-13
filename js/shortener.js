var shortenerHelper = {countInScene: 0, lifeLength: 0};

var Shortener = function(scene) {

	var used = false;
	var ttl = 10 * 1000;

	var x, y;

	this.getCoords = function() {
		return [{x: x, y: y}];
	};

	this.draw = function() {
		var context = scene.getContext();
		var blockSize = scene.getBlockSize();
		context.fillStyle = "red";
		context.beginPath();
		context.arc(x * blockSize.width + (blockSize.width / 2), y * blockSize.height + (blockSize.height / 2), blockSize.width / 2, 0, 2 * Math.PI);
		context.stroke();
		context.fill();
		shortenerHelper.lifeLength++;
	};

	this.activate = function() {
		shortenerHelper.lifeLength += scene.getDt();
		if (shortenerHelper.countInScene >= 1 || Math.random() > 1 / (scene.getGridSize().blockCount / 2)) {
			return false;
		}
		used = false;
		shortenerHelper.countInScene++;
		shortenerHelper.lifeLength = 0;

		var coords = scene.getEmptyPosition();
		x = coords.x;
		y = coords.y;

		return true;
	};

	this.update = function() {
		var snake = scene.getSnake();
		var snakeCoords = snake.getCoords();
		if (x === snakeCoords.x && y === snakeCoords.y) {
			snake.decrementLength(10);
			used = true;
			shortenerHelper.countInScene--;
		}
	};

	this.destroy = function() {
		var lifeEnded = shortenerHelper.lifeLength >= ttl;
		if (lifeEnded) {
			shortenerHelper.countInScene--;
		}
		return used || lifeEnded;
	};

};
