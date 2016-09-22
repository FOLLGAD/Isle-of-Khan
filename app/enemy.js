//DONE:40 add enemies;
function enemyObj(posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.velX = -1;
  this.velY = 0;
  this.width = 64;
  this.height = 64;
}

function tickEnemies() {
  for(let i = 0; i < enemies.length; i++) {
    enemies[i].posX += enemies[i].velX;
    enemies[i].posY += enemies[i].velY;
    checkForCollision(i);
    if (enemies[i].posX < 0 || enemies[i].posX > mapSizeX || enemies[i].posY < 0 || enemies[i].posY > mapSizeY) {
      enemies.splice(i, 1);
    }
  }
}

function checkForCollision(i) {
  if (enemies[i].posX < Character.posX + charWidth && enemies[i].posX + enemyWidth > Character.posX) {
    if (enemies[i].posY < Character.posY + charHeight && enemies[i].posY + enemyHeight > Character.posY) {
      let d = new Date();
      if (d.getTime() - 500 > lastHit || lastHit == 0) {
        Character.hp -= 1;
        canGetDmg = false;
        lastHit = d.getTime();
      }
    }
  }
}

function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    ctx.drawImage(enemy, enemies[i].posX, enemies[i].posY, 8*8, 8*8);
  }
}

// for testing;
function spawnMonster() {
  //pusha ett nytt enemy-object i en array
  if (enemies.length < 10) {
    enemies.push(new enemyObj(500, 500));
  }
}
