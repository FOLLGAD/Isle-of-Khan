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

  if (spacePressed) {
    attacking = true;
  } else if (attackingFrame == 0 && !spacePressed){
    attacking = false;
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

  // Sätter position på karaktär beroende på charVel.
  if(attacking) {
    charX += charVelX * 0.5;
    charY += charVelY * 0.5;
  } else {
    charX += charVelX;
    charY += charVelY;
  }

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

  if (!idle && frame + frameAdd < 4) {
    frame += frameAdd;
  }else{
    frame = 0;
  }

  if (attackingFrame + frameAdd * attackingSpeed < 3 && attacking) {
    attackingFrame += frameAdd * attackingSpeed;
  } else if (attackingFrame + frameAdd * attackingSpeed >= 3) {
    attackingFrame = 0;
    attacking = false;
  }

  if (attacking) {
    attackingArea();
  }
}
function drawChar() {
  //TODO:0 lägga till indivuella ben, så man kan gå &  slå samtidigt; (typ fixat, men funkar inte)
  if (attacking) {
    if (direction == "right") {
      if (Math.floor(frame) == 1 || Math.floor(frame) == 3) {
        ctx.drawImage(legs, 0 * 8, 0, 8, 8, charX, charY, charWidth*2, charHeight*2 );
        console.log("fameboi");
      }
      ctx.drawImage(attacking_right, 0, Math.floor(attackingFrame) * 8, 16, 8, charX, charY, charWidth * 2, charHeight);
    }
    else if (direction == "left") {
      if (Math.floor(frame) == 1 || Math.floor(frame) == 3) {
        ctx.drawImage(legs, Math.floor(frame/2) * 8, 0, 8, 8, charX, charY, charWidth, charHeight );
      }
      ctx.drawImage(attacking_left, 0, Math.floor(attackingFrame) * 8, 16, 8, charX - charWidth, charY, charWidth * 2, charHeight);
    }
    else if (direction == "down") {
      if (Math.floor(frame) == 1 || Math.floor(frame) == 3) {
        ctx.drawImage(legs, Math.floor(frame/2) * 8, 0, 8, 8, charX, charY, charWidth, charHeight );
      }
      ctx.drawImage(attacking_down, Math.floor(attackingFrame) * 8, 0, 8, 16, charX, charY, charWidth, charHeight * 2);
    }
    else if (direction == "up") {
      if (Math.floor(frame) == 1 || Math.floor(frame) == 3) {
        ctx.drawImage(legs, Math.floor(frame/2) * 8, 0, 8, 8, charX, charY, charWidth, charHeight );
      }
      ctx.drawImage(attacking_up, Math.floor(attackingFrame) * 8, 0, 8, 16, charX, charY - charHeight, charWidth, charHeight * 2);
    }
  } else if (idle) {
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

function drawHp() {
  ctx.beginPath();
  ctx.fillStyle = "#4400ff";
  ctx.fillRect(charX - 20, charY + charWidth / 2 - 100, hp * 10, 10);
  ctx.fillStyle = "#000";
  ctx.closePath();
}

function attackingArea(){
  if (direction == "up") {
    attackingX = charX;
    attackingY = charY - charHeight;
  } else if (direction == "down") {
    attackingX = charX;
    attackingY = charY + charHeight;
  } else if (direction == "right") {
    attackingX = charX + charWidth;
    attackingY = charY;
  } else if (direction == "left") {
    attackingX = charX - charWidth;
    attackingY = charY;
  }

    //ctx.fillStyle = "#000";
    //ctx.fillRect(attackingX, attackingY, 8*8, 8*8);
}
