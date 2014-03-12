var foodHelper = {countInScene: 0};

var Food = function() {

	var color;
	var scene;
	var eaten = false;

	var x, y;

	this.getCoords = function() {
		return [{x: x, y: y}];
	};

	this.getColor = function() {
		return color;
	};

	this.draw = function() {
		var context = scene.getContext();
		var blockSize = scene.getBlockSize();
		context.beginPath();
		context.strokeStyle = '#111111';
		context.fillStyle = color;
		context.rect(x * blockSize.width, y * blockSize.height, blockSize.width, blockSize.height);
		context.fill();
		context.stroke();
	};

	this.activate = function(_scene, ignoreCountInScene) {
		scene = _scene;
		if (!ignoreCountInScene && foodHelper.countInScene >= 1) {
			return false;
		}
		eaten = false;
		foodHelper.countInScene++;

		var coords = scene.getEmptyPosition();
		x = coords.x;
		y = coords.y;

		var g = Math.round(Math.random() * 255);
		var b = Math.round(Math.random() * 255);
		var r = Math.round(Math.random() * 255);
		color = "rgb(" + r + "," + g + "," + b + ")";

		return true;
	};

	this.update = function() {
		var snake = scene.getSnake();
		var snakeCoords = snake.getCoords();
		if (x === snakeCoords.x && y === snakeCoords.y) {
			snake.incrementLength(1, color);
			eaten = true;
			foodHelper.countInScene--;
			scene.incrementScore();
		}
	};

	this.destroy = function() {
		return eaten;
	};


};