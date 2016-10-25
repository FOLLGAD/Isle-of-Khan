let col = require('./collision.js');

let canActive = true;
let slowingF = 0.9;
exports.Enemy = function (posX, posY, width, height) {
  this.posX = posX;
  this.posY = posY;
  this.velX = 0;
  this.velY = 0;
  this.accX = 0;
  this.accY = 0;
  if (!!width) {
    this.width = width;
  } else {
    this.width = 64;
  }
  if (!!height) {
    this.height = height;
  } else {
    this.height = 64;
  }
  this.active = false;
  this.speed = 0.5;
  this.maxSpeed = 10;
  this.hp = 10;
  this.dmg = 1;
  this.noticeDistance = 1000;
  this.loseDistance = this.noticeDistance + 200;
  this.canHitPlayer = 0;
  this.dmgAnim = 0;
  this.img = "enemy";
  this.canActive = true;
  this.collision = function(i, j, colDistanceX, colDistanceY) {
    if (Math.abs(colDistanceX) < Math.abs(colDistanceY)) {
      // Flyttas till ner/upp , Y-led
      this.accY = 0;
      if (colDistanceY > 0) {
        this.posY = j * tileSize - this.width;
      } else {
        this.posY = j * tileSize + tileSize;
      }
    } else if (Math.abs(colDistanceX) > Math.abs(colDistanceY)) {
      // Flyttas till höger/vänster , X-led
      this.accX = 0;
      if (colDistanceX > 0) {
        this.posX = i * tileSize - this.height;
      } else {
        this.posX = i * tileSize + tileSize;
      }
    }
  };
  this.getDamaged = function(direction, dmg, knockback) {
    this.hp -= dmg;
    this.velX += Math.sin(direction) * knockback;
    this.velY += Math.cos(direction) * knockback;
    if (this.hp <= 0) {
      console.log("splicing");
      let indx = enemies.indexOf(this);
      enemies.splice(indx, 1);
    }
    this.dmgAnim = 30;
  };
};

exports.tickEnemies = function (enemies, chars, deltaTime) {
  for (let i = 0; i < enemies.length; i++) {
    if (Math.abs(enemies[i].posX - chars.posX) < chars.width && Math.abs(enemies[i].posY - chars.posY) < chars.height) {
      enemies[i].active = false;
    } else if (Math.abs(enemies[i].posX - chars.posX) < enemies[i].noticeDistance && Math.abs(enemies[i].posY - chars.posY) < enemies[i].noticeDistance) {
      enemies[i].active = true;
    } else if (enemies[i].active && (Math.abs(enemies[i].posX - chars.posX) > enemies[i].loseDistance && Math.abs(enemies[i].posY - chars.posY) < enemies[i].loseDistance)) {
      enemies[i].active = false;
    }
    if (!!chars.real) {
      enemies[i].active = false;
    }

    if (enemies[i].active && enemies[i].canActive) {
      let direction = Math.atan2(-chars.posX - chars.width / 2 + enemies[i].posX + enemies[i].width / 2, -chars.posY - chars.height / 2 + enemies[i].posY + enemies[i].height / 2);
      enemies[i].accX = Math.sin(direction) * enemies[i].speed;
      enemies[i].accY = Math.cos(direction) * enemies[i].speed;
    } else {
      enemies[i].accX = 0;
      enemies[i].accY = 0;
    }

    enemies[i].velX *= slowingF;
    enemies[i].velY *= slowingF;

    if (Math.abs(enemies[i].velX) < 0.01) {
      enemies[i].velX = 0;
    }
    if (Math.abs(enemies[i].velY) < 0.01) {
      enemies[i].velY = 0;
    }

    enemies[i].velX += enemies[i].accX * deltaTime / 20;
    enemies[i].velY += enemies[i].accY * deltaTime / 20;

    enemies[i].posX -= enemies[i].velX * deltaTime / 20;
    enemies[i].posY -= enemies[i].velY * deltaTime / 20;

    col.checkObjectCollision(enemies[i]);
    for (let j = 0; j < chars.length; j++) {
      col.checkForPlayerDmg(enemies[i], chars[j]);
    }
    if (enemies[i].hp <= 0) {
      enemies.splice(i, 1);
    }
  }
  //TODO:2 Move idly about when out of range
  //TODO:3 Avoid obstacles to find a path to the player

};

function toggleEnemies() {
    canActive = !canActive;
}
