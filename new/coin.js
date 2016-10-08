let coins = [];
function Coin(posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.height = 32;
  this.width = 32;
  this.img = "coin";
  this.pickUp = false;
  this.checkPlayer = function() {
    for (let i = 0; i < chars.length; i++) {
      if (this.posX < chars[i].posX + chars[i].width && this.posX + this.width > chars[i].posX && this.posY < chars[i].posY + chars[i].height && this.posY + this.height > chars[i].posY) {
        chars[i].coins++;
        let index = coins.indexOf(this);
        coins.splice(index, 1);
      }
    }
  }
}

function tickCoin() {
  for (i = 0; i < coins.length; i++) {
    coins[i].checkPlayer();
  }
  for (i = 0; i < coins.length; i++) {
    coins[i].draw();
  }
}

setInterval(spawnCoin, 1000);

function spawnCoin() {
  coins.push(new Coin(Math.round(getRandom() * tileMapWidth) * tileSize + 16, Math.round(getRandom() * tileMapWidth) * tileSize + 16));
}
