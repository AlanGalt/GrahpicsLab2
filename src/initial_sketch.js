let initialSketch = function(p) {
  const pRadius = 8;
  const points = figure.initial;
  let figureDone = false;
  let lastP;

  p.drawing = true;

  p.setup = function() {
    const canvas = p.createCanvas(width, height);
    canvas.mouseClicked(p.handleClick);
  };
  
  p.draw = function() {
    if (!p.drawing) p.noLoop();
    p.background(250);
    p.showGrid();
    p.showAxis();
    p.showFigure();
  };

  p.showFigure = function() {
    p.strokeWeight(1);
    p.fill(224, 61, 80);
    for(let i = 0; i < points.length; i++) { // for each point
      let point = points[i];
      if (points.length > 1 && i < points.length - 1) { // draw a line from the current point to the next one
        p.line(point.x, point.y, points[i + 1].x, points[i + 1].y);
      }
      p.ellipse(point.x, point.y, pRadius); // show the current point
      
      p.push();
      let [pX, pY] = toWorld(point.x, point.y);
      p.noStroke();
      p.textSize(15);
      p.textStyle(p.BOLD);
      p.text(
        `${Math.round(pX / transformed.step / 2 * 10) / 10}, ` +
        `${Math.round(pY / transformed.step / 2 * 10) / 10}`, 
        point.x - 10, 
        point.y - 10
      );
      p.pop();
    }

    if (!figureDone) { // if figure wasn't closed
      if (points.length) { // if we have points  
        p.line(lastP.x, lastP.y, p.mouseX, p.mouseY); // draw a line from the last point to the mouse position
        p.ellipse(lastP.x, lastP.y, pRadius);
      }
      
      p.push();
      let [x, y] = toWorld(p.mouseX, p.mouseY);
      p.noStroke();
      p.textSize(15);
      p.textStyle(p.BOLD);
      p.text(
        `${Math.round(x / transformed.step / 2 * 10) / 10}, ` + 
        `${Math.round(y / transformed.step / 2 * 10) / 10}`, 
        p.mouseX - 10, 
        p.mouseY - 10
      );
      p.pop();

      p.ellipse(p.mouseX, p.mouseY, pRadius);
    } else {
        p.line(lastP.x, lastP.y, points[0].x, points[0].y); // connect last and first points
        p.ellipse(lastP.x, lastP.y, pRadius);
        p.ellipse(points[0].x, points[0].y, pRadius);

        if (!figure.transformed.length) {
          figure.transformed = points;
          transformed.locked = false;
          transformed.drawing = true;
          p.drawing = false;

          for (let i = 0; i < controls.length; i++) { //enable controls
            controls[i].disabled = false;
          }
          stopBtn.disabled = true;
          transformed.redraw();
        }
      }
  };

  p.handleClick = function() {
    if (!figureDone) { // if we're drawing a figure
      for (let point of points) {
        if (p.dist(p.mouseX, p.mouseY, point.x, point.y) <= pRadius * 2 + 5) {
          if (point === points[0]) {
            figureDone = true;
          } 
          return;
        }
      }
      let [wMouseX, wMouseY] = toWorld(p.mouseX, p.mouseY);
      wMouseX = (Math.round(wMouseX / transformed.step / 2 * 10) / 10) * transformed.step * 2;
      wMouseY = (Math.round(wMouseY / transformed.step / 2 * 10) / 10) * transformed.step * 2;
      [wMouseX, wMouseY] = toScreen(wMouseX, wMouseY);
      points.push(new Point(wMouseX, wMouseY));
      lastP = points[points.length - 1];
    }
  };

  p.showAxis = function() {
    if (hideAxis) return;
    p.stroke(0);
    p.strokeWeight(2);

    p.line(0, height / 2, width, height / 2);
    p.line(width, height / 2, width - 8, height / 2 - 5);
    p.line(width, height / 2, width - 8, height / 2 + 5);

    p.line(width / 2, height, width / 2, 0);
    p.line(width / 2, 0, width / 2 - 5,  8);
    p.line(width / 2, 0, width / 2 + 5,  8);
  };

  p.showGrid = function () {
    if (hideGrid) return;
    p.push();
    p.stroke(186);
    p.strokeWeight(1);
    let j = -12;
    for (let i = transformed.step; i < width; i += transformed.step * 2) {
      p.line(i, 0, i, height);
      p.line(0, i, width, i);

      p.push();
      p.noStroke();
      p.text(`${j}`, i+2, width / 2 + 13);
      if (j) p.text(`${-j}`, width / 2 + 5, i + 13);
      p.stroke(0);
      p.line(i, width / 2 - 5, i, width / 2 + 5);
      p.line(width / 2 - 5, i, width / 2 + 5, i);
      p.pop();
      j++;
    }
    p.pop();
  }
}