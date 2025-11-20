

async function makeArrayOfImages() {
  const sheetWidth = spriteSheet.width;
  const sheetHeight = spriteSheet.height;
  
  const spritesInRow = (sheetWidth / SPRITE_SIZE);
  const spritesInCol = (sheetHeight / SPRITE_SIZE);
  const sprites = [];

  for (let row = 0; row < spritesInCol; row++) 
  {                                           
    for (let col = 0; col < spritesInRow; col++) 
    {                                 
      const bmp = await createImageBitmap(
        spriteSheet, // Image
        col * SPRITE_SIZE, // spriteSheet x location
        row * SPRITE_SIZE, // spriteSheet y location
        SPRITE_SIZE, // Sprite sheet sprite width
        SPRITE_SIZE, );
        sprites.push(bmp); 
    }
  }
  console.log(sprites);
  return sprites;
}

function renderSpriteSheet(displaySize) {
  spriteRects = [];
  const sheetWidth = spriteSheet.width;
  const sheetHeight = spriteSheet.height;
  const numSprites = (sheetWidth / SPRITE_SIZE) * (sheetHeight / SPRITE_SIZE);

  const scale = 2.5;
  const spriteRenderSize = SPRITE_SIZE * scale;

  // padding based on canvas width
  const padding = Math.floor((SPRITE_PADDING / 100) * displaySize[0]);

  // compute max number of columns that fit horizontally
  const totalSpriteWidth = spriteRenderSize + padding;
  const cols = Math.max(1, Math.floor(displaySize[0] / totalSpriteWidth));

  // compute rows required for all sprites
  const rows = Math.ceil(numSprites / cols);

  // compute grid width so we can center horizontally
  const gridWidth = cols * totalSpriteWidth - padding;

  // center horizontally
  const offsetX = Math.floor((displaySize[0] - gridWidth) / 2);

  // NEW: top padding = same padding value used elsewhere
  const offsetY = padding;

  let index = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      index = index+1;
      if (index >= numSprites) return;

      const spr = sprites[index];
      if (!spr) {
        console.error("Sprite undefined at index:", index);
        return;
      }

      const x = offsetX + c * (spriteRenderSize + padding);
      const y = offsetY + r * (spriteRenderSize + padding);

      sCtx.drawImage(
        spr,
        x,
        y,
        spriteRenderSize,
        spriteRenderSize
      );
      spriteRects.push({
        index,
        x,
        y,
        w: spriteRenderSize,
        h: spriteRenderSize
      });
    }
  }
  
}



sElement.addEventListener('mousedown', function (e) {
  const rect = sElement.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  for (let box of spriteRects) {
    if (
      mouseX >= box.x &&
      mouseX <= box.x + box.w &&
      mouseY >= box.y &&
      mouseY <= box.y + box.h
    ) {
      previewRotation = 0;
      previewMirror = [false, false];
      currentSelectedSprite = box.index;
      return;
    }
  }
});
