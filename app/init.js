let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//Settings
let attackingSpeed = 2;

let fps = 60;
let walkSpeed = 5;
let frameAdd = 0.1;

let charX = 10 * 64;
let charY = 10 * 64;

let hp = 10;

//

let menuActive = false;

let charVelX = 0;
let charVelY = 0;
let charWidth = 64;
let charHeight = 64;

let enemyWidth = 64;
let enemyHeight = 64;

let tileX = [];
let tileY = [];

let enemies = [];

let tileSize = 8*8;

let mousePosX = 0;
let mousePosY = 0;

let frame = 0;
let attackingFrame = 0;
let direction = "up";
let arrows = [];
let points = 0;
let idle = true;
let idleX = true;
let idleY = true;
let attacking = false;

let rightPressed = false;
let upPressed = false;
let leftPressed = false;
let downPressed = false;

let vPressed = false;

let spacePressed = false;

let collision = false;

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
let tree = document.getElementById("tree");
let options = document.getElementById("options");
let enemy = document.getElementById("enemy");
let legs = document.getElementById("legs");
