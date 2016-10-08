let arrows = [];

//DONE:10 add arrows

function Arrow(posX, posY, direction, id) {
  this.owner = id;
  this.direction = direction;
  this.posX = posX;
  this.posY = posY;
  this.velX = 5 * Math.sin(direction);
  this.velY = 5 * Math.cos(direction);
  this.posX0 = this.posX;
  this.posY0 = this.posY;
  this.width = 16;
  this.height = 32;
  this.img = "arrow";
  this.canSwim = true;
  this.penetration = 1;
  this.dmg = 5;
  this.range = 0;
  this.collision = function() {
    let index = arrows.indexOf(this);
    arrows.splice(index, 1);
    return true;
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

        enemies[i].velX -= arrows[j].velX * chars[0].knockBack;
        enemies[i].velY -= arrows[j].velY * chars[0].knockBack;
        enemies[i].dmgAnim = 30;
        enemies[i].getDamaged();
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
    if ((arrows[i].posX < arrows[i].posX0 - arrows[i].range
      || arrows[i].posX > arrows[i].posX0 + arrows[i].range
      || arrows[i].posY < arrows[i].posY0 - arrows[i].range
      || arrows[i].posY > arrows[i].posY0 + arrows[i].range
    ) && arrows[i].range != 0) {
      arrows.splice(i, 1);
    }
  }
}

function Bomb(posX, posY, direction, inivelX, inivelY, id) {
  this.owner = id;
  this.posX = posX;
  this.posY = posY;
  this.width = 64;
  this.height = 64;
  this.speed = 30;
  this.velX = Math.sin(direction) * this.speed + inivelX;
  this.velY = Math.cos(direction) * this.speed + inivelY;
  this.img = "bomb";
  this.timer = 75;
  this.canSwim = false;
  this.exploded = false;
  this.radius = 250;
  this.dmg = 0.2;

  this.tick = function() {
    this.timer--;
    if (this.timer > 0) {
      this.posX += this.velX;
      this.posY += this.velY;
      this.velX *= 0.8;
      this.velY *= 0.8;
      checkObjectCollision(this);
    } else if (this.timer < -30) {
      let indx = bombs.indexOf(this);
      bombs.splice(indx, 1);
    } else if (!this.exploded) {
      this.exploded = true;
      this.explode();
    }
  };

  this.explode = function() {
    for (i = 0; i < enemies.length; i++) {
      checkCircularEntityCollision(this, enemies[i]);
    }
  };

  this.collision = function(i, j, colDistanceX, colDistanceY) {
    if (Math.abs(colDistanceX) < Math.abs(colDistanceY)) {
      // Flyttas till ner/upp , Y-led
      if (colDistanceY > 0) {
        this.posY = j * tileSize - this.width;
      } else {
        this.posY = j * tileSize + tileSize;
      }
      this.velY = -this.velY;
    } else if (Math.abs(colDistanceX) > Math.abs(colDistanceY)) {
      // Flyttas till höger/vänster , X-led
      if (colDistanceX > 0) {
        this.posX = i * tileSize - this.height;
      } else {
        this.posX = i * tileSize + tileSize;
      }
      this.velX = -this.velX;
    }
  };
}

function Particle(posX, posY, direction, vel, duration) {
  this.posX = posX;
  this.posY = posY;
  this.velX = Math.sin(direction) * vel;
  this.velY = Math.cos(direction) * vel;
  this.width = 8 * 8;
  this.height = 8 * 8;
  this.duration = duration;
  this.img = "particle";
  this.draw = function() {
    ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
  }
  this.tick = function() {
    this.posX += this.velX;
    this.posY += this.velY;
    this.duration -= 1;
    if (this.duration <= 0) {
      let indx = particles.indexOf(this);
      particles.splice(indx, 1);
    }
  }
}

let bombs = [];

function spawnBomb() {
  let direx = Math.atan2(camX - chars[0].posX - chars[0].width / 2 + mousePosX, camY - chars[0].posY - chars[0].height/2 + mousePosY);
  bombs.push(new Bomb(chars[0].posX, chars[0].posY, direx, chars[0].velX, chars[0].velY));
}

function tickBombs() {
  for (i = 0; i < bombs.length; i++) {
    bombs[i].tick();
  }
  for (i = 0; i < particles.length; i++) {
    particles[i].tick();
  }
}
