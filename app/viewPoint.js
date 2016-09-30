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

function viewPoint() {
  camX = chars[0].posX + chars[0].width / 2 - ctx.canvas.width / 2;
  camY = chars[0].posY + chars[0].height / 2 - ctx.canvas.height / 2;

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
