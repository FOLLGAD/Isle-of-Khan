function drawCoin() {
  ctx.drawImage(coin, 100, 100, 32, 32);
  if (charX < 120 && charY < 120 && charX > 44 && charY > 80) {
    points++;
  }
}
