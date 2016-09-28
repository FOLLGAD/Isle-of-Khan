// Character object, för storage av alla tillstånd av char
let Character = {
  posX: charSpawnX,
  posY: charSpawnY,
  height: 64,
  width: 64,
  velX: 0,
  velY: 0,

  walkSpeed: 7,
  direction: "up",
  hp: 10,
  idle: true,

  img: char,

  spawnX: charSpawnX,
  spawnY: charSpawnY,

  attacking: false,
  canSwim: false,

  // Amount of inaccuracy for the bow, default = 0.05
  bowInaccuracy: 0.0,

  // activation delay för bågen i millisekunder, default = 200
  activationDelay: 200,
  // tid som char går sakta efter att ha avfyrat bågen
  activationSlowdownTime: 250,

  tick: function() {
    walk();
    if (Character.hp <= 0) {
      Character.respawn();
      Character.hp = 10;
    }
    checkObjectCollision(Character);
  },

  respawn: function() {
    Character.posX = Character.spawnX;
    Character.posY = Character.spawnY;
  },

  collision: function(i, j, colDistanceX, colDistanceY) {
    if (Math.abs(colDistanceX) < Math.abs(colDistanceY)) {
      // Flyttas till ner/upp , Y-led
      if (colDistanceY > 0) {
        Character.posY = j * tileSize - Character.width;
      } else {
        Character.posY = j * tileSize + tileSize;
      }
    } else if (Math.abs(colDistanceX) > Math.abs(colDistanceY)) {
      // Flyttas till höger/vänster , X-led
      if (colDistanceX > 0) {
        Character.posX = i * tileSize - Character.height;
      } else {
        Character.posX = i * tileSize + tileSize;
      }
    }
  }
}

// TODO: Fixa karaktärens jittery movement när man ändrar hastighet

function walk() {
  if (upPressed && !downPressed) {
    idleY = false;
    Character.velY = -Character.walkSpeed;
    Character.direction = "up";
  } else if (downPressed && !upPressed) {
    idleY = false;
    Character.velY = Character.walkSpeed;
    Character.direction = "down";
  } else {
    Character.velY = 0;
    idleY = true;
  }
  if (rightPressed && !leftPressed) {
    idleX = false;
    Character.velX = Character.walkSpeed;
    Character.direction = "right";
  } else if (leftPressed && !rightPressed) {
    idleX = false;
    Character.velX = -Character.walkSpeed;
    Character.direction = "left";
  } else {
    Character.velX = 0;
    idleX = true;
  }

  if (spacePressed) {
    Character.attacking = true;
  } else if (attackingFrame == 0 && !spacePressed){
    Character.attacking = false;
  }

  if (idleX && idleY) {
    Character.idle = true;
  } else {
    Character.idle = false;
  }

  if (Character.velX != 0 && Character.velY != 0) {
    if (Character.velX > 0) {
      Character.velX = Character.walkSpeed * 0.7;
    } else {
      Character.velX = -Character.walkSpeed * 0.7;
    }
    if (Character.velY > 0) {
      Character.velY = Character.walkSpeed * 0.7;
    } else {
      Character.velY = -Character.walkSpeed * 0.7;
    }
  }

  // Sätter position på karaktär beroende på charVel.
  let d = new Date();
  if(Character.attacking || lastActivate + Character.activationSlowdownTime > d.getTime()) {
    Character.posX += Character.velX * 0.5;
    Character.posY += Character.velY * 0.5;
  } else {
    Character.posX += Character.velX;
    Character.posY += Character.velY;
  }

  if (Character.posX + Character.width > mapSizeX) {
    Character.posX = mapSizeX - Character.width;
  } else if (Character.posX < 0) {
    Character.posX = 0;
  }
  if (Character.posY + Character.height > mapSizeY) {
    Character.posY = mapSizeY - Character.height;
  } else if (Character.posY < 0) {
    Character.posY = 0;
  }

  if (!Character.idle && frame + frameAdd < 4) {
    frame += frameAdd;
  }else{
    frame = 0;
  }

  if (attackingFrame + frameAdd * attackingSpeed < 3 && Character.attacking) {
    attackingFrame += frameAdd * attackingSpeed;
  } else if (attackingFrame + frameAdd * attackingSpeed >= 3) {
    attackingFrame = 0;
    Character.attacking = false;
  }

  if (Character.attacking) {
    attackingArea();
  }
}

