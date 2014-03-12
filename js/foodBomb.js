var foodBombHelper = {countInScene: 0, lifeLength: 0};

var FoodBomb = function() {

	var scene;
	var eaten = false;

	var x, y;
	var ttl = 10 * 1000;

	this.getCoords = function() {
		return [{x: x, y: y}];
	};

	this.draw = function() {
		var context = scene.getContext();
		var blockSize = scene.getBlockSize();

		context.fillStyle = "black";

		context.beginPath();
		context.arc(x * blockSize.width + (blockSize.width / 2), y * blockSize.height + (blockSize.height / 2), blockSize.width / 2, 0, 2 * Math.PI);
		context.stroke();
		context.fill();
	};

	this.activate = function(_scene) {
		scene = _scene;
		foodBombHelper.lifeLength += scene.getDt();
		if (foodBombHelper.countInScene >= 1 || Math.random() > 1 / (scene.getGridSize().blockCount / 4)) {
			return false;
		}
		eaten = false;
		foodBombHelper.countInScene++;
		foodBombHelper.lifeLength = 0;

		var coords = scene.getEmptyPosition();
		x = coords.x;
		y = coords.y;

		return true;
	};

	this.update = function() {
		var snakeCoords = scene.getSnake().getCoords();
		if (x === snakeCoords.x && y === snakeCoords.y) {
			for (var i = 0; i < 10; i++) {
				var item = new Food();
				item.activate(scene, true);
				scene.addItem(item);
			}
			eaten = true;
			foodBombHelper.countInScene--;
		}
	};

	this.destroy = function() {
		var lifeEnded = foodBombHelper.lifeLength >= ttl;
		if (lifeEnded) {
			foodBombHelper.countInScene--;
		}
		return eaten || lifeEnded;
	};


};