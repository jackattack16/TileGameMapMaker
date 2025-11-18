// Dragging Variables
let isDragging = false;
let initialDragPos = { x: 0, y: 0 };
let cameraDragStartPos = { x: 0, y: 0 };
let cameraPosition = { x: 0, y: 0 };
let zoom = 1;

let gridColor = "rgb(97, 97, 97)";
let renderGridLines = true;

let mapWidth = 128;
let mapHeight = 128;
let infiniteMap = false;


function renderCanvas(camX, camY) {
  
  // Update the size of the canvas element to account for resizing
  let sizeArray = updateCanvasSize(cElement);
  const cWidth = sizeArray[0];
  const cHeight = sizeArray[1];

  // Draw a grid background
  if (renderGridLines && !infiniteMap) {
    ctx.lineWidth = zoom / 1;
    ctx.strokeStyle = gridColor;

    // Calculate map boundaries in screen space
    const mapLeftScreen = -((camX ?? cameraPosition.x) * zoom);
    const mapTopScreen = -((camY ?? cameraPosition.y) * zoom);
    const mapRightScreen = mapWidth * SPRITE_SIZE * zoom - (camX ?? cameraPosition.x) * zoom;
    const mapBottomScreen = mapHeight * SPRITE_SIZE * zoom - (camY ?? cameraPosition.y) * zoom;

    // Vertical lines - based on mapWidth
    for (let i = 0; i <= mapWidth; i++) {
      const x = i * SPRITE_SIZE * zoom - (camX ?? cameraPosition.x) * zoom;
      // Only draw if the line is visible on screen
      if (x >= -1 && x <= cWidth + 1) {
        ctx.beginPath();
        ctx.moveTo(x, Math.max(0, mapTopScreen));
        ctx.lineTo(x, Math.min(cHeight, mapBottomScreen));
        ctx.stroke();
      }
    }

    // Horizontal lines - based on mapHeight
    for (let i = 0; i <= mapHeight; i++) {
      const y = i * SPRITE_SIZE * zoom - (camY ?? cameraPosition.y) * zoom;
      // Only draw if the line is visible on screen
      if (y >= -1 && y <= cHeight + 1) {
        ctx.beginPath();
        ctx.moveTo(Math.max(0, mapLeftScreen), y);
        ctx.lineTo(Math.min(cWidth, mapRightScreen), y);
        ctx.stroke();
      }
    }
  } else {
    if (renderGridLines) {
      ctx.lineWidth = zoom / 1;
      ctx.strokeStyle = gridColor;
      for (let i = 0; i < (cWidth * (1 / zoom)) / SPRITE_SIZE + 1; i++) {
        const x = i * SPRITE_SIZE * zoom - ((camX ?? cameraPosition.x) % SPRITE_SIZE) * zoom;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, cHeight);
        ctx.stroke();
      }
      for (let i = 0; i < (cHeight * (1 / zoom)) / SPRITE_SIZE; i++) {
        const y = i * SPRITE_SIZE * zoom - ((camY ?? cameraPosition.y) % SPRITE_SIZE) * zoom;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cWidth, y);
        ctx.stroke();
      }
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

  const xPos = Math.round(event.clientX - rect.left);
  const yPos = Math.round(event.clientY - rect.top);

  return {x: xPos, y: yPos};
}