function activate() {
  let d = new Date();
  if (mouseDown) {
    if (lastActivate + Character.activationDelay < d.getTime()) {
      if (bowSelected) {
        let direction = Math.atan2(camX - Character.posX - Character.width / 2 + mousePosX, camY - Character.posY - Character.height/2 + mousePosY);
        direction += (getRandom()*2 - 1) * Character.bowInaccuracy;
        arrows.push(new Arrow(Character.posX + Character.width / 2, Character.posY + Character.height / 2, direction, arrowSpeed));
        lastActivate = d.getTime();
      }
    }
  }
}

function drawChar() {
/*
  if (Character.attacking) {
    if (Character.direction == "right") {
      if (Math.floor(frame) == 1 || Math.floor(frame) == 3) {
        console.log("fameboi");
      }
      ctx.drawImage(attacking_right, 0, Math.floor(attackingFrame) * 8, 16, 8, Character.posX, Character.posY, Character.width * 2, Character.height);
    }
    else if (Character.direction == "left") {
      if (Math.floor(frame) == 1 || Math.floor(frame) == 3) {
        ctx.drawImage(legs, Math.floor(frame/2) * 8, 0, 8, 8, Character.posX, Character.posY, Character.width, Character.height );
      }
      ctx.drawImage(attacking_left, 0, Math.floor(attackingFrame) * 8, 16, 8, Character.posX - Character.width, Character.posY, Character.width * 2, Character.height);
    }
    else if (Character.direction == "down") {
      if (Math.floor(frame) == 1 || Math.floor(frame) == 3) {
        ctx.drawImage(legs, Math.floor(frame/2) * 8, 0, 8, 8, Character.posX, Character.posY, Character.width, Character.height );
      }
      ctx.drawImage(attacking_down, Math.floor(attackingFrame) * 8, 0, 8, 16, Character.posX, Character.posY, Character.width, Character.height * 2);
    }
    else if (Character.direction == "up") {
      if (Math.floor(frame) == 1 || Math.floor(frame) == 3) {
        ctx.drawImage(legs, Math.floor(frame/2) * 8, 0, 8, 8, Character.posX, Character.posY, Character.width, Character.height );
      }
      ctx.drawImage(attacking_up, Math.floor(attackingFrame) * 8, 0, 8, 16, Character.posX, Character.posY - Character.height, Character.width, Character.height * 2);
    }
  } else if (Character.idle) {
    if (Character.direction == "right") {
      ctx.drawImage(idle_right, Math.floor(frame) * 8, 0, 8, 8, Character.posX, Character.posY, Character.width, Character.height );
    }
    else if (Character.direction == "left") {
      ctx.drawImage(idle_left, Math.floor(frame) * 8, 0, 8, 8, Character.posX, Character.posY, Character.width, Character.height );
    }
    else if (Character.direction == "down") {
      ctx.drawImage(idle_down, Math.floor(frame) * 8, 0, 8, 8, Character.posX, Character.posY, Character.width, Character.height );
    }
    else if (Character.direction == "up") {
      ctx.drawImage(idle_up, Math.floor(frame) * 8, 0, 8, 8, Character.posX, Character.posY, Character.width, Character.height );
    }
  } else {
    if (Character.direction == "right") {
      ctx.drawImage(walk_right, Math.floor(frame) * 8, 0, 8, 8, Character.posX, Character.posY, Character.width, Character.height );
    }
    else if (Character.direction == "left") {
      ctx.drawImage(walk_left, Math.floor(frame) * 8, 0, 8, 8, Character.posX, Character.posY, Character.width, Character.height );
    }
    else if (Character.direction == "down") {
      ctx.drawImage(walk_down, Math.floor(frame) * 8, 0, 8, 8, Character.posX, Character.posY, Character.width, Character.height );
    }
    else if (Character.direction == "up") {
      ctx.drawImage(walk_up, Math.floor(frame) * 8, 0, 8, 8, Character.posX, Character.posY, Character.width, Character.height );
    }
  }
*/

  ctx.drawImage(char, Character.posX, Character.posY - Character.height, Character.width, Character.height * 2);
}

function attackingArea(){
  if (Character.direction == "up") {
    attackingX = Character.posX;
    attackingY = Character.posY - Character.height;
  } else if (Character.direction == "down") {
    attackingX = Character.posX;
    attackingY = Character.posY + Character.height;
  } else if (Character.direction == "right") {
    attackingX = Character.posX + Character.width;
    attackingY = Character.posY;
  } else if (Character.direction == "left") {
    attackingX = Character.posX - Character.width;
    attackingY = Character.posY;
  }
/*
    ctx.fillStyle = "#000";
    ctx.fillRect(attackingX, attackingY, 8*8, 8*8);
*/
}
