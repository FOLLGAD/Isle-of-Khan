let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

//Settings
let attackingSpeed = 2;

let fps = 60;
let walkSpeed = 5;
let frameAdd = 0.1;

let charSpawnX = 10 * 64;
let charSpawnY = 10 * 64;

let hp = 10;

let arrowSpeed = 20;

//

let menuActive = false;

let charX = charSpawnX;
let charY = charSpawnY;

let charVelX = 0;
let charVelY = 0;
let charWidth = 64;
let charHeight = 64;

let enemies = [];
let enemyWidth = 64;
let enemyHeight = 64;

let tileX = [];
let tileY = [];

let tileSize = 8*8;

let mousePosX = 0;
let mousePosY = 0;

let frame = 0;
let attackingFrame = 0;
let direction = "up";
let points = 0;
let idle = true;
let idleX = true;
let idleY = true;
let attacking = false;

let rightPressed = false;
let upPressed = false;
let leftPressed = false;
let downPressed = false;
let mouseDown = false;

let vPressed = false;

let spacePressed = false;

let collision = false;

let canGetDmg = true;

let lastHit = 0;

let bowSelected = true;
let arrows = [];
let arrowWidth = 32;
let arrowHeight = 32;

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
let tree = document.getElementById("tree");
let options = document.getElementById("options");
let enemy = document.getElementById("enemy");
let legs = document.getElementById("legs");
let char = document.getElementById("char");
let arrow = document.getElementById("arrow");
let bow = document.getElementById("bow");
