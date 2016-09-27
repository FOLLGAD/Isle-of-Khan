let coins = [];
function Coin(posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.height = 32;
  this.width = 32;
  this.img = coin;
  this.pickUp = false;
  this.drawCoin = function() {
    ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
  }
  this.checkPlayer = function() {
    if (this.posX < Character.posX + Character.width && this.posX + this.width > Character.posX && this.posY < Character.posY + Character.height && this.posY + this.height > Character.posY) {
      money++;
      let index = coins.indexOf(this);
      coins.splice(index, 1);
    }
  }
}

function tickCoin() {
  for (i = 0; i < coins.length; i++) {
    coins[i].checkPlayer();
  }
  for (i = 0; i < coins.length; i++) {
    coins[i].drawCoin();
  }
}

setInterval(spawnCoin, 1000);

function spawnCoin() {
  coins.push(new Coin(Math.round(getRandom()*tileMapWidth)*tileSize + 16, Math.round(getRandom()*tileMapWidth)*tileSize + 16));
  console.log("coin spawned at ", coins[coins.length-1].posX, coins[coins.length-1].posY);
}
