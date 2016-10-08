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

function calculateViewPoint(arr) {
  for (let i = 0; i < arr.length; i++) {
    let camX = arr[i].posX + arr[i].width / 2 - canvas.width / 2;
    let camY = arr[i].posY + arr[i].height / 2 - canvas.height / 2;
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
    arr[i].camX = camX;
    arr[i].camY = camY;
  }
}
