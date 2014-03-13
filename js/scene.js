var Scene = function() {
	var canvas;
	var context;
	var scoreElement;
	var playing = true;
	var time;
	var score = 0;
	var level = 1;
	var interval = 0;
	var speed = 120;

	var itemTypes = [Food, Shortener, Portal, FoodBomb, WallLoop];
	var itemPool = new Array();
	var items = new Array();

	var dt = 0;

	var snake;
	var usedBlocks = new Array();

	var blockSize = {width: 20, height: 20};
	var gridSize = {width: 50, height: 30};

	var draw = function() {

		context.fillStyle = "white";
		context.fillRect(0, 0, canvas.width, canvas.height);

		snake.draw();

		for (var i in items) {
			items[i].draw();
		}

		scoreElement.innerHTML = score;
	};

	var move = function(dt) {
		snake.preupdate();
		
		for(var i in items) {
			if(items[i].preupdate && items[i].preupdate()) {
				return false;
			}
		}
		
		return snake.move(dt);
	};

	this.step = function() {

		var now = Date.now();
		dt = (now - time);
		interval += dt;
		time = now;

		for(var i in items) {
			if(items[i].notify) {
				items[i].notify();
			}
		}

		if (interval > speed) {

			if(!move(dt)) {
				return false;
			}
			interval = 0;

			var i = items.length;
			while (i--) {
				if(items[i].update && items[i].update()) {
					return false;
				}
				if (items[i].destroy()) {
					items.splice(i, 1);
				}
			}

			for (var i in itemPool) {
				var item = itemPool[i];
				var canBeAdded = item.activate();
				if (canBeAdded) {
					items.push(itemPool[i]);
				}
			}
		}

		draw();

		if (playing) {
			requestAnimationFrame(function() {
				scene.step();
			});
		}

//		if (score >= 10 && level === 1) {
//			level++;
//			speed = 130;
//			renewAnimationInterval();
//		} else if (score >= 20 && level === 2) {
//			level++;
//			speed = 110;
//			renewAnimationInterval();
//		} else if (score >= 40 && level === 3) {
//			level++;
//			speed = 90;
//			renewAnimationInterval();
//		} else if (score >= 80 && level === 4) {
//			level++;
//			speed = 70;
//			renewAnimationInterval();
//		}

		usedBlocks = new Array();
	};

	this.getDt = function() {
		return dt;
	};

	this.initialize = function() {

		time = Date.now();

		canvas = document.createElement("canvas");
		canvas.height = blockSize.height * gridSize.height;
		canvas.width = blockSize.width * gridSize.width;
		document.getElementById("canvas").appendChild(canvas);

		gridSize.blockCount = gridSize.width * gridSize.height;

		context = canvas.getContext("2d");
		scoreElement = document.getElementById('score');

		snake = new Snake(this);
		for (var i in itemTypes) {
			itemPool.push(new itemTypes[i](this));
		}

		document.onkeydown = function(event) {
			if ((playing && snake.keyPressed(event.keyCode)) || event.keyCode === 80) {

				if (event.keyCode === 80) {
					if (playing) {
						scene.stop();
					} else {
						scene.play();
					}
				}

				if (event.preventDefault) {
					event.stopPropagation();
					event.preventDefault();
				} else {
					event.cancelBubble = true;
					event.returnValue = false;
				}

				return false;
			}
		};

		scene.play();
	};

	this.stop = function() {
		playing = false;
	};

	this.play = function() {
		playing = true;
		requestAnimationFrame(function() {
			scene.step();
		});
	};

	this.getSnake = function() {
		return snake;
	};

	this.getBlockSize = function() {
		return blockSize;
	};

	this.incrementScore = function(count) {
		if (typeof count === 'undefined') {
			score++;
		} else {
			score += count;
		}
	};

	this.getEmptyPosition = function() {

		var conflict = false, x, y;

		if(!usedBlocks.length) {
			for (var i in items) {
				var coords = items[i].getCoords();
				for (var j in coords) {
					usedBlocks[coords[j].x * coords[j].y] = 1;
				}
			}
			
			var coords = snake.getHistory();
			for (var j in coords) {
				usedBlocks[coords[j].x * coords[j].y] = 1;
			}
		}
		
		x = Math.round(Math.random() * (gridSize.width - 1));
		y = Math.round(Math.random() * (gridSize.height - 1));
		while(usedBlocks[x*y] === 1 || snake.inHistory({x: x, y: y})) {
			x++
			if(x >= gridSize.width) {
				x = 0;
				y = (y + 1) % gridSize.height;
			}
			console.debug(x,y);
		};

		return {x: x, y: y};
	};

	this.getContext = function() {
		return context;
	};

	this.addItem = function(item) {
		items.push(item);
	};

	this.getGridSize = function() {
		return gridSize;
	};

	this.setSceneBorderColor = function(color) {
		canvas.style.borderColor = color;
	};

	this.getSpeed = function() {
		return speed;
	};

};

var scene = new Scene();
