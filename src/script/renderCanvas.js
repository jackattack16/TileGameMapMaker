// Dragging Variables
let isDragging = false;
let initialDragPos = [];
let cameraDragStartPos = [];


let cameraPosition = [0,0];
let zoom = 1;
function renderCanvas(camX, camY) {

  // Update the size of the canvas element to accout for resizing
  let sizeArray = updateCanvasSize(cElement);
  const cWidth = sizeArray[0];
  const cHeight = sizeArray[1];

  // Draw a grid background 
  {
    ctx.lineWidth = zoom / 1;
    for (let i = 0; i < (cWidth * (1 / zoom) / SPRITE_SIZE); i++) {
      const x = (i * SPRITE_SIZE * zoom) - (camX % SPRITE_SIZE * zoom);

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, cHeight);
      ctx.stroke();
    }

    for (let i = 0; i < (cHeight * (1 / zoom) / SPRITE_SIZE); i++) {
      const y = (i * SPRITE_SIZE * zoom) - (camY % SPRITE_SIZE * zoom);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cWidth, y);
      ctx.stroke();
    }
  }

}

function updateCanvasSize(cElement) {
  cElement.width = cElement.clientWidth;
  cElement.height = cElement.clientHeight;
  return [cElement.width, cElement.height];
}

function getCursorPosition(event) {
  const rect = cElement.getBoundingClientRect();

  const x = Math.round(event.clientX - rect.left);
  const y = Math.round(event.clientY - rect.top);

  return [x, y];
}

