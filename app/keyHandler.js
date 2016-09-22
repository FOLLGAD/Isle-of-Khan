// event handlers

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousedown", mouseDownHandler, false);
document.addEventListener("mouseup", mouseUpHandler, false);
document.addEventListener('mousemove', nameMousePos, false);
document.addEventListener('click', function(e) {
});

function keyDownHandler(e) {
    if(e.keyCode == 68) {
        rightPressed = true;
    }
    else if(e.keyCode == 65) {
        leftPressed = true;
    }
    else if(e.keyCode == 87) {
        upPressed = true;
    }
    else if(e.keyCode == 83) {
        downPressed = true;
    }
    else if (e.keyCode == 32){
        spacePressed = true;
    }
    else if (e.keyCode == 86) {
        vPressed = true;
        spawnMonster();
    }
    else if (e.keyCode == 27) {
        menuToggle();
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 68) {
        rightPressed = false;
        frame = 0;
    }
    else if(e.keyCode == 65) {
        leftPressed = false;
        frame = 0;
    }
    else if(e.keyCode == 87) {
        upPressed = false;
        frame = 0;
    }
    else if(e.keyCode == 83) {
        downPressed = false;
        frame = 0;
    }
    else if(e.keyCode == 32){
        spacePressed = false;
        frame = 0;
    }
    else if(e.keyCode == 86) {
        vPressed = false;
    }
}

function nameMousePos(e) {
  let mousePos = getMousePos(e);
  mousePosX = mousePos.x;
  mousePosY = mousePos.y;
}

function getMousePos(e) {
  let rect = canvas.getBoundingClientRect();
  scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
  scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  return {
    x: (e.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (e.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

function mouseDownHandler() {
  mouseDown = true;
}

function mouseUpHandler() {
  mouseDown = false;
}
