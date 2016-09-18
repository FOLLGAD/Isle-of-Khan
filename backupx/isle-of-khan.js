var canvas = document.getElementById("myCanvas");
console.log(canvas);
var ctx = canvas.getContext("2d");

var charX = canvas.width/2;
var charY = canvas.height/2;
var charVelX = 0;
var charVelY = 0;
var charWidth = 64;
var charHeight = 64;
var fps = 30;
var frame = 0;
var direction = "up";
var idle = true;
var walkSpeed = 10;
var arrows = [];
var points = 0;

var rightPressed = false;
var upPressed = false;
var leftPressed = false;
var downPressed = false;

var spacePressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
				frame = 0;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
				frame = 0;
    }
		else if(e.keyCode == 38) {
        upPressed = true;
				frame = 0;
    }
    else if(e.keyCode == 40) {
        downPressed = true;
				frame = 0;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
				frame = 0;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
				frame = 0;
    }
		else if(e.keyCode == 38) {
        upPressed = false;
				frame = 0;
    }
    else if(e.keyCode == 40) {
        downPressed = false;
				frame = 0;
    }
}

function drawCoin() {
	coin = document.getElementById("coin");
	ctx.drawImage(coin, 100, 100, 16, 16);

	if (charX < 120 && charY < 120 && charX > 44 && charY > 80) {
		points++;
	}
	ctx.font = "20px Georgia";
	ctx.fillText("123", 10, 50);
	console.log(points);
}
console.log(ctx);
function drawChar(direction, x, y) {
	if (idle) {
		var img = document.getElementById("walk_"+direction+"_idle");
	} else {
    	var img = document.getElementById("walk_"+direction);
	}
	ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, Math.floor(frame) * 8, 0, 8, 8, charX, charY, charWidth, charHeight);
    console.log(charX);
    console.log(charY);

}
function walk() {
	if (rightPressed && !leftPressed) {
		idle = false;
		charVelX = walkSpeed;
	} else if (leftPressed && !rightPressed) {
		idle = false;
		charVelX = -walkSpeed;
	}

	if (upPressed && !downPressed) {
		idle = false;
		charVelY = -walkSpeed;

	} else if (downPressed && !upPressed) {
		idle = false;
		charVelY = walkSpeed;
	}



	document.addEventListener('keydown', function(event) {
		if(event.keyCode == 38) { //Up key
			direction = "up";
			idle = false;
			charVelY = -walkSpeed;
		}else if(event.keyCode == 40) {
			direction = "down";
			idle = false;
			charVelY = walkSpeed;
		}else if(event.keyCode == 37) {
			direction = "left";
			idle = false;
			charVelX = -walkSpeed;
		}else if(event.keyCode == 39) {
			direction = "right";
			idle = false;
			charVelX = walkSpeed;
		}
	});
	document.addEventListener('keyup', function(event) {
		if(event.keyCode == 38 || 40) { //Up key
			charVelY = 0;
			frame = 0;
			idle=true;
		}
		if(event.keyCode == 39 || 37) { //Up key
			charVelX = 0;
			frame = 0;
			idle=true;
		}
	});
	drawChar(direction);
}
function background (){
	img = document.getElementById("grass_tile");
    pat = ctx.createPattern(img, "repeat");
	ctx.rect(0,0,canvas.width,canvas.height);
	ctx.fillStyle=pat;
	ctx.fill();
}
function update() {
				  if (frame+0.1 < 4) {
				  frame += 0.1;
			  }else{
				  frame = 0;
			  }
	ctx.clearRect(0, 0, canvas.width, canvas.height); //Clears canvas

	charY += charVelY;
	charX += charVelX;
	background();
	drawCoin();
	walk();
}

setInterval(update, 1000/fps);
