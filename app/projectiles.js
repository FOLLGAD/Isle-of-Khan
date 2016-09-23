let arrows = [];

//DONE:10 add arrows

let arrowWidth = 16;
let arrowHeight = 32;

function arrowObj(posX, posY, direction, vel) {
  this.direction = direction;
  this.posX = posX;
  this.posY = posY;
  this.velX = vel * Math.sin(direction);
  this.velY = vel * Math.cos(direction);
  this.posX0 = this.posX;
  this.posY0 = this.posY;
  this.width = arrowWidth;
  this.height = arrowHeight;
  this.img = arrow;
  this.canSwim = true;
  this.collision = function() {
    let index = arrows.indexOf(this);
    arrows.splice(index, 1);
  }
}

function tickArrows() {
  // För någon dum jävla anledning måste dessa vara i olika for-loops. Ta bort dom på egen risk D;
  for (i = 0; i < arrows.length; i++) {
      arrows[i].posX += arrows[i].velX;
      arrows[i].posY += arrows[i].velY;
  }
  for(i = 0; i < arrows.length; i++) {
    checkObjectCollision(arrows[i]);
  }
  for(i = 0; i < arrows.length; i++) {
    if (arrows[i].posX > mapSizeX
      || arrows[i].posX < 0
      || arrows[i].posY > mapSizeY
      || arrows[i].posY < 0
      || arrows[i].posX < arrows[i].posX0 - 1500
      || arrows[i].posX > arrows[i].posX0 + 1500
      || arrows[i].posY < arrows[i].posY0 - 1500
      || arrows[i].posY > arrows[i].posY0 + 1500
      ) {
      arrows.splice(i, 1);
    }
  }
  drawArrows();
}

function activate() {
  let d = new Date();
  if (mouseDown) {
    if (lastActivate + Character.activationDelay < d.getTime()) {
      if (bowSelected) {
        let direction = Math.atan2(camX - Character.posX - Character.width / 2 + mousePosX, camY - Character.posY - Character.height/2 + mousePosY);
        direction += (getRandom()*2 - 1)/20;
        arrows.push(new arrowObj(Character.posX + Character.width / 2, Character.posY + Character.height / 2, direction, arrowSpeed));
        lastActivate = d.getTime();
      }
    }
  }
}

function drawArrows() {
  for(i = 0; i < arrows.length; i++) {
    ctx.fillRect(arrows[i].posX - 5, arrows[i].posY - 5, 10, 10);
    ctx.save();
    ctx.translate(arrows[i].posX, arrows[i].posY);
    ctx.rotate(Math.PI - arrows[i].direction);
    ctx.drawImage(arrows[i].img, -arrows[i].width / 2, -arrows[i].height / 2, arrows[i].width, arrows[i].height);
    ctx.restore();
  }
}
