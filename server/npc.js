let Wizard = {
  height: 128,
  width: 64,
  posX: 64*20,
  posY: 64*10,
  img: "wizard",
  draw: function() {
    ctx.drawImage(Wizard.img, Wizard.posX, Wizard.posY, Wizard.width, Wizard.height);
  }
};
