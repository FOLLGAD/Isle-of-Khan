function arrow(posX, posY, direction, vel) {
  this.posX = posX;
  this.posY = posY;
  if (direction == 1) {
    this.velX = vel * 1;
  } else if (direction == 2){
    this.velX = vel * -1;
  } else if (direction == 3) {
    this.velY = vel * 1;
  } else if (direction == 4) {
    this.velY = vel * -1;
  }
}
