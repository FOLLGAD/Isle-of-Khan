// this object, för storage av alla tillstånd av char

let chars = [];

let arrowSpeed = 20;

function Character() {
  this.posX = charSpawnX;
  this.posY = charSpawnY;
  this.height = 64;
  this.width = 64;
  this.velX = 0;
  this.velY = 0;
  //walkspeed default = 7
  this.walkSpeed = 8;
  this.direction = "up";
  this.hp = 10;
  this.idle = true;
  this.img = char;
  this.spawnX = charSpawnX;
  this.spawnY = charSpawnY;
  this.attacking = false;
  this.canSwim = false;
  this.knockBack = 1;
  // Amount of inaccuracy for the bow; default = 0.05
  this.bowInaccuracy = 0;
  // activation delay för bågen i millisekunder; default = 200
  this.activationDelay = 200;
  // tid som char går sakta efter att ha avfyrat bågen
  this.activationSlowdownTime = 550;
  this.tick = function() {
    this.walk();
    if (this.hp <= 0) {
      this.respawn();
      this.hp = 10;
    }
    checkObjectCollision(this);
    this.activate();
  };

  this.respawn = function() {
    this.posX = this.spawnX;
    this.posY = this.spawnY;
  };

  this.collision = function(i, j, colDistanceX, colDistanceY) {
    if (Math.abs(colDistanceX) < Math.abs(colDistanceY)) {
      // Flyttas till ner/upp , Y-led
      if (colDistanceY > 0) {
        this.posY = j * tileSize - this.width;
      } else {
        this.posY = j * tileSize + tileSize;
      }
    } else if (Math.abs(colDistanceX) > Math.abs(colDistanceY)) {
      // Flyttas till höger/vänster , X-led
      if (colDistanceX > 0) {
        this.posX = i * tileSize - this.height;
      } else {
        this.posX = i * tileSize + tileSize;
      }
    }
  };
  this.draw = function() {
    ctx.drawImage(this.img, this.posX, this.posY - this.height, this.width, this.height * 2);
  };
  this.walk = function() {
    let idleX;
    let idleY;
    if (upPressed && !downPressed) {
      idleY = false;
      this.velY = -this.walkSpeed;
      this.direction = "up";
    } else if (downPressed && !upPressed) {
      idleY = false;
      this.velY = this.walkSpeed;
      this.direction = "down";
    } else {
      this.velY = 0;
      idleY = true;
    }
    if (rightPressed && !leftPressed) {
      idleX = false;
      this.velX = this.walkSpeed;
      this.direction = "right";
    } else if (leftPressed && !rightPressed) {
      idleX = false;
      this.velX = -this.walkSpeed;
      this.direction = "left";
    } else {
      this.velX = 0;
      idleX = true;
    }
    if (spacePressed) {
      this.attacking = true;
    } else if (attackingFrame == 0 && !spacePressed){
      this.attacking = false;
    }
    if (idleX && idleY) {
      this.idle = true;
    } else {
      this.idle = false;
    }
    if (this.velX != 0 && this.velY != 0) {
      if (this.velX > 0) {
        this.velX = this.walkSpeed * 0.7;
      } else {
        this.velX = -this.walkSpeed * 0.7;
      }
      if (this.velY > 0) {
        this.velY = this.walkSpeed * 0.7;
      } else {
        this.velY = -this.walkSpeed * 0.7;
      }
    }
    // Sätter position på karaktär beroende på charVel.
    let d = new Date();
    if(this.attacking || lastActivate + this.activationSlowdownTime > d.getTime()) {
      this.posX += this.velX * 0.5;
      this.posY += this.velY * 0.5;
    } else {
      this.posX += this.velX;
      this.posY += this.velY;
    }
    if (this.posX + this.width > mapSizeX) {
      this.posX = mapSizeX - this.width;
    } else if (this.posX < 0) {
      this.posX = 0;
    }
    if (this.posY + this.height > mapSizeY) {
      this.posY = mapSizeY - this.height;
    } else if (this.posY < 0) {
      this.posY = 0;
    }

    if (!this.idle && frame + frameAdd < 4) {
      frame += frameAdd;
    }else{
      frame = 0;
    }

    if (attackingFrame + frameAdd * attackingSpeed < 3 && this.attacking) {
      attackingFrame += frameAdd * attackingSpeed;
    } else if (attackingFrame + frameAdd * attackingSpeed >= 3) {
      attackingFrame = 0;
      this.attacking = false;
    }
  }

  this.activate = function() {
    let d = new Date();
    if (mouseDown) {
      if (bowSelected) {
        if (lastActivate + this.activationDelay < d.getTime()) {
          let direction = Math.atan2(camX - this.posX - this.width / 2 + mousePosX, camY - this.posY - this.height/2 + mousePosY);
          direction += (getRandom()*2 - 1) * this.bowInaccuracy;
          arrows.push(new Arrow(this.posX + this.width / 2, this.posY + this.height / 2, direction, arrowSpeed));
          lastActivate = d.getTime();
        }
      }
    } else if (spacePressed && lastActivate + 100 < d.getTime()) {
      this.attackingArea();
    }
  }

  this.attackingArea = function() {
    if (this.direction == "up") {
      attackingX = this.posX;
      attackingY = this.posY - this.height;
    } else if (this.direction == "down") {
      attackingX = this.posX;
      attackingY = this.posY + this.height;
    } else if (this.direction == "right") {
      attackingX = this.posX + this.width;
      attackingY = this.posY;
    } else if (this.direction == "left") {
      attackingX = this.posX - this.width;
      attackingY = this.posY;
    }
    ctx.fillStyle = "#000";
    ctx.fillRect(attackingX, attackingY, 8*8, 8*8);
  }
}

