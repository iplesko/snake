var wallLoopHelper = {countInScene: 0, lifeLength: 0, active: false}

var WallLoop = function() {

	var scene;
	var eaten = false;

	var x, y;
	var ttl = 10 * 1000;
	var duration = 90; //in seconds

	var counter, timerElement, timer;

	this.getCoords = function() {
		return [{x: x, y: y}];
	};

	this.draw = function() {
		var context = scene.getContext();
		var blockSize = scene.getBlockSize();

		context.fillStyle = "green";

		context.beginPath();
		context.arc(x * blockSize.width + (blockSize.width / 2), y * blockSize.height + (blockSize.height / 2), blockSize.width / 2, 0, 2 * Math.PI);
		context.stroke();
		context.fill();
	};

	this.activate = function(_scene) {
		scene = _scene;
		wallLoopHelper.lifeLength += scene.getDt();
		if (wallLoopHelper.active || wallLoopHelper.countInScene >= 1 || Math.random() > 1 / (scene.getGridSize().blockCount / 4)) {
			return false;
		}
		eaten = false;
		wallLoopHelper.countInScene++;
		wallLoopHelper.lifeLength = 0;

		var coords = scene.getEmptyPosition();
		x = coords.x;
		y = coords.y;

		return true;
	};

	this.update = function() {
		var snakeCoords = scene.getSnake().getCoords();
		if (x === snakeCoords.x && y === snakeCoords.y) {
			scene.setLoopWalls(true);
			wallLoopHelper.active = true;
			scene.setSceneBorderColor("lightgreen");
			timerElement = document.getElementById('timer');
			timerElement.innerHTML = counter = duration;
			timerElement.style.display = "block";

			timer = setInterval(function() {
				counter--;
				timerElement.innerHTML = counter;
				if (counter === 5) {
					scene.setSceneBorderColor("red");
				}
				if (counter === 4) {
					scene.setSceneBorderColor("orange");
				}
				if (counter === 3) {
					scene.setSceneBorderColor("red");
				}
				if (counter === 2) {
					scene.setSceneBorderColor("orange");
				}
				if (counter === 1) {
					scene.setSceneBorderColor("red");
				}
				if (counter === 0) {
					scene.setSceneBorderColor("black");
					timerElement.style.display = "none";
					scene.setLoopWalls(false);
					clearInterval(timer);
					wallLoopHelper.active = false;
				}
			}, 1000);
			eaten = true;
			wallLoopHelper.countInScene--;
		}
	};

	this.destroy = function() {
		var lifeEnded = wallLoopHelper.lifeLength >= ttl;
		if (lifeEnded) {
			wallLoopHelper.countInScene--;
		}
		return eaten || lifeEnded;
	};


};