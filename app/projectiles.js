let arrows = [];

//DONE:10 add arrows

let arrowWidth = 16;
let arrowHeight = 32;

function Arrow(posX, posY, direction, vel) {
  this.direction = direction;
  this.posX = posX;
  this.posY = posY;
  this.velX = vel * Math.sin(direction);
  this.velY = vel * Math.cos(direction);
  this.posX0 = this.posX;
  this.posY0 = this.posY;
  this.width = arrowWidth;
  this.height = arrowHeight;
  this.img = arrowimg;
  this.canSwim = true;
  this.penetration = 0;
  this.dmg = 2;
  this.collision = function() {
    let index = arrows.indexOf(this);
    arrows.splice(index, 1);
  }
  this.draw = function() {
    ctx.save();
    ctx.translate(this.posX, this.posY);
    ctx.rotate(Math.PI - this.direction);
    ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}

function tickArrows() {
  // check collision with enemies
  for (i = 0; i < enemies.length; i++) {
    let breakFor = false;
      for (j = 0; j < arrows.length; j++) {
        if (enemies[i].posX < arrows[j].posX + arrows[j].width
         && enemies[i].posX + enemies[i].width > arrows[j].posX
         && enemies[i].posY < arrows[j].posY + arrows[j].height
         && enemies[i].posY + enemies[i].height > arrows[j].posY) {

        enemies[i].velX -= arrows[j].velX * Character.knockBack;
        enemies[i].velY -= arrows[j].velY * Character.knockBack;
        enemies[i].dmgAnim = 30;
        enemies[i].hp -= arrows[j].dmg;
        arrows[j].penetration -= 1;

        if (arrows[j].penetration < 0) {
          arrows.splice(j, 1);
          j -= 1;
        }
        if (enemies[i].hp < 0) {
          enemies.splice(i, 1);
          i -= 1;
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
}
