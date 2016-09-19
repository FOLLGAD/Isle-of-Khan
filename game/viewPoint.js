
// viewPoint, camera

tileMapWidth = mapArray[0].length;
tileMapHeight = mapArray.length;

var mapSizeX = tileMapWidth * tileSize;
var mapSizeY = tileMapHeight * tileSize;

var offsetMaxX = mapSizeX - canvas.width;
var offsetMaxY = mapSizeY - canvas.height;
var offsetMinX = 0;
var offsetMinY = 0;

var camX = 0;
var camY = 0;

function isTileWall(t[i][j]) {
  if (t[i][j] == 3) {
    return true;
  } else {
    return false;
  }
}

function viewPoint() {

  any_collision = false;

  for(i = 0; i < tileMapWidth; i++) {
    for(j = 0; j < tileMapHeight; j++) {
      tile t = tilemap.tile_at(i, j)
      if(isTileWall()) {
        x_overlaps = (object.left < t.right) && (object.right > t.left)
        y_overlaps = (object.top < t.bottom) && (object.bottom > t.top)
        collision = x_overlaps && y_overlaps
        if(collision) {
          any_collision = true
        }
      }
    }
  }

  camX = charX + charWidth / 2 - canvas.width / 2;
  camY = charY + charHeight / 2 - canvas.height / 2;

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