chars.push(new Character());

// TODO: Fixa karaktärens jittery movement när man ändrar hastighet




/*
  if (this.attacking) {
    if (this.direction == "right") {
      if (Math.floor(frame) == 1 || Math.floor(frame) == 3) {
        console.log("fameboi");
      }
      ctx.drawImage(attacking_right, 0, Math.floor(attackingFrame) * 8, 16, 8, this.posX, this.posY, this.width * 2, this.height);
    }
    else if (this.direction == "left") {
      if (Math.floor(frame) == 1 || Math.floor(frame) == 3) {
        ctx.drawImage(legs, Math.floor(frame/2) * 8, 0, 8, 8, this.posX, this.posY, this.width, this.height );
      }
      ctx.drawImage(attacking_left, 0, Math.floor(attackingFrame) * 8, 16, 8, this.posX - this.width, this.posY, this.width * 2, this.height);
    }
    else if (this.direction == "down") {
      if (Math.floor(frame) == 1 || Math.floor(frame) == 3) {
        ctx.drawImage(legs, Math.floor(frame/2) * 8, 0, 8, 8, this.posX, this.posY, this.width, this.height );
      }
      ctx.drawImage(attacking_down, Math.floor(attackingFrame) * 8, 0, 8, 16, this.posX, this.posY, this.width, this.height * 2);
    }
    else if (this.direction == "up") {
      if (Math.floor(frame) == 1 || Math.floor(frame) == 3) {
        ctx.drawImage(legs, Math.floor(frame/2) * 8, 0, 8, 8, this.posX, this.posY, this.width, this.height );
      }
      ctx.drawImage(attacking_up, Math.floor(attackingFrame) * 8, 0, 8, 16, this.posX, this.posY - this.height, this.width, this.height * 2);
    }
  } else if (this.idle) {
    if (this.direction == "right") {
      ctx.drawImage(idle_right, Math.floor(frame) * 8, 0, 8, 8, this.posX, this.posY, this.width, this.height );
    }
    else if (this.direction == "left") {
      ctx.drawImage(idle_left, Math.floor(frame) * 8, 0, 8, 8, this.posX, this.posY, this.width, this.height );
    }
    else if (this.direction == "down") {
      ctx.drawImage(idle_down, Math.floor(frame) * 8, 0, 8, 8, this.posX, this.posY, this.width, this.height );
    }
    else if (this.direction == "up") {
      ctx.drawImage(idle_up, Math.floor(frame) * 8, 0, 8, 8, this.posX, this.posY, this.width, this.height );
    }
  } else {
    if (this.direction == "right") {
      ctx.drawImage(walk_right, Math.floor(frame) * 8, 0, 8, 8, this.posX, this.posY, this.width, this.height );
    }
    else if (this.direction == "left") {
      ctx.drawImage(walk_left, Math.floor(frame) * 8, 0, 8, 8, this.posX, this.posY, this.width, this.height );
    }
    else if (this.direction == "down") {
      ctx.drawImage(walk_down, Math.floor(frame) * 8, 0, 8, 8, this.posX, this.posY, this.width, this.height );
    }
    else if (this.direction == "up") {
      ctx.drawImage(walk_up, Math.floor(frame) * 8, 0, 8, 8, this.posX, this.posY, this.width, this.height );
    }
  }
*/
