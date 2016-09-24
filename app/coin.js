let coins = [];
function Coin(posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.height = 32;
  this.width = 32;
  this.img = coin;
  this.pickUp = false;
  this.drawCoin = function() {
    ctx.drawImage(this.img, this.posX + this.width / 2, this.posY + this.height / 2, this.width, this.height);
  }
  this.checkPlayer = function() {
    if (this.posX < Character.posX + Character.width && this.posX + this.width > Character.posX && this.posY < Character.posY + Character.height && this.posY + this.height > Character.posY) {
      money++;
      let index = coins.indexOf(this);
      coins.splice(index, 1);
    }
  }
}

function drawCoin() {
  for (let i = 0; i < coins.length; i++) {
    coins[i].drawCoin;
  }
}
