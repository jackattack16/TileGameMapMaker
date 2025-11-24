let spriteGridLocation = [0, 0];

function renderSpriteSheet(displaySize) {
  spriteRects = [];
  const sheetCols = SPRITE_SHEET.width / SPRITE_SIZE;
  const sheetRows = SPRITE_SHEET.height / SPRITE_SIZE;

  const spriteRenderSize = SPRITE_SIZE * spriteSheetZoom;

  const padding = Math.floor((SPRITE_PADDING / 100) * displaySize[0]);

  const totalSpriteWidth = spriteRenderSize + padding;
  const maxDisplayCols = Math.max(
    1,
    Math.floor(displaySize[0] / totalSpriteWidth)
  );

  // compute grid width so we can center horizontally
  const gridWidth = maxDisplayCols * totalSpriteWidth + padding;

  const offsetToCenterX = (displaySize[0] - gridWidth) / 2;

  let currentDisplayCol = 0;
  let currentDisplayRow = 0;
  spriteHitboxes = [];
  // This loops through the spritesheet's rows and columns, NOT the display thing
  for (let r = 0; r < sheetRows; r++) {
    for (let c = 0; c < sheetCols; c++) {
      const x =
        currentDisplayCol * spriteRenderSize +
        offsetToCenterX +
        padding * (currentDisplayCol + 1);
      const y =
        currentDisplayRow * spriteRenderSize +
        padding +
        padding * (currentDisplayRow + 1);

      sCtx.drawImage(
        SPRITE_SHEET, // Spritesheet
        c * SPRITE_SIZE, // Spritesheet x
        r * SPRITE_SIZE, // Spritesheet y
        SPRITE_SIZE, // Sprite width
        SPRITE_SIZE, // Sprite height
        x, // Draw x
        y, // Draw y
        spriteRenderSize, // Draw width
        spriteRenderSize // Draw height
      );

      spriteHitboxes.push({
        spriteSheetLocation: [c, r],
        displayGridLocation: [currentDisplayCol, currentDisplayRow],
        x,
        y,
        w: spriteRenderSize,
        h: spriteRenderSize,
      });

      // Detect if the display variables need to reset
      if (!(currentDisplayCol < maxDisplayCols - 1)) {
        currentDisplayCol = 0;
        currentDisplayRow++;
      } else {
        currentDisplayCol++;
      }
    }
  }
  

  const spriteIndex = (spriteGridLocation[0]) + (spriteGridLocation[1] * maxDisplayCols);
  sCtx.strokeStyle = "red";
  sCtx.lineWidth = "5";
  sCtx.beginPath();
  sCtx.rect(spriteHitboxes[spriteIndex].x, spriteHitboxes[spriteIndex].y, spriteHitboxes[spriteIndex].w, spriteHitboxes[spriteIndex].h);
  sCtx.stroke();
}

sElement.addEventListener("mousedown", function (e) {
  const rect = sElement.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (let box of spriteHitboxes) {
    if (
      mouseX >= box.x &&
      mouseX <= box.x + box.w &&
      mouseY >= box.y &&
      mouseY <= box.y + box.h
    ) {
      previewRotation = 0;
      previewMirror = [false, false];
      currentSelectedSprite = box.spriteSheetLocation;
      spriteGridLocation = box.displayGridLocation;
      renderSpriteSheet(updateCanvasSize(sElement));
      return;
    }
  }
});
