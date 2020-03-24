//Settings
let frameAdd = 0.1;
let tileSize = 64;

exports.placeTrees = function (array, mapArray) {
  let posX = 0;
  let posY = 0;
  for (let i = 0; i < mapArray.length; i++) {
    for (let j = 0; j < mapArray[i].length; j++) {
      if (mapArray[i][j] == 6) {
        array.push(new Tree (j * tileSize, (i) * tileSize));
      }
      posX += tileSize;
    }
    posX = 0;
    posY += tileSize;
  }
};

function Tree (x, y) {
  this.posX = x;
  this.posY = y;
  this.height = 128;
  this.width = 64;
  this.img = "tree";
  this.fuckit = "nej";
  this.draw = function (img) {
    ctx.drawImage(img, this.posX, this.posY, this.width, this.height);
  };
}
