function rotateTile(rotation) {
  console.log(rotation);

  for (let tileArray of tileMap) {
    const tile = tileArray[1];
    if(tile.selected) {
      switch (rotation) {
        case "rotate-right":
          tile.rotation += 90;
          break;
        case "rotate-left":
          tile.rotation -= 90;
        case "flip-h":
          tile.mirrorHorizontal = true;
          break;
        case "flip-v":
          tile.mirrorVertical ^= true;
          break;
      }
      renderCanvas();
    }
  }
}

function clearSelected() {
  for (let tileArray of tileMap) {
    const tile = tileArray[1];
    if(tile.selected) {
      tile.selected = false;
    }
  }
}