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
  this.penetration = 1;
  this.dmg = 5;
  this.range = 0;
  this.collision = function() {
    let index = arrows.indexOf(this);
    arrows.splice(index, 1);
    return true;
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

        enemies[i].velX -= arrows[j].velX * chars[0].knockBack;
        enemies[i].velY -= arrows[j].velY * chars[0].knockBack;
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
    if (arrows[i].range != 0 && ( arrows[i].posX < arrows[i].posX0 - arrows[i].range
      || arrows[i].posX > arrows[i].posX0 + arrows[i].range
      || arrows[i].posY < arrows[i].posY0 - arrows[i].range
      || arrows[i].posY > arrows[i].posY0 + arrows[i].range ))
      {
        arrows.splice(i, 1);
    }
  }
}

function Bomb(posX, posY, direction) {
  this.posX = posX;
  this.posY = posY;
  this.width = 8*8;
  this.height = 8*8;
  this.speed = 10;
  this.velX = Math.sin(direction) * this.speed;
  this.velY = Math.cos(direction) * this.speed;
  this.img = document.getElementById("bomb");

  this.draw = function() {
    ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
  }

  this.tick = function() {
    this.posX += this.velX;
    this.posY += this.velY;
    this.velX *= 0.8;
    this.velY *= 0.8;
  }
}

let bombs = [];

let direx = Math.atan2(camX - this.posX - this.width / 2 + mousePosX, camY - this.posY - this.height/2 + mousePosY);

boms.push(new Bomb(chars[0].posX, chars[0].posY, direx));
