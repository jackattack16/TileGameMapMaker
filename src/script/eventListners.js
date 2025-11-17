window.addEventListener('load', function() {
  renderCanvas(cameraPosition[0], cameraPosition[1]);
});

window.addEventListener("resize", (event) => { 
  renderCanvas(cameraPosition[0], cameraPosition[1]);
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

    cameraPosition = [(cameraDragStartPos[0] + xDistance), (cameraDragStartPos[1] + yDistance)]
    renderCanvas(cameraPosition[0], cameraPosition[1]);
  }
});

cElement.addEventListener('mouseup', () => {
  isDragging = false;
});

cElement.addEventListener('mouseleave', () => {
  isDragging = false; 
});