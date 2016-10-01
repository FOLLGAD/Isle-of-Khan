let canActive = true;
//DONE:40 add enemies;
let enemyWidth = 64;
let enemyHeight = 64;

let slowingF = 0.9;
function Enemy(posX, posY, width, height) {
  this.posX = posX;
  this.posY = posY;
  this.velX = 0;
  this.velY = 0;
  this.accX = 0;
  this.accY = 0;
  if (!!width) {
    this.width = width;
  } else {
    this.width = enemyWidth;
  }
  if (!!height) {
    this.height = height;
  } else {
    this.height = enemyHeight;
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
  this.img = enemyimg;
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
  }
  this.draw = function() {
    ctx.drawImage(this.img, this.posX, this.posY - this.height, this.width, this.height * 2);
    if (this.dmgAnim > 0) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(this.posX, this.posY - this.height, this.width, this.height * 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#000";
    }
  }
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
  }
}

function tickEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    if (Math.abs(enemies[i].posX - chars[0].posX) < chars[0].width && Math.abs(enemies[i].posY - chars[0].posY) < chars[0].height) {
      enemies[i].active = false;
    } else if (Math.abs(enemies[i].posX - chars[0].posX) < enemies[i].noticeDistance && Math.abs(enemies[i].posY - chars[0].posY) < enemies[i].noticeDistance) {
      enemies[i].active = true;
    } else if (enemies[i].active && (Math.abs(enemies[i].posX - chars[0].posX) > enemies[i].loseDistance && Math.abs(enemies[i].posY - chars[0].posY) < enemies[i].loseDistance)) {
      enemies[i].active = false;
    }

    if (enemies[i].active && canActive) {
      let direction = Math.atan2(-chars[0].posX - chars[0].width / 2 + enemies[i].posX + enemies[i].width / 2, -chars[0].posY - chars[0].height / 2 + enemies[i].posY + enemies[i].height / 2);
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

    enemies[i].velX += enemies[i].accX;
    enemies[i].velY += enemies[i].accY;

    enemies[i].posX -= enemies[i].velX;
    enemies[i].posY -= enemies[i].velY;

    enemies[i].dmgAnim -= 1;
    checkObjectCollision(enemies[i]);
    checkForPlayerDmg(i);
    if (enemies[i].hp <= 0) {
      enemies.splice(i, 1);
    }
  }
  //DONE:1 Move enemy to player when in range
  //TODO:2 Move idly about when out of range
  //TODO:3 Avoid obstacles to find a path to the player

}

function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    ctx.drawImage(enemies[i].img, enemies[i].posX, enemies[i].posY, enemies[i].width, enemies[i].height);
    if (enemies[i].dmgAnim > 0) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(enemies[i].posX, enemies[i].posY, enemies[i].width, enemies[i].height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#000";
    }
  }
}

function toggleEnemies() {
    canActive = !canActive;
}
