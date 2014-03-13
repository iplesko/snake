var portalHelper = {countInScene: 0, lifeLength: 0};

var Portal = function(scene) {
	var ttl = 90 * 1000;

	var x1, y1, x2, y2;

	this.getCoords = function() {
		return [{x: x1, y: y1}, {x: x2, y: y2}];
	};

	this.draw = function() {
		var context = scene.getContext();
		var blockSize = scene.getBlockSize();

		context.fillStyle = "blue";

		context.beginPath();
		context.arc(x1 * blockSize.width + (blockSize.width / 2), y1 * blockSize.height + (blockSize.height / 2), blockSize.width / 2, 0, 2 * Math.PI);
		context.stroke();
		context.fill();

		context.beginPath();
		context.arc(x2 * blockSize.width + (blockSize.width / 2), y2 * blockSize.height + (blockSize.height / 2), blockSize.width / 2, 0, 2 * Math.PI);
		context.stroke();
		context.fill();
	};

	this.activate = function() {
		portalHelper.lifeLength += scene.getDt();
		if (portalHelper.countInScene >= 1 || Math.random() > 1 / (scene.getGridSize().blockCount / 8)) {
			return false;
		}
		portalHelper.countInScene++;
		portalHelper.lifeLength = 0;

		//TODO: check if second coordinates aren't the same as the first ones
		var coords = scene.getEmptyPosition();
		x1 = coords.x;
		y1 = coords.y;

		coords = scene.getEmptyPosition();
		x2 = coords.x;
		y2 = coords.y;

		return true;
	};

	this.update = function() {
		var snake = scene.getSnake();
		var snakeCoords = snake.getCoords();
		if (x1 === snakeCoords.x && y1 === snakeCoords.y) {
			snake.moveHead({x: x2, y: y2});
		} else if (x2 === snakeCoords.x && y2 === snakeCoords.y) {
			snake.moveHead({x: x1, y: y1});
		}
	};

	this.destroy = function() {
		var lifeEnded = portalHelper.lifeLength >= ttl;
		if (lifeEnded) {
			portalHelper.countInScene--;
		}
		return lifeEnded;
	};
};
