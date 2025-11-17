window.addEventListener('load', function() {
  renderCanvas(cameraPosition[0], cameraPosition[1]);
});

window.addEventListener("resize", (event) => { 
  renderCanvas(cameraPosition[0], cameraPosition[1]);
})

document.addEventListener("keydown", function(e) {
  if (e.key === " ") {
    zoom++;
    renderCanvas(cameraPosition[0], cameraPosition[1]);
  }
})

cElement.addEventListener('mousedown', function(e) {
  isDragging = true;
  initialDragPos = getCursorPosition(e);
  cameraDragStartPos = cameraPosition;
});

cElement.addEventListener('mousemove', function(e) {
  if (isDragging) { 
    let newDragPos = getCursorPosition(e);

    const xDistance = initialDragPos[0] - newDragPos[0];
    const yDistance = initialDragPos[1] - newDragPos[1];

    cameraPosition = [(cameraDragStartPos[0] + xDistance) / Math.abs(zoom), (cameraDragStartPos[1] + yDistance) / Math.abs(zoom)]
    renderCanvas(cameraPosition[0], cameraPosition[1]);
  }
});

cElement.addEventListener('mouseup', () => {
  isDragging = false;
});

cElement.addEventListener('mouseleave', () => {
  isDragging = false; 
});



document.addEventListener("DOMContentLoaded", () => {
  let editorActionButtons = document.getElementsByClassName("editor-action-button");

  for(let i = 0; i < editorActionButtons.length; i++) {
    editorActionButtons[i].addEventListener("click", function(e) {
      const buttonName = e.explicitOriginalTarget.name;

      switch (buttonName) {
        case "zoomOut":
          zoom -= 0.1;
          zoom = clampValue(zoom, 0.5, 2);
          renderCanvas(cameraPosition[0], cameraPosition[1]);
          break;
        case "zoomIn":
          zoom += 0.1;
          zoom = clampValue(zoom, 0.25, 2);
          renderCanvas(cameraPosition[0], cameraPosition[1]);
          break;
      }
    });
  }
});