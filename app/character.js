// this object, för storage av alla tillstånd av char

let chars = [];

let arrowSpeed = 20;

let charSpawnX = mapSizeX / 2;
let charSpawnY = mapSizeY / 2;

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
  this.activationDelay = 0;
  // tid som char går sakta efter att ha avfyrat bågen
  this.activationSlowdownTime = this.activationDelay + 100;
  this.tick = function() {
    this.walk();
    if (this.hp <= 0) {
      this.respawn();
      this.hp = 10;
    }
    checkObjectCollision(this);
    if (!menuActive) {
      this.activate();
    }
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
      this.velY = 0;
    } else if (Math.abs(colDistanceX) > Math.abs(colDistanceY)) {
      // Flyttas till höger/vänster , X-led
      if (colDistanceX > 0) {
        this.posX = i * tileSize - this.height;
      } else {
        this.posX = i * tileSize + tileSize;
      }
      this.velX = 0;
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
          io.emit("arrow", direction);
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
