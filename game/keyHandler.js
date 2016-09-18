// event handlers

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener('mousemove', nameMousePos, false);
document.addEventListener("mousedown", mouseDown, false);
document.addEventListener("mouseup", mouseUp, false);

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
}

function nameMousePos(e) {
  var mousePos = getMousePos(e);
  mousePosX = mousePos.x;
  mousePosY = mousePos.y;
}

function getMousePos(e) {
  var rect = canvas.getBoundingClientRect();
  scaleX = canvas.width / rect.width;    // relationship bitmap vs. element for X
  scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for Y
  return {
    x: (e.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
    y: (e.clientY - rect.top) * scaleY     // been adjusted to be relative to element
  }
}

function mouseDown() {
  mouseDown = true;
  console.log("mouseDown = " + mouseDown + " at " + mousePosX, mousePosY);
}

function mouseUp() {
  mouseDown = false;
  console.log("mouseDown = " + mouseDown + " at " + mousePosX, mousePosY);
}
