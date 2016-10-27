let col = require('./collision.js');

let tileSize = 64;

exports.Arrow = function (posX, posY, direction, id) {
  this.owner = id;
  this.direction = direction;
  this.posX = posX;
  this.posY = posY;
  this.velX = 2 * Math.sin(direction);
  this.velY = 2 * Math.cos(direction);
  this.posX0 = this.posX;
  this.posY0 = this.posY;
  this.width = 16;
  this.height = 32;
  this.canSwim = true;
  this.penetration = 1;
  this.dmg = 10;
  this.range = 0;
  this.collision = function(arrows) {
    let index = arrows.indexOf(this);
    arrows.splice(index, 1);
    return true;
  };
  this.tick = function (arrows, deltaTime) {
    this.posX += this.velX * deltaTime;
    this.posY += this.velY * deltaTime;
  };
  this.onPenetration = function (subtract, arrows) {
    this.penetration -= subtract;
    if (this.penetration < 0 || subtract === -1) {
      indx = arrows.indexOf(this);
      arrows.splice(indx, 1);
    }
  };
};

exports.tickArrows = function (arrows, deltaTime, enemies, chars) {
  for (i = 0; i < arrows.length; i++) {
    if (!chars.hasOwnProperty([arrows[i].owner])) {
      arrows[i].onPenetration(-1, arrows);
    }
  }
  for (i = 0; i < arrows.length; i++) {
    arrows[i].tick(arrows, deltaTime);
    col.checkArrowTileCollision(arrows[i], arrows);
  }
  // for (let i = 0; i < enemies.length; i++) {
  //
  // }
  arrowCollision(arrows, chars);
};
function arrowCollision (arrows, entities) {
  let knockback = 5;
  for (let prop in entities) {
    for (let i = 0; i < arrows.length; i++) {
      if (entities[prop].id !== arrows[i].owner && entities[prop].posX < arrows[i].posX + arrows[i].width && entities[prop].posX + entities[prop].width > arrows[i].posX && entities[prop].posY < arrows[i].posY + arrows[i].height && entities[prop].posY + entities[prop].height > arrows[i].posY) {
        entities[prop].getDamaged(arrows[i].direction, arrows[i].dmg, entities[arrows[i].owner], knockback);
        arrows[i].onPenetration(1, arrows);
      }
    }
  }
}

exports.Bomb = function (posX, posY, direction, inivelX, inivelY, id, vel) {
  this.owner = id;
  this.posX = posX;
  this.posY = posY;
  this.width = 64;
  this.height = 64;
  this.speed = 5;
  this.velX = Math.sin(direction) * vel * 0.5;
  this.velY = Math.cos(direction) * vel * 0.5;
  this.timer = 650;
  this.canSwim = false;
  this.radius = 250;
  this.dmg = 0.2;
  this.tick = function(bombs, deltaTime, enemies, chars, pow) {
    this.timer -= deltaTime;
    if (this.timer > 0) {
      this.velX *= pow;
      this.velY *= pow;
      this.posX += this.velX * deltaTime;
      this.posY += this.velY * deltaTime;
      col.checkObjectCollision(this);
    } else if (!this.exploded) {
      this.explode(enemies, chars);
    } else {
      let indx = bombs.indexOf(this);
      bombs.splice(indx, 1);
    }
  };

  this.explode = function(enemies, chars) {
    this.exploded = true;
    for (let i = 0; i < enemies.length; i++) {
      col.checkCircularEntityCollision(this, enemies[i], chars[this.owner]);
    }
    for (let i in chars) {
      col.checkCircularEntityCollision(this, chars[i], chars[this.owner]);
    }
  };

  this.collision = function(i, j, colDistanceX, colDistanceY) {
    if (Math.abs(colDistanceX) < Math.abs(colDistanceY)) {
      // Flyttas till ner/upp , Y-led
      if (colDistanceY > 0) {
        this.posY = j * tileSize - this.width;
      } else {
        this.posY = j * tileSize + tileSize;
      }
      this.velY = -this.velY;
    } else if (Math.abs(colDistanceX) > Math.abs(colDistanceY)) {
      // Flyttas till höger/vänster , X-led
      if (colDistanceX > 0) {
        this.posX = i * tileSize - this.height;
      } else {
        this.posX = i * tileSize + tileSize;
      }
      this.velX = -this.velX;
    }
  };
};

function spawnBomb() {
  let direx = Math.atan2(camX - chars[0].posX - chars[0].width / 2 + mousePosX, camY - chars[0].posY - chars[0].height/2 + mousePosY);
  bombs.push(new Bomb(chars[0].posX, chars[0].posY, direx, chars[0].velX, chars[0].velY));
}

exports.tickBombs = function (bombs, deltaTime, enemies, chars) {
  let pow = Math.pow(0.995, deltaTime);
  for (i = 0; i < bombs.length; i++) {
    bombs[i].tick(bombs, deltaTime, enemies, chars, pow);
  }
};
