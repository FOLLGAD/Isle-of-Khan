function drawCoin() {
  ctx.drawImage(coin, 100, 100, 16, 16);
  if (charX < 120 && charY < 120 && charX > 44 && charY > 80) {
    points++;
  }
  ctx.font = "20px Georgia";
  ctx.fillText(points, 10, 50);
}