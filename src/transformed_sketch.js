let transformedSketch = function(p) {
  const pRadius = 8;
  p.step = 11;
  p.locked = true; 
  p.drawing = false;
  p.translate = false;
  p.reflect = false;
  p.rotate = false;
  
  p.hideHelpers = false;
  p.setup = function() {
    const canvas = p.createCanvas(width, height);
    canvas.mouseClicked(p.handleClick);
  };

  p.draw = function() {
    p.locked ? p.background(150) : p.background(250);
    p.showGrid();
    p.showAxis();
    
    if(!p.locked) {
      p.points = figure.transformed;
      p.showFigure();
      
      p.push();
      let [pX, pY] = toWorld(p.mouseX, p.mouseY);
      if (p.translate && p.mouseX > 0 && p.mouseX < width && p.mouseY > 0 && p.mouseY < height) {
        p.line(width / 2, height / 2, p.mouseX, p.mouseY);
        
        p.push();
        p.fill(194, 76, 212);
        p.ellipse(p.mouseX, p.mouseY, pRadius);
        p.noStroke();
        p.textSize(15);
        p.textStyle(p.BOLD);
        p.text(
          `${Math.round(pX / p.step / 2 * 10) / 10}, ` +
          `${Math.round(pY / p.step / 2 * 10) / 10}`, 
          p.mouseX - 10, 
          p.mouseY - 10
        );
        p.pop();
      } else if (figure.translation.x && !p.hideHelpers) { // if translation value is not a default one
        let [translateX, translateY] = toScreen(figure.translation.x, figure.translation.y);
        p.line(width / 2, height / 2, translateX, translateY);
        
        p.push();
        p.fill(194, 76, 212);
        p.ellipse(translateX, translateY, pRadius);
        [pX, pY] = [figure.translation.x, figure.translation.y];
        p.noStroke();
        p.textSize(15);
        p.textStyle(p.BOLD);
        p.text(
          `${Math.round(pX / p.step / 2 * 10) / 10}, ` +
          `${Math.round(pY / p.step / 2 * 10) / 10}`, 
          translateX - 10, 
          translateY - 10
        );
        p.pop();
      }

      if (p.reflect && p.mouseX > 0 && p.mouseX < width && p.mouseY > 0 && p.mouseY < height) {
        p.stroke(46, 201, 88);
        p.fill(46, 201, 88);
        p.ellipse(p.mouseX, p.mouseY, pRadius);
      } 
      
      
      if (p.rotate) {
        p.stroke(0);
        p.fill(38, 129, 255);
        p.ellipse(p.mouseX, p.mouseY, pRadius);
        
        [pX, pY] = toWorld(p.mouseX, p.mouseY);
        p.push();
        p.noStroke();
        p.textSize(15);
        p.textStyle(p.BOLD);
        p.text(
          `${Math.round(pX / p.step / 2 * 10) / 10}, ` +
          `${Math.round(pY / p.step / 2 * 10) / 10}`, 
          p.mouseX - 10, 
          p.mouseY - 10
        );
        p.pop();
      } else if (figure.rotation.angle && !p.hideHelpers) {
        p.stroke(0);
        p.fill(38, 129, 255);
        let [rotateX, rotateY] = toScreen(figure.rotation.x, figure.rotation.y);
        p.ellipse(rotateX, rotateY, pRadius);

        p.push();
        [pX, pY] = [figure.rotation.x, figure.rotation.y];
        p.noStroke();
        p.textSize(15);
        p.textStyle(p.BOLD);
        p.text(
          `${Math.round(pX / p.step / 2 * 10) / 10}, ` +
          `${Math.round(pY / p.step / 2 * 10) / 10}`, 
          rotateX - 10, 
          rotateY - 10
        );
        p.pop();
      }
      p.pop();
    }

    if (!p.drawing) {
      p.noLoop();
    } else {
      p.loop();
    }
  };

  p.showFigure = function() {
    const lastP = p.points[p.points.length - 1];
    p.strokeWeight(1);
    p.fill(224, 61, 80);
    for (let i = 0; i < p.points.length; i++) {
      let point = p.points[i];
      if (i < p.points.length - 1) {
        p.line(point.x, point.y, p.points[i + 1].x , p.points[i + 1].y);
      }
      p.ellipse(point.x, point.y, pRadius);
      
      p.push();
      let [pX, pY] = toWorld(point.x, point.y);
      p.noStroke();
      p.textSize(15);
      p.textStyle(p.BOLD);
      p.text(
        `${Math.round(pX / p.step / 2 * 10) / 10}, ` +
        `${Math.round(pY / p.step / 2 * 10) / 10}`, 
        point.x - 10, 
        point.y - 10
      );
      p.pop();
    }
    p.line(lastP.x, lastP.y, p.points[0].x, p.points[0].y); // connect last and first points
    p.ellipse(lastP.x, lastP.y, pRadius);
    p.ellipse(p.points[0].x, p.points[0].y, pRadius);
  }

  p.handleClick = function() {
    let [wMouseX, wMouseY] = toWorld(p.mouseX, p.mouseY);
    wMouseX = (Math.round(wMouseX / p.step / 2 * 10) / 10) * p.step * 2;
    wMouseY = (Math.round(wMouseY / p.step / 2 * 10) / 10) * p.step * 2;
    if (p.translate) { // figure has been drawn
      figure.translation.x = wMouseX;
      figure.translation.y = wMouseY;
      p.translate = false;
      repeat();
      figure.translate();
    } else if (p.reflect) {
      for (let i = 0; i < p.points.length; i++) {
        if (p.dist(p.mouseX, p.mouseY, p.points[i].x, p.points[i].y) <= pRadius * 2 + 5) {
          p.reflect = false;
          let [reflectX, reflectY] = toWorld(p.points[i].x, p.points[i].y);
          figure.reflection.x = reflectX;
          figure.reflection.y = reflectY;
          repeat();
          figure.reflect();
        }
      }
    } else if (p.rotate) {
      figure.rotation.x = wMouseX;
      figure.rotation.y = wMouseY;
      p.rotate = false;
      repeat();
      figure.rotate();
    }
  }

  p.showAxis = function() {
    if (hideAxis) return;
    p.locked ? p.stroke(90) : p.stroke(0);
    p.strokeWeight(2);

    p.line(0, height / 2, width, height / 2);
    p.line(width, height / 2, width - 8, height / 2 - 5);
    p.line(width, height / 2, width - 8, height / 2 + 5);

    p.line(width / 2, height, width / 2, 0);
    p.line(width / 2, 0, width / 2 - 5,  8);
    p.line(width / 2, 0, width / 2 + 5,  8);
  }

  p.showGrid = function () {
    if (hideGrid) return;
    p.push();
    p.stroke(186);
    p.strokeWeight(1);
    let j = -12;
    
    for (let i = p.step; i < width; i += p.step * 2) {
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