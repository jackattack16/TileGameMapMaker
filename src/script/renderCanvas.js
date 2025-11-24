// Dragging Variables
let isDragging = "";
let initialDragPos = { x: 0, y: 0 };
let cameraDragStartPos = { x: 0, y: 0 };
let cameraPosition = { x: 0, y: 0 };
let zoom = 1;

let gridColor = "#616161";
let renderGridLines = true;

let mapWidth = 20;
let mapHeight = 20;
let infiniteMap = false;

let selectionColor = "#a3daff";

let selectionBox = {
  topLeft: "0,0",
  topRight: "0,0", 
  bottomLeft: "0,0",
  bottomRight: "0,0"
}

let drawPreviewTile = true;
let lastMousePosition = [0, 0];

function renderCanvas(camX, camY, previewX, previewY) {
  // Update the size of the canvas element to account for resizing
  let sizeArray = updateCanvasSize(cElement);
  const cWidth = sizeArray[0];
  const cHeight = sizeArray[1];
  ctx.clearRect(0, 0, cWidth, cHeight);
  // Calculate map boundaries in screen space
  const mapLeftScreen = -((camX ?? cameraPosition.x) * zoom);
  const mapTopScreen = -((camY ?? cameraPosition.y) * zoom);
  const mapRightScreen = mapWidth * SPRITE_SIZE * zoom - (camX ?? cameraPosition.x) * zoom;
  const mapBottomScreen = mapHeight * SPRITE_SIZE * zoom - (camY ?? cameraPosition.y) * zoom;

  // Draw a grid background
  if (renderGridLines && !infiniteMap) {
    ctx.lineWidth = zoom / 1;
    ctx.strokeStyle = gridColor;

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

  for (let tileArray of tileMap) {
    const tile = tileArray[1];
    if ((tile.x < 0 || tile.x > (mapWidth - 1)) && !infiniteMap) continue;
    if ((tile.y < 0 || tile.y > (mapHeight - 1)) && !infiniteMap) continue;
  
    // screen coords
    const xScreen = mapLeftScreen + tile.x * SPRITE_SIZE * zoom;
    const yScreen = mapTopScreen + tile.y * SPRITE_SIZE * zoom;
  
    const size = SPRITE_SIZE * zoom;
    
    renderTile(tile, mapLeftScreen, mapTopScreen);

    // Selection overlay (no transform)
    if (tile.selected == true) {
      ctx.fillStyle = selectionColor + "50";
      ctx.fillRect(xScreen, yScreen, size, size);
    }
  }
  if (drawPreviewTile) { renderTilePreview((previewX ?? lastMousePosition[0]) , (previewY ?? lastMousePosition[1])) }
  drawSelectionBox();
}



function getCursorPosition(event) {
  const rect = cElement.getBoundingClientRect();

  const xPos = Math.round(event.clientX - rect.left);
  const yPos = Math.round(event.clientY - rect.top);

  return {x: xPos, y: yPos};
}

function snapToCenter() {
  // Calculate the center of the map in world coordinates
  const mapCenterX = (mapWidth * SPRITE_SIZE) / 2;
  const mapCenterY = (mapHeight * SPRITE_SIZE) / 2;
  
  // Get canvas dimensions
  const canvasWidth = cElement.width;
  const canvasHeight = cElement.height;
  
  // Calculate zoom to fit the entire map on screen (with some padding)
  const padding = 1.1; // 10% padding
  const zoomToFitWidth = canvasWidth / (mapWidth * SPRITE_SIZE * padding);
  const zoomToFitHeight = canvasHeight / (mapHeight * SPRITE_SIZE * padding);
  zoom = Math.min(zoomToFitWidth, zoomToFitHeight);
  zoom = clampValue(zoom, 0.1, 5); // Respect your zoom lim its
  
  // Position camera so map center is at canvas center
  cameraPosition.x = mapCenterX - (canvasWidth / 2 / zoom);
  cameraPosition.y = mapCenterY - (canvasHeight / 2 / zoom);
  
  renderCanvas(cameraPosition.x, cameraPosition.y);
}


function drawSelectionBox() {
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.moveTo(selectionBox.topLeft.split(',')[0], selectionBox.topLeft.split(',')[1]);
  ctx.lineTo(selectionBox.topRight.split(',')[0], selectionBox.topRight.split(',')[1]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(selectionBox.topLeft.split(',')[0], selectionBox.topLeft.split(',')[1]);
  ctx.lineTo(selectionBox.bottomLeft.split(',')[0], selectionBox.bottomLeft.split(',')[1]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(selectionBox.bottomLeft.split(',')[0], selectionBox.bottomLeft.split(',')[1]);
  ctx.lineTo(selectionBox.bottomRight.split(',')[0], selectionBox.bottomRight.split(',')[1]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(selectionBox.bottomRight.split(',')[0], selectionBox.bottomRight.split(',')[1]);
  ctx.lineTo(selectionBox.topRight.split(',')[0], selectionBox.topRight.split(',')[1]);
  ctx.stroke();
}


function renderTilePreview(x, y) {
  ctx.globalCompositeOperation = "screen";

  const size = SPRITE_SIZE * zoom;
  const half = size / 2;
  const angle = previewRotation * Math.PI / 180;

  ctx.save();

  // 1. move origin to exact tile center
  ctx.translate(x + half, y + half);

  // 2. rotate around center
  if (previewRotation !== 0) {
    ctx.rotate(angle);
  }

  // 3. flips (mirroring)
  const flipX = previewMirror[0] ? -1 : 1;
  const flipY = previewMirror[1] ? -1 : 1;

  // Scaling should happen **after** rotate
  if (flipX === -1 || flipY === -1) {
    ctx.scale(flipX, flipY);
  }

  // 4. draw image centered at origin  
  // (this keeps rotation + flip always stable)
  ctx.drawImage(
    SPRITE_SHEET,
    currentSelectedSprite[0] * SPRITE_SIZE,
    currentSelectedSprite[1] * SPRITE_SIZE,
    SPRITE_SIZE,
    SPRITE_SIZE,
    -half,  // x offset
    -half,  // y offset
    size, 
    size
  );

  ctx.restore();
  ctx.globalCompositeOperation = "source-over";
}



function renderTile(tile, mapLeftScreen, mapTopScreen) {
  const xScreen = mapLeftScreen + tile.x * SPRITE_SIZE * zoom;
  const yScreen = mapTopScreen + tile.y * SPRITE_SIZE * zoom;

  const size = SPRITE_SIZE * zoom;
  const half = size / 2;
  const angle = tile.rotation * Math.PI / 180;

  ctx.save();

  // 1. move origin to exact tile center
  ctx.translate(xScreen + half, yScreen + half);

  // 2. rotate around center
  if (tile.rotation !== 0) {
    ctx.rotate(angle);
  }

  // 3. flips (mirroring)
  const flipX = tile.mirrorHorizontal ? -1 : 1;
  const flipY = tile.mirrorVertical ? -1 : 1;

  // Scaling should happen **after** rotate
  if (flipX === -1 || flipY === -1) {
    ctx.scale(flipX, flipY);
  }

  // 4. draw image centered at origin  
  // (this keeps rotation + flip always stable)
  ctx.drawImage(
    SPRITE_SHEET,
    tile.tileId[0] * SPRITE_SIZE,
    tile.tileId[1] * SPRITE_SIZE,
    SPRITE_SIZE,
    SPRITE_SIZE,
    -half,  // x offset
    -half,  // y offset
    size, 
    size
  );

  ctx.restore();
}
