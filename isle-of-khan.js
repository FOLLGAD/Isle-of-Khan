var canvas = document.getElementById("canvas");
console.log(canvas);
var ctx = canvas.getContext("2d");

var charX = canvas.width / 2;
var charY = canvas.height / 2;
var charVelX = 0;
var charVelY = 0;
var charWidth = 64;
var charHeight = 64;

var posX = 0;
var posY = 0;
var tileSize = 64;

var mousePosX = 0;
var mousePosY = 0;

var fps = 60;
var walkSpeed = 5;
var frameAdd = 0.1;

var frame = 0;
var direction = "up";
var arrows = [];
var points = 0;
var idle = true;
var idleX = true;
var idleY = true;

var rightPressed = false;
var upPressed = false;
var leftPressed = false;
var downPressed = false;

var spacePressed = false;

var mapArray = [
  [1, 1, 0, 0, 0, 2, 1, 3, 0, 1, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3],
  [2, 3, 2, 1, 1, 1, 1, 1, 0, 3, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 3, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1]
]

var mapSizeX = mapArray[0].length * tileSize;
var mapSizeY = mapArray.length * tileSize;

var offsetMaxX = mapSizeX - canvas.width;
var offsetMaxY = mapSizeY - canvas.height;
var offsetMinX = 0;
var offsetMinY = 0;

var camX = 0;
var camY = 0;

// textures and resources

ctx.imageSmoothingEnabled = false;

var img = new Image();
img.src = "resources/crosshair.png";

var coin = document.getElementById("coin");
var walk_right = document.getElementById("walk_right");
var walk_down = document.getElementById("walk_down");
var walk_left = document.getElementById("walk_left");
var walk_up = document.getElementById("walk_up");
var idle_right = document.getElementById("idle_right");
var idle_down = document.getElementById("idle_down");
var idle_left = document.getElementById("idle_left");
var idle_up = document.getElementById("idle_up");
var tile_map = document.getElementById("tile_map");
var crosshair = document.getElementById("crosshair");
var hitting_up = document.getElementById("hitting_up");

// event handlers

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener('mousemove', nameMousePos, false);
document.addEventListener("mousedown", mouseDown, false);
document.addEventListener("mouseup", mouseUp, false);

function keyDownHandler(e) {
    if(e.keyCode == 68) {
        rightPressed = true;
    }
    else if(e.keyCode == 65) {
        leftPressed = true;
    }
    else if(e.keyCode == 87) {
        upPressed = true;
    }
    else if(e.keyCode == 83) {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 68) {
        rightPressed = false;
        frame = 0;
    }
    else if(e.keyCode == 65) {
        leftPressed = false;
        frame = 0;
    }
    else if(e.keyCode == 87) {
        upPressed = false;
        frame = 0;
    }
    else if(e.keyCode == 83) {
        downPressed = false;
        frame = 0;
    }
}

function nameMousePos(e) {
  var mousePos = getMousePos(e);
  mousePosX = mousePos.x;
  mousePosY = mousePos.y;
}

