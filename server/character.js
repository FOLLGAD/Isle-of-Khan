let col = require('./collision.js');
let map = require('./map.js');
let serv = require('../server.js');

let tileSize = 64;

exports.Character = function (id, posX, posY, username, characterClass) {
  this.id = id;
  this.username = username;
  this.class = characterClass;
  this.posX = posX;
  this.posY = posY;
  this.height = 64;
  this.width = 64;
  this.velX = 0;
  this.velY = 0;
  this.coins = 0;
  this.kills = 0;
  this.deaths = 0;
  this.aimDirection = 0;
  this.walking = false;
  //walkspeed default = 7
  this.walkSpeed = 0.5;
  this.hp = 100;
  this.idle = true;
  this.attacking = false;
  this.canSwim = false;
  this.knockBack = 1;
  this.maxhp = 100;
  this.intervalStorage;
  this.timeoutStorage;
  // Amount of inaccuracy for the bow; default = 0.05
  this.bowInaccuracy = 0;
  this.activationDelay = 0;
  this.lastShot = 0;
  // tid som char går sakta efter att ha avfyrat bågen
  this.activationSlowdownTime = this.activationDelay * 1.1;
  this.tick = function(deltaTime) {
    this.walk(deltaTime);
    col.checkObjectCollision(this);
  };
  this.respawn = function() {
    do {
      var spawnX = Math.random() * map.riverMap.width * 64;
      var spawnY = Math.random() * map.riverMap.height * 64;
      // var spawnY = 600;
      // var spawnX = 600;
      this.hp = this.maxhp;
    }
    while (col.areTilesFree(spawnX, spawnY, 64, 64));
    this.posX = spawnX;
    this.posY = spawnY;
  };

  this.attack = function (data) {
    switch(this.class) {
      case "archer":
        console.log(data);
        clearInterval(this.intervalStorage);
        clearTimeout(this.timeoutStorage);
        if (data.state) {
          this.aimDirection = data.direction;
          startShooting(this);
        }
        break;
      case "warrior":
        if (!this.attacking) {
        }
        break;
      case "mage":
        if (!this.attacking) {
        }
        break;
    }
  }

  this.getDamaged = function (direction, dmg, entity, knockback) {
    this.hp -= dmg;
    let kb;
    if (knockback != 'undefined') {
      kb = knockback;
    } else if (entity.hasOwnProperty(knockback)) {
      kb = entity.knockback;
    } else {
      kb = 1;
    }
    this.velX += Math.sin(direction) * kb;
    this.velY += Math.cos(direction) * kb;
    if (this.hp <= 0) { //If character dies
      this.deaths++;
      this.respawn();
      if (entity.hasOwnProperty('id') && entity.id != this.id) {
        entity.kills++;
        //Send kill message
        serv.emit('death-msg', { killer: entity.username, victim: this.username });
      }else if (entity.hasOwnProperty('id')){
        //Send sucide message
        serv.emit('death-msg', { killer: entity.username, victim: this.username });
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
    } else if (Math.abs(colDistanceX) >= Math.abs(colDistanceY)) {
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
    } else if (this.walkingDown && !this.walkingUp) {
      this.velY = this.walkSpeed;
    } else {
      this.velY = 0;
    }
    if (this.walkingRight && !this.walkingLeft) {
      this.velX = this.walkSpeed;
    } else if (this.walkingLeft && !this.walkingRight) {
      this.velX = -this.walkSpeed;
    } else {
      this.velX = 0;
    }
    if (this.spacePressed) {
      this.attacking = true;
    } else if (this.attackingFrame <= 0 && !this.spacePressed){
      this.attacking = false;
    }
    if (this.velX != 0 && this.velY != 0) {
      this.velX *= 0.7;
      this.velY *= 0.7;
    }

    if (this.attacking) {
      this.velX *= 0.5;
      this.velY *= 0.5;
    }
    this.posX += this.velX * deltaTime;
    this.posY += this.velY * deltaTime;
    this.walking = this.walkingRight || this.walkingLeft || this.walkingUp || this.walkingDown;
  }
}

function startShooting(char) {
  if (Date.now() - char.lastShot > 400) {
    console.log("if passed");
    serv.shoot(char);
    // char.intervalStorage = setInterval(serv.shoot, 400, char);
  } else {
    console.log("else permit");
    char.timeoutStorage = setTimeout(function() {
      serv.shoot(char);
      char.intervalStorage = setInterval(serv.shoot, 400, char);
    }, 400 - Date.now() + char.lastShot);
  }
}
