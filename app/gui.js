// for testing;
function spawnMonster() {
  //pusha ett nytt enemy-objekt till en array
  if (enemies.length < 1000 && vPressed) {
    let rand = (getRandom()*3+1)*tileSize;
    enemies.push(new Enemy(camX + mousePosX - enemyWidth / 2, camY + mousePosY - enemyHeight / 2, rand, rand));
  }
}
// for testing;
function spawnCoinAtCursor() {
  //pusha ett nytt enemy-object i en array
  if (coins.length < 10000) {
    coins.push(new Coin(camX + mousePosX - 32 / 2, camY + mousePosY - 32 / 2));
  }
}

function drawGui() {
  //TODO: add inventory/hotbar with bow, sword and prehaps food
  ctx.font = "40px Courier";
  ctx.fillText("Coins: " + money, camX + 50, camY + 80);
  ctx.font = "20px Courier";

}

function drawHp() {
  d = new Date();
  if (d.getTime() - 2000 < lastHit || Character.hp < 8) {
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.fillRect(Character.posX - 20 - 1, Character.posY + Character.width / 2 - 100 - 1, 10 * 10 + 2, 12);
    ctx.fillStyle = "green";
    ctx.fillRect(Character.posX - 20, Character.posY + Character.width / 2 - 100, Character.hp * 10, 10);
    ctx.closePath();
    ctx.fillStyle = "#000";
  }
}
