let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

//Settings

let fps = 60;
let frameAdd = 0.1;

let tileSize = 64;

let hp = 10;

//

let menuActive = false;

let enemies = [];

let mousePosX;
let mousePosY;

let frame = 0;
let attackingFrame = 0;
let money = 0;
let attacking = false;

let rightPressed = false;
let upPressed = false;
let leftPressed = false;
let downPressed = false;
let mouseDown = false;
let vPressed = false;
let cPressed = false;
let bPressed = false;
let spacePressed = false;

let collision = false;
let canGetDmg = true;
let lastHit = 0;
let bowSelected = true;
let lastActivate = 0;

// textures and resources
ctx.imageSmoothingEnabled = false;

let coin = document.getElementById("coin");
let walk_right = document.getElementById("walk_right");
let walk_down = document.getElementById("walk_down");
let walk_left = document.getElementById("walk_left");
let walk_up = document.getElementById("walk_up");
let idle_right = document.getElementById("idle_right");
let idle_down = document.getElementById("idle_down");
let idle_left = document.getElementById("idle_left");
let idle_up = document.getElementById("idle_up");
let tile_map = document.getElementById("tile_map");
let crosshair = document.getElementById("crosshair");
let attacking_up = document.getElementById("attacking_up");
let attacking_down = document.getElementById("attacking_down");
let attacking_left = document.getElementById("attacking_left");
let attacking_right = document.getElementById("attacking_right");
let options = document.getElementById("options");
let enemyimg = document.getElementById("enemy");
let legs = document.getElementById("legs");
let char = document.getElementById("char");
let arrowimg = document.getElementById("arrow");
let bow = document.getElementById("bow");
let wizard = document.getElementById("wizard");
let menuButtonimg = document.getElementById("menuButton");

let treesArray = [];

function placeTrees() {
  let posX = 0;
  let posY = 0;
  for (let i = 0; i < mapArray.length; i++) {
    for (let j = 0; j < mapArray[i].length; j++) {
      if (mapArray[i][j] == 6) {
        console.log("placing tree at ", i * tileSize, j * tileSize);
        treesArray.push({
          posX: j * tileSize,
          posY: i * tileSize - tileSize,
          height: 128,
          width: 64,
          img: document.getElementById("tree"),
          draw: function() {
            ctx.drawImage(this.img, this.posX, this.posY, this.width, this.height);
          },
        });
      }
      posX += tileSize;
    }
    posX = 0;
    posY += tileSize;
  }
}

placeTrees();
