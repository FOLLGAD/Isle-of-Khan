//DONE:10 add arrows
function arrowObj(posX, posY, direction, vel) {
  this.direction = direction;
  this.posX = posX + charWidth / 2;
  this.posY = posY + charHeight / 2;
  this.velX = vel * Math.sin(direction);
  this.velY = vel * Math.cos(direction);
}

function tickArrows() {
  for(i = 0; i < arrows.length; i++) {
    arrows[i].posX += arrows[i].velX;
    arrows[i].posY += arrows[i].velY;
    if (arrows[i].posX > mapSizeX
      || arrows[i].posX < 0
      || arrows[i].posY > mapSizeY
      || arrows[i].posY < 0
      || arrows[i].posX < charX - 1000
      || arrows[i].posX > charX + 1000
      || arrows[i].posY < charY - 1000
      || arrows[i].posY > charY + 1000
      ) {
      arrows.splice(i, 1);
    }
  }
  drawArrows();
}

function activate() {
  let d = new Date();
  if (lastActivate + 500 < d.getTime()) {
    if (mouseDown) {
      lastActivate = d.getTime();
      if (bowSelected) {
        let direction = Math.atan2(camX - charX - charWidth/2 + mousePosX, camY - charY - charHeight/2 + mousePosY);
        arrows.push(new arrowObj(charX, charY, direction, arrowSpeed));
      }
    }
  }
}

function drawArrows() {
  for(i = 0; i < arrows.length && i < 500; i++) {
    ctx.save();
    ctx.translate(arrows[i].posX, arrows[i].posY);
    ctx.rotate(Math.PI - arrows[i].direction);
    ctx.drawImage(arrow, -arrowWidth / 2, -arrowHeight / 2, charWidth / 2, charHeight / 2);
    ctx.restore();
  }
}
