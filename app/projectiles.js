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
  this.penetration = 1;
  this.dmg = 4;
  this.collision = function() {
    let index = arrows.indexOf(this);
    arrows.splice(index, 1);
  }
}

function tickArrows() {
  // check collision with enemies
  for (i = 0; i < enemies.length; i++) {
     for (j = 0; j < arrows.length; j++) {
       if (enemies[i].posX < arrows[j].posX + arrows[j].width
          && enemies[i].posX + enemies[i].width > arrows[j].posX
          && enemies[i].posY < arrows[j].posY + arrows[j].height
          && enemies[i].posY + enemies[i].height > arrows[j].posY) {
          enemies[i].dmgAnim = 30;
          enemies[i].hp -= arrows[j].dmg;
          arrows[j].penetration -= 1;
          if (arrows[j].penetration < 0) {
            arrows.splice(j, 1);
            i = 100;
            j = 100;
          }
       }
     }
  }
  for (i = 0; i < arrows.length; i++) {
      arrows[i].posX += arrows[i].velX;
      arrows[i].posY += arrows[i].velY;
      if (arrows[i].penetration < 0) {
        arrows.splice(i, 1);
      }
  }
  for (i = 0; i < arrows.length; i++) {
    checkObjectCollision(arrows[i]);
  }
  for (i = 0; i < arrows.length; i++) {
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

function drawArrows() {
  for(i = 0; i < arrows.length; i++) {
    ctx.save();
    ctx.translate(arrows[i].posX, arrows[i].posY);
    ctx.rotate(Math.PI - arrows[i].direction);
    ctx.drawImage(arrows[i].img, -arrows[i].width / 2, -arrows[i].height / 2, arrows[i].width, arrows[i].height);
    ctx.restore();
  }
}
