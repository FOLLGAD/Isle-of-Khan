//DONE:10 add arrows
function arrowObj(posX, posY, direction, vel) {
  this.direction = direction;
  this.posX = posX + Character.width / 2;
  this.posY = posY + Character.height / 2;
  this.velX = vel * Math.sin(direction);
  this.velY = vel * Math.cos(direction);
  this.width = 32;
  this.height = 32;
  this.collision = function() {
    let index = arrows.indexOf(this);
    arrows.splice(index, 1);
  }
}

function tickArrows() {
  for(i = 0; i < arrows.length; i++) {
    arrows[i].posX += arrows[i].velX;
    arrows[i].posY += arrows[i].velY;
    if (arrows[i].posX > mapSizeX
      || arrows[i].posX < 0
      || arrows[i].posY > mapSizeY
      || arrows[i].posY < 0
      || arrows[i].posX < Character.posX - 1000
      || arrows[i].posX > Character.posX + 1000
      || arrows[i].posY < Character.posY - 1000
      || arrows[i].posY > Character.posY + 1000
      ) {
      arrows.splice(i, 1);
    }
    checkObjectCollision(arrows[i]);
  }
  drawArrows();
}

function checkArrowCollision(i) {
  let colDistanceX = (i * tileSize + tileSize / 2) - (arrows[i].posX + arrows[i].width / 2);
  let colDistanceY = (j * tileSize + tileSize / 2) - (arrows[i].posY + arrows[i].height / 2);
  if (Math.abs(colDistanceX) < 32 && Math.abs(colDistanceY) < 32) {
    arrows.splice(i, 1);
  }
}

function activate() {
  let d = new Date();
  if (lastActivate + 500 < d.getTime()) {
    if (mouseDown) {
      lastActivate = d.getTime();
      if (bowSelected) {
        let direction = Math.atan2(camX - Character.posX - Character.width/2 + mousePosX, camY - Character.posY - Character.height/2 + mousePosY);
        arrows.push(new arrowObj(Character.posX, Character.posY, direction, arrowSpeed));
      }
    }
  }
}

function drawArrows() {
  for(i = 0; i < arrows.length && i < 500; i++) {
    ctx.save();
    ctx.translate(arrows[i].posX, arrows[i].posY);
    ctx.rotate(Math.PI - arrows[i].direction);
    ctx.drawImage(arrow, -arrowWidth / 2, -arrowHeight / 2, Character.width / 2, Character.height / 2);
    ctx.restore();
  }
}
