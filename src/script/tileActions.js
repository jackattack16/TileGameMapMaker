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
          tile.mirrorHorizontal ^= true;
          break;
        case "flip-v":
          tile.mirrorVertical ^= true;
          break;
      } 
    }
  }
  renderCanvas();
}

function updateSelectedTileProperty(property, value) {
  for (let tileArray of tileMap) {
    const tile = tileArray[1];
    if(tile.selected) {
      switch (property) {
        case "collision-type":
          tile.collision = { type: value };
          break;
        case "barrier-id":
          tile.collision.barrierId = Number(value);
          tile.updateCollisionFlags();
          break;
        case "trigger-dialogue":
          tile.triggers.dialogue.isDialogueTrigger = value;
          break;
        case "trigger-dialogue-id":
          tile.triggers.dialogue.dialogueTriggerId = Number(value);
          break;
        case "trigger-cutscene":
          tile.triggers.cutScene.isCutsceneTrigger = value;
          break;
        case "trigger-cutscene-id":
          tile.triggers.cutScene.cutsceneTriggerId = Number(value);
          break;
        case "trigger-gamestate":
          tile.triggers.gameState.changesGameState = value;
          break;
        case "trigger-gamestate-id":
          tile.triggers.gameState.gameStateId = Number(value);
          break;
      }
    }
  }
  renderCanvas();
}

function updateInspectorFromSelection() {
  const selectedTiles = [];
  for (let tileArray of tileMap) {
    if (tileArray[1].selected) {
      selectedTiles.push(tileArray[1]);
    }
  }

  if (selectedTiles.length === 0) return;

  const first = selectedTiles[0];
  const consistency = {
    collisionType: true,
    barrierId: true,
    dialogueTrigger: true,
    dialogueId: true,
    cutsceneTrigger: true,
    cutsceneId: true,
    gamestateTrigger: true,
    gamestateId: true
  };

  // Check consistency
  for (let i = 1; i < selectedTiles.length; i++) {
    const tile = selectedTiles[i];
    if (tile.collision.type !== first.collision.type) consistency.collisionType = false;
    if (tile.collision.barrierId !== first.collision.barrierId) consistency.barrierId = false;
    
    if (tile.triggers.dialogue.isDialogueTrigger !== first.triggers.dialogue.isDialogueTrigger) consistency.dialogueTrigger = false;
    if (tile.triggers.dialogue.dialogueTriggerId !== first.triggers.dialogue.dialogueTriggerId) consistency.dialogueId = false;
    
    if (tile.triggers.cutScene.isCutsceneTrigger !== first.triggers.cutScene.isCutsceneTrigger) consistency.cutsceneTrigger = false;
    if (tile.triggers.cutScene.cutsceneTriggerId !== first.triggers.cutScene.cutsceneTriggerId) consistency.cutsceneId = false;
    
    if (tile.triggers.gameState.changesGameState !== first.triggers.gameState.changesGameState) consistency.gamestateTrigger = false;
    if (tile.triggers.gameState.gameStateId !== first.triggers.gameState.gameStateId) consistency.gamestateId = false;
  }

  // Update Collision
  const collisionRadios = document.getElementsByName("collision-type");
  for (let radio of collisionRadios) {
    if (consistency.collisionType && radio.value === first.collision.type) {
      radio.checked = true;
    } else {
      radio.checked = false;
    }
  }

  const barrierIdInput = document.getElementsByName("barrier-id")[0];
  if (barrierIdInput) barrierIdInput.value = consistency.barrierId ? (first.collision.barrierId || 0) : "";

  // Update Triggers
  const dialogueCheckbox = document.getElementsByName("trigger-dialogue")[0];
  if (dialogueCheckbox) {
    dialogueCheckbox.checked = consistency.dialogueTrigger ? first.triggers.dialogue.isDialogueTrigger : false;
    dialogueCheckbox.indeterminate = !consistency.dialogueTrigger;
  }

  const dialogueIdInput = document.getElementsByName("trigger-dialogue-id")[0];
  if (dialogueIdInput) dialogueIdInput.value = consistency.dialogueId ? first.triggers.dialogue.dialogueTriggerId : "";

  const cutsceneCheckbox = document.getElementsByName("trigger-cutscene")[0];
  if (cutsceneCheckbox) {
    cutsceneCheckbox.checked = consistency.cutsceneTrigger ? first.triggers.cutScene.isCutsceneTrigger : false;
    cutsceneCheckbox.indeterminate = !consistency.cutsceneTrigger;
  }

  const cutsceneIdInput = document.getElementsByName("trigger-cutscene-id")[0];
  if (cutsceneIdInput) cutsceneIdInput.value = consistency.cutsceneId ? first.triggers.cutScene.cutsceneTriggerId : "";

  const gamestateCheckbox = document.getElementsByName("trigger-gamestate")[0];
  if (gamestateCheckbox) {
    gamestateCheckbox.checked = consistency.gamestateTrigger ? first.triggers.gameState.changesGameState : false;
    gamestateCheckbox.indeterminate = !consistency.gamestateTrigger;
  }

  const gamestateIdInput = document.getElementsByName("trigger-gamestate-id")[0];
  if (gamestateIdInput) gamestateIdInput.value = consistency.gamestateId ? first.triggers.gameState.gameStateId : "";
}

function clearSelected() {
  for (let tileArray of tileMap) {
    const tile = tileArray[1];
    if(tile.selected) {
      tile.selected = false;
    }
  }
}

function isAnyTileSelected() {
  for (let tileArray of tileMap) {
    const tile = tileArray[1];
    if(tile.selected) {
      return true;
    }
  }
}

// TODO: Make work in other dragging direction
function addTilesToSelected() {
  const tileSelectionBox = {0: [], 1: [], 2: [], 3: []} // topLeft, topRight, bottomLeft, bottomRight
  
  let i = 0;
  for (const property in selectionBox) {
    tileSelectionBox[i] = cordToTiles(selectionBox[property].split(",")[0],selectionBox[property].split(",")[1]);
    i++;
  }
  
  const xMin = tileSelectionBox[0][0] - 1;
  const xMax = tileSelectionBox[1][0];
  const yMin = tileSelectionBox[1][1] - 1;
  const yMax = tileSelectionBox[3][1];

  for (const [key, value] of tileMap.entries()) {
    if ((key.split(",")[0] > xMin) && (key.split(",")[0] < xMax) && (key.split(",")[1] < yMax) && (key.split(",")[1] > yMin)) {
      value.selected = true;
    }
  }
  updateInspectorFromSelection();
}