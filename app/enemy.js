//TODO: add enemies;
function enemyObj(posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.velX = -1;
  this.velY = 0;
}

function tickEnemies() {
  for(var i = 0; i < enemies.length; i++) {
    enemies[i].posX += enemies[i].velX;
    enemies[i].posY += enemies[i].velY;
    checkForCollision(i);
  }
}

function checkForCollision(i) {
  if (enemies[i].posX < charX + charWidth && enemies[i].posX + enemyWidth > charX) {
    if (enemies[i].posY < charY + charHeight && enemies[i].posY + enemyHeight > charY) {
      hp -= 1;
    }
  }
}

function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    ctx.drawImage(enemy, enemies[i].posX, enemies[i].posY, 8*8, 8*8);
  }
}

// for testing;
function spawnMonster() {
  //pusha ett nytt enemy-object i en array
  if (enemies.length < 10) {
    console.log("pushing new enemy object into array");
    enemies.push(new enemyObj(500, 500));
    console.log(enemies);
  }
}
