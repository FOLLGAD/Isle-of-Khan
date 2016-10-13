let col = require('./collision.js');
let map = require('./map.js');

let tileSize = 64;

exports.Character = function (id, posX, posY, username) {
  this.id = id;
  this.username = username;
  this.posX = posX;
  this.posY = posY;
  this.height = 64;
  this.width = 64;
  this.velX = 0;
  this.velY = 0;
  this.coins = 0;
  this.kills = 0;
  this.deaths = 0;
  //walkspeed default = 7
  this.walkSpeed = 8;
  this.direction = "up";
  this.hp = 10;
  this.idle = true;
  this.attacking = false;
  this.canSwim = false;
  this.knockBack = 1;
  this.walkingUp = false;
  this.walkingLeft = false;
  this.walkingDown = false;
  this.walkingRight = false;
  // Amount of inaccuracy for the bow; default = 0.05
  this.bowInaccuracy = 0;
  this.activationDelay = 0;
  this.lastShot = 0;
  // tid som char går sakta efter att ha avfyrat bågen
  this.activationSlowdownTime = this.activationDelay * 1.1;
  this.tick = function(deltaTime) {
    this.walk(deltaTime);
    if (this.hp <= 0) {
      this.respawn();
      this.hp = 10;
    }
    if (this.walkingUp && !this.walkingDown) {
      this.velX = -this.walkSpeed * deltaTime / 20;
    } else if (this.walkingDown && !this.walkingUp) {
      this.velX = this.walkSpeed * deltaTime / 20;
    }
    if (this.walkingLeft && !this.walkingRight) {
      this.velY = -this.walkSpeed * deltaTime / 20;
    } else if (this.walkingRight && !this.walkingLeft) {
      this.velY = this.walkSpeed * deltaTime / 20;
    }
    col.checkObjectCollision(this);
  };
  this.respawn = function() {
    do {
      //var spawnX = Math.random() * map.riverMap.width * 64;
      //var spawnY = Math.random() * map.riverMap.height * 64;
      var spawnY = 600;
      var spawnX = 600;

    }
    while(col.areTilesFree(spawnX, spawnY, 64, 64));
    this.posX = spawnX;
    this.posY = spawnY;
  };
  this.getDamaged = function (direction, dmg, entity) {
    this.hp -= dmg;
    let kb;
    if (Boolean(entity.knockback)) {
      kb = entity.knockback;
    } else {
      kb = 1;
    }
    this.velX += Math.sin(direction) * kb;
    this.velY += Math.cos(direction) * kb;
    if (this.hp <= 0) {
      this.hp = 10;
      this.deaths++;
      this.respawn();
      if (Boolean(entity.id)) {
        entity.kills++;
      }
    }
  }
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
  this.walk = function(deltaTime) {
    if (this.walkingUp && !this.walkingDown) {
      this.velY = -this.walkSpeed;
      this.direction = "up";
    } else if (this.walkingDown && !this.walkingUp) {
      this.velY = this.walkSpeed;
      this.direction = "down";
    } else {
      this.velY = 0;
    }
    if (this.walkingRight && !this.walkingLeft) {
      this.velX = this.walkSpeed;
      this.direction = "right";
    } else if (this.walkingLeft && !this.walkingRight) {
      this.velX = -this.walkSpeed;
      this.direction = "left";
    } else {
      this.velX = 0;
    }
    if (this.spacePressed) {
      this.attacking = true;
    } else if (this.attackingFrame <= 0 && !this.spacePressed){
      this.attacking = false;
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
    this.velX *= deltaTime / 20;
    this.velY *= deltaTime / 20;

    if (this.attacking) {
      this.posX += this.velX * 0.5;
      this.posY += this.velY * 0.5;
    } else {
      this.posX += this.velX;
      this.posY += this.velY;
    }
  }
  this.activate = function() {
    let d = new Date();
    if (mouseDown) {
      if (bowSelected) {
        if (lastActivate + this.activationDelay < d.getTime()) {
          let direction = Math.atan2(camX - this.posX - this.width / 2 + mousePosX, camY - this.posY - this.height/2 + mousePosY);
          direction += (getRandom()*2 - 1) * this.bowInaccuracy;
          arrows.push(new Arrow(this.posX + this.width / 2, this.posY + this.height / 2, direction));
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
