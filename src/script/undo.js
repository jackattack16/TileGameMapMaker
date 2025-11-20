
function addToUndo(action, key, before, after) {
  undoStack.push({ action, key, before, after });
}

function deepTileRefrence(tile) {
  return tile ? JSON.parse(JSON.stringify(tile)) : null;
}

function undoAction(inputAction, inputData) {
  // Check if there are any actions to undo
  if (undoStack.length === 0) { console.log("No actions to undo!"); return; }

  // Get the information from the undoStack
  const currentUndo = undoStack.pop();
  redoStack.push(currentUndo);
  
  if (currentUndo.before === null) {
    tileMap.delete(currentUndo.key);
  } else {
    tileMap.set(currentUndo.key, deepTileRefrence(currentUndo.before));
  }

  renderCanvas();
}

function redoAction(inputAction, inputData) {
  // Check if there are any actions to redo
  if (redoStack.length === 0) { console.log("No actions to redo!"); return; }

  // Get the information from the redoStack
  const currentRedo = redoStack.pop();
  undoStack.push(currentRedo);
  
  if (currentRedo.after === null) {
    tileMap.delete(currentRedo.key);
  } else {
    tileMap.set(currentRedo.key, deepTileRefrence(currentRedo.after));
  }

  renderCanvas();
}