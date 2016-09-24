// viewPoint, camera

let tileMapWidth = mapArray[0].length;
let tileMapHeight = mapArray.length;

let mapSizeX = tileMapWidth * tileSize;
let mapSizeY = tileMapHeight * tileSize;

let offsetMaxX = mapSizeX - canvas.width;
let offsetMaxY = mapSizeY - canvas.height;
let offsetMinX = 0;
let offsetMinY = 0;

let camX = 0;
let camY = 0;

//DONE:20 ladda träden som separata object som ritas efter karaktären, så det ser ut som att man är bakom dem.



function drawTrees() {
  let posX = 0;
  let posY = 0;
  for (let i = 0; i < mapArray.length; i++) {
    for (let j = 0; j < mapArray[i].length; j++) {
      if(mapArray[i][j] == 6) {
        ctx.drawImage(tree, j * tileSize, i * tileSize - tileSize, tileSize, tileSize);
      }
      posX += tileSize;
    }
    posX = 0;
    posY += tileSize;
  }
}

function viewPoint() {
  camX = Character.posX + Character.width / 2 - ctx.canvas.width / 2;
  camY = Character.posY + Character.height / 2 - ctx.canvas.height / 2;

  if (camX > offsetMaxX) {
    camX = offsetMaxX;
  } else if (camX < offsetMinX) {
    camX = offsetMinX;
  }
  if (camY > offsetMaxY) {
    camY = offsetMaxY;
  } else if (camY < offsetMinY) {
    camY = offsetMinY;
  }
  ctx.translate(-camX, -camY);
}
