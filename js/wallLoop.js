var wallLoopHelper = {countInScene: 0, lifeLength: 0, active: false}

var WallLoop = function(scene) {

	var eaten = false;
	var loopActive = false;

	var x, y;
	var ttl = 10 * 1000;
	var duration = 20; //in seconds

	var counter, timerElement, timer;
	
	var dt = 0;

	this.getCoords = function() {
		return [{x: x, y: y}];
	};

	this.draw = function() {
		if(!eaten) {
			var context = scene.getContext();
			var blockSize = scene.getBlockSize();

			context.fillStyle = "green";

			context.beginPath();
			context.arc(x * blockSize.width + (blockSize.width / 2), y * blockSize.height + (blockSize.height / 2), blockSize.width / 2, 0, 2 * Math.PI);
			context.stroke();
			context.fill();
		} else {
			dt += scene.getDt();
			if(counter <= 5) {
				var color = Math.round((dt / 3) % 256);
				scene.setSceneBorderColor("rgb(" + color + ",0," + color + ")");
			}
		}
	};

	this.activate = function() {
		wallLoopHelper.lifeLength += scene.getDt();
		if (wallLoopHelper.active || wallLoopHelper.countInScene >= 1 || Math.random() > 1 / (scene.getGridSize().blockCount / 4)) {
			return false;
		}
		eaten = false;
		loopActive = false;
		wallLoopHelper.countInScene++;
		wallLoopHelper.lifeLength = 0;

		var coords = scene.getEmptyPosition();
		x = coords.x;
		y = coords.y;

		return true;
	};

	this.preupdate = function() {
		var snake = scene.getSnake();
		var snakeCoords = snake.getCoords();
		var gridSize = scene.getGridSize();
		if(loopActive) {
			if (snakeCoords.x > gridSize.width - 1) {
				snake.moveHead({x: 0});
			} else if (snakeCoords.x < 0) {
				snake.moveHead({x: gridSize.width - 1});
			} else if (snakeCoords.y > gridSize.height - 1) {
				snake.moveHead({y: 0});
			} else if (snakeCoords.y < 0) {
				snake.moveHead({y: gridSize.height - 1});
			}
		} else if (x === snakeCoords.x && y === snakeCoords.y) {
			wallLoopHelper.active = true;
			scene.setSceneBorderColor("lightgreen");
			timerElement = document.getElementById('timer');
			timerElement.innerHTML = counter = duration;
			timerElement.style.display = "block";

			timer = setInterval(function() {
				counter--;
				timerElement.innerHTML = counter;
				if (counter === 0) {
					timerElement.style.display = "none";
					clearInterval(timer);
					wallLoopHelper.active = false;
				}
			}, 1000);
			eaten = true;
			loopActive = true;
			wallLoopHelper.countInScene--;
		}
	};

	this.destroy = function() {
		var lifeEnded = wallLoopHelper.lifeLength >= ttl;
		if (lifeEnded) {
			wallLoopHelper.countInScene--;
		}
		return lifeEnded;
	};


};
