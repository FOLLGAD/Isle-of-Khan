//Settings

let fps = 60;
let frameAdd = 0.1;

let tileSize = 64;

let treesArray = [];

function placeTrees(mapArray) {
  let posX = 0;
  let posY = 0;
  for (let i = 0; i < mapArray.length; i++) {
    for (let j = 0; j < mapArray[i].length; j++) {
      if (mapArray[i][j] == 6) {
        console.log("placing tree at ", i * tileSize, j * tileSize);
        treesArray.push({
          posX: j * tileSize,
          posY: i * tileSize - tileSize,
          height: 128,
          width: 64,
          img: "tree"
        });
      }
      posX += tileSize;
    }
    posX = 0;
    posY += tileSize;
  }
}

placeTrees(riverMap);
