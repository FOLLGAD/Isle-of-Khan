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