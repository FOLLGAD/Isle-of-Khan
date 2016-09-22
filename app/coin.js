function drawCoin() {
  ctx.drawImage(coin, 100, 100, 32, 32);
  if (Character.posX < 120 && Character.posY < 120 && Character.posX > 44 && Character.posY > 80) {
    points++;
  }
}
