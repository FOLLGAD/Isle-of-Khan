//DONE:40 add enemies;
let enemyWidth = 64;
let enemyHeight = 64;
function Enemy(posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.velX = 0;
  this.velY = 0;
  this.width = enemyWidth;
  this.height = enemyHeight;
  this.active = false;
  this.speed = 5;
  this.hp = 10;
  this.dmg = 2;
  this.noticeDistance = 1000;
  this.loseDistance = this.noticeDistance + 200;
  this.canHitPlayer = 0;
  this.dmgAnim = 0;
  this.img = enemyimg;

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
  }
}

function tickEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    if (Math.abs(enemies[i].posX - Character.posX) < Character.width && Math.abs(enemies[i].posY - Character.posY) < Character.height) {
      enemies[i].active = false;
    } else if (Math.abs(enemies[i].posX - Character.posX) < enemies[i].noticeDistance && Math.abs(enemies[i].posY - Character.posY) < enemies[i].noticeDistance) {
      enemies[i].active = true;
    } else if (enemies[i].active && (Math.abs(enemies[i].posX - Character.posX) > enemies[i].loseDistance && Math.abs(enemies[i].posY - Character.posY) < enemies[i].loseDistance)) {
      enemies[i].active = false;
    }
    if (enemies[i].active) {
      let direction = Math.atan2(-Character.posX - Character.width / 2 + enemies[i].posX + enemies[i].width / 2, -Character.posY - Character.height / 2 + enemies[i].posY + enemies[i].height / 2);
      enemies[i].velX = Math.sin(direction) * enemies[i].speed;
      enemies[i].velY = Math.cos(direction) * enemies[i].speed;
    } else {

    }
    enemies[i].posX -= enemies[i].velX;
    enemies[i].posY -= enemies[i].velY;
    enemies[i].velX = 0;
    enemies[i].velY = 0;
    enemies[i].dmgAnim -= 1;
    checkObjectCollision(enemies[i]);
    checkForPlayerDmg(i);
    if (enemies[i].posX < 0 || enemies[i].posX > mapSizeX || enemies[i].posY < 0 || enemies[i].posY > mapSizeY) {
    }
    if (enemies[i].hp < 0) {
      enemies.splice(i, 1);
    }
  }
  //DONE:1 Move enemy to player when in range
  //TODO:2 Move idly about when out of range
  //TODO:3 Avoid obstacles to find a path to the player

}

function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    ctx.drawImage(enemies[i].img, enemies[i].posX, enemies[i].posY, enemyWidth, enemyHeight);
    if (enemies[i].dmgAnim > 0) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(enemies[i].posX, enemies[i].posY, enemies[i].width, enemies[i].height);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#000";
    }
  }
}

setInterval(spawnEnemy, 2000);

function spawnEnemy() {
  enemies.push(new Enemy(Math.round(getRandom()*tileMapWidth)*tileSize, Math.round(getRandom()*tileMapWidth)*tileSize));
  console.log("enemy spawned at ", enemies[enemies.length-1].posX, enemies[enemies.length-1].posY);
}