function getMousePos(e) {
  var rect = canvas.getBoundingClientRect();
  scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
  scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  return {
    x: (e.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (e.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

function mouseDown() {
  mouseDown = true;
  console.log("mouseDown = " + mouseDown + " at " + mousePosX, mousePosY);
}

function mouseUp() {
  mouseDown = false;
  console.log("mouseDown = " + mouseDown + " at " + mousePosX, mousePosY);
}

// draw functions

function drawMap (){
  for (var i = 0; i < mapArray.length; i++) {
    for (var j = 0; j < mapArray[i].length; j++) {
      ctx.drawImage(tile_map, (mapArray[i][j] % 2) * 8, Math.floor(mapArray[i][j] / 2) * 8, 8, 8, posX, posY, tileSize + 1, tileSize + 1);
      posX += tileSize;
    }
    posX = 0;
    posY += tileSize;
  }
  posX = 0;
  posY = 0;
}

function drawCoin() {
  ctx.drawImage(coin, 100, 100, 16, 16);
  if (charX < 120 && charY < 120 && charX > 44 && charY > 80) {
    points++;
  }
  ctx.font = "20px Georgia";
  ctx.fillText(points, 10, 50);
}

function drawChar(direction, x, y, animation) {
  if (idle) {
    if (direction == "right") {
      ctx.drawImage(idle_right, Math.floor(frame) * 8, 0, 8, 8, charX, charY, charWidth, charHeight );
    }
    else if (direction == "left") {
      ctx.drawImage(idle_left, Math.floor(frame) * 8, 0, 8, 8, charX, charY, charWidth, charHeight );
    }
    else if (direction == "down") {
      ctx.drawImage(idle_down, Math.floor(frame) * 8, 0, 8, 8, charX, charY, charWidth, charHeight );
    }
    else if (direction == "up") {
      ctx.drawImage(idle_up, Math.floor(frame) * 8, 0, 8, 8, charX, charY, charWidth, charHeight );
    }
  } else {
    if (direction == "right") {
      ctx.drawImage(walk_right, Math.floor(frame) * 8, 0, 8, 8, charX, charY, charWidth, charHeight );
    }
    else if (direction == "left") {
      ctx.drawImage(walk_left, Math.floor(frame) * 8, 0, 8, 8, charX, charY, charWidth, charHeight );
    }
    else if (direction == "down") {
      ctx.drawImage(walk_down, Math.floor(frame) * 8, 0, 8, 8, charX, charY, charWidth, charHeight );
    }
    else if (direction == "up") {
      ctx.drawImage(walk_up, Math.floor(frame) * 8, 0, 8, 8, charX, charY, charWidth, charHeight );
    }
  }
}

function drawCrossHair() {
  ctx.drawImage(crosshair, mousePosX + camX - 7 / 2 * 8, mousePosY + camY - 7 / 2 * 8, 7 * 8, 7 * 8)
}

// gameplay functions

function walk() {
  if (upPressed && !downPressed) {
    idleY = false;
    charVelY = -walkSpeed;
    direction = "up";
  } else if (downPressed && !upPressed) {
    idleY = false;
    charVelY = walkSpeed;
    direction = "down";
  } else {
    charVelY = 0;
    idleY = true;
  }

  if (rightPressed && !leftPressed) {
    idleX = false;
    charVelX = walkSpeed;
    direction = "right";
  } else if (leftPressed && !rightPressed) {
    idleX = false;
    charVelX = -walkSpeed;
    direction = "left";
  } else {
    charVelX = 0;
    idleX = true;
  }

  if (mouseDown) {
    //TODO: get direction of mouse in comparison of charX, charY
    
  }

  if (idleX && idleY) {
    idle = true;
  } else {
    idle = false;
  }
  if (charVelX != 0 && charVelY != 0) {
    if (charVelX > 0) {
      charVelX = walkSpeed * 0.7;
    } else {
      charVelX = -walkSpeed * 0.7;
    }
    if (charVelY > 0) {
      charVelY = walkSpeed * 0.7;
    } else {
      charVelY = -walkSpeed * 0.7;
    }
  }

  charY += charVelY;
  charX += charVelX;

  if (charX + charWidth > mapSizeX) {
    charX = mapSizeX - charWidth;
  } else if (charX < 0) {
    charX = 0;
  }
  if (charY + charHeight > mapSizeY) {
    charY = mapSizeY - charHeight;
  } else if (charY < 0) {
    charY = 0;
  }

  if (frame + frameAdd < 4) {
    frame += frameAdd;
  }else{
    frame = 0;
  }
  drawChar(direction);
}

// viewpoint, camera

function viewPoint() {
  camX = charX + charWidth / 2 - canvas.width / 2;
  camY = charY + charHeight / 2 - canvas.height / 2;

  if (camX > offsetMaxX) {
    camX = offsetMaxX;
  } else if (camX < offsetMinX) {
    camX = offsetMinX;
  }
  if (camY > offsetMaxY) {
    camY = offsetMaxY;
  } else if (camY < offsetMinY) {
    camY = offsetMinY;
  }
  ctx.translate(-camX, -camY);
}

// update, tick

function update() {
  //TODO:10 slå med musklick/space
  //TODO:20 slåanimation
  //TODO:0 enemies & HP
  ctx.save();
  viewPoint();
  ctx.clearRect(-camX, -camY, canvas.width, canvas.height); //Clears viewPoint
  drawMap();
  drawCoin();
  walk();
  ctx.fillText(camX + ", " + camY, camX + 100, camY + 100);
  drawCrossHair();
  ctx.fillText(charX + ", " + charY, 200, 200);
  ctx.restore();
}

setInterval(update, 1000/fps);
