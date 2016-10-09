let col = require('./collision.js');

let tileSize = 64;

exports.Arrow = function (posX, posY, direction, id) {
  this.owner = id;
  this.direction = direction;
  this.posX = posX;
  this.posY = posY;
  this.velX = 10 * Math.sin(direction);
  this.velY = 10 * Math.cos(direction);
  this.posX0 = this.posX;
  this.posY0 = this.posY;
  this.width = 16;
  this.height = 32;
  this.img = "arrow";
  this.canSwim = true;
  this.penetration = 1;
  this.dmg = 5;
  this.range = 0;
  this.collision = function(arrows) {
    let index = arrows.indexOf(this);
    arrows.splice(index, 1);
    return true;
  }
  this.draw = function (img) {
    ctx.save();
    ctx.translate(this.posX, this.posY);
    ctx.rotate(Math.PI - this.direction);
    ctx.drawImage(img, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
  this.tick = function (deltaTime) {
    this.posX += this.velX * deltaTime / 20;
    this.posY += this.velY * deltaTime / 20;
  }
  this.onPenetration = function (subtract, arrows) {
    this.penetration -= subtract;
    if (this.penetration < 0) {
      indx = arrows.indexOf(this);
      arrows.splice(indx, 1);
    }
  }
}

exports.tickArrows = function (arrows, deltaTime, enemies, chars) {
  // check collision with enemies
  for (i = 0; i < arrows.length; i++) {
    arrows[i].tick(deltaTime);
    col.checkObjectCollision(arrows[i]);
  }
  for (i = 0; i < enemies.length; i++) {

  }
  for (i = 0; i < arrows.length; i++) {
    if ((arrows[i].posX < arrows[i].posX0 - arrows[i].range
      || arrows[i].posX > arrows[i].posX0 + arrows[i].range
      || arrows[i].posY < arrows[i].posY0 - arrows[i].range
      || arrows[i].posY > arrows[i].posY0 + arrows[i].range
    ) && arrows[i].range != 0) {
      arrows.splice(i, 1);
    }
  }
}
function arrowCollision (arrow, entity) {
  if (entity.posX < arrow.posX + arrow.width && entity.posX + entity.width > arrow.posX && entity.posY < arrow.posY + arrow.height && entity.posY + entity.height > arrow.posY && entity.id !== arrow.owner) {
    entity.getDamaged(arrow.dmg, arrow.direction, chars[arrow.owner].knockBack);
    arrow.onPenetration(1);
  }
}

exports.Bomb = function (posX, posY, direction, inivelX, inivelY, id) {
  this.owner = id;
  this.posX = posX;
  this.posY = posY;
  this.width = 64;
  this.height = 64;
  this.speed = 30;
  this.velX = Math.sin(direction) * this.speed + inivelX;
  this.velY = Math.cos(direction) * this.speed + inivelY;
  this.img = "bomb";
  this.timer = 75;
  this.canSwim = false;
  this.exploded = false;
  this.radius = 250;
  this.dmg = 0.2;
  this.tick = function(bombs, deltaTime, enemies, chars) {
    this.timer -= deltaTime / 40;
    if (this.timer > 0) {
      this.posX += this.velX * deltaTime / 40;
      this.posY += this.velY * deltaTime / 40;
      this.velX *= 0.8;
      this.velY *= 0.8;
      col.checkObjectCollision(this);
    } else if (this.timer < -30) {
      let indx = bombs.indexOf(this);
      bombs.splice(indx, 1);
    } else if (!this.exploded) {
      this.exploded = true;
      this.explode(enemies, chars);
    }
  };

  this.explode = function(enemies, chars) {
    for (let i = 0; i < enemies.length; i++) {
      col.checkCircularEntityCollision(this, enemies[i]);
    }
    for (let i in chars) {
      col.checkCircularEntityCollision(this, chars[i]);
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
  }
}

function spawnBomb() {
  let direx = Math.atan2(camX - chars[0].posX - chars[0].width / 2 + mousePosX, camY - chars[0].posY - chars[0].height/2 + mousePosY);
  bombs.push(new Bomb(chars[0].posX, chars[0].posY, direx, chars[0].velX, chars[0].velY));
}

exports.tickBombs = function (bombs, deltaTime, enemies, chars) {
  for (i = 0; i < bombs.length; i++) {
    bombs[i].tick(bombs, deltaTime, enemies, chars);
  }
}
