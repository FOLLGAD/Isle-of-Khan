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
