let coins = [];
function Coin(posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.height = 32;
  this.width = 32;
  this.img = coin;
  this.pickUp = false;
  this.draw = function() {
    ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
  }
  this.checkPlayer = function() {
    if (this.posX < chars[0].posX + chars[0].width && this.posX + this.width > chars[0].posX && this.posY < chars[0].posY + chars[0].height && this.posY + this.height > chars[0].posY) {
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
    coins[i].draw();
  }
}

setInterval(spawnCoin, 1000);

function spawnCoin() {
  coins.push(new Coin(Math.round(getRandom()*tileMapWidth)*tileSize + 16, Math.round(getRandom()*tileMapWidth)*tileSize + 16));
}
