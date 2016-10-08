// for testing;
function spawnMonster() {
  //pusha ett nytt enemy-objekt till en array
  if (enemies.length < 1000 && vPressed) {
    let rand = (getRandom()*3+1)*tileSize;
    enemies.push(new Enemy(camX + mousePosX - enemyWidth / 2, camY + mousePosY - enemyHeight / 2, rand, rand));
  }
}
// for testing;
function spawnCoin() {
  //pusha ett nytt enemy-object i en array
  if (coins.length < 10000) {
    coins.push(new Coin(camX + mousePosX - 32 / 2, camY + mousePosY - 32 / 2));
  }
}

function deleteEnemies() {
  enemies = [];
}

let monsterInterval;

function spawnEnemy() {
  let rand = Math.floor((getRandom() * 2) + 1) * tileSize;
  enemies.push(new Enemy(Math.round(getRandom() * tileMapWidth) * tileSize, Math.round(getRandom() * tileMapWidth) * tileSize, rand, rand));
}

let monstersSpawn = false;

function toggleEnemySpawn() {
  if (monstersSpawn == true) {
    clearInterval(monsterInterval);
    monstersSpawn = false;
  } else {
    monsterInterval = setInterval(spawnEnemy, 200);
    monstersSpawn = true;
  }
}

toggleEnemySpawn();
