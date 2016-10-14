exports.Coin = function (posX, posY) {
  this.posX = posX;
  this.posY = posY;
  this.height = 32;
  this.width = 32;
  this.img = "coin";
  this.pickUp = false;
  this.checkPlayers = function(coins, chars) {
    for (let i in chars) {
      if (this.posX < chars[i].posX + chars[i].width && this.posX + this.width > chars[i].posX && this.posY < chars[i].posY + chars[i].height && this.posY + this.height > chars[i].posY) {
        chars[i].coins++;
        chars[i].hp++
        let index = coins.indexOf(this);
        coins.splice(index, 1);
      }
    }
  }
}

exports.tickCoins = function (coins, chars) {
  for (i = 0; i < coins.length; i++) {
    coins[i].checkPlayers(coins, chars);
  }
}
