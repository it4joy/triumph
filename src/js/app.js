'use strict';

$(function() {
  let s = Snap('#sandbox');

  let point_1 = s.circle(10, 10, 6);
  let point_2 = s.circle(50, 50, 6);

  let points = s.group(point_1, point_2);

  points.attr({
    fill: '#6596ff'
  });

  let controlPoint = s.circle(50, 10, 6);
  controlPoint.attr({ fill: '#ff7f7c' });
  
  let counter = 0;

  let movePoint = function(dX, dY, posX, posY) {
    if(posX <= 594 && posY <= 394 && posX >= 6 && posY >= 6) {
      this.attr( { dx: dX, dy: dY, cx: posX, cy: posY } );
    } else {
      return false;
    }
    counter++;
    if(counter > 0) {
      $('.curve').remove();
      $('.signal-line').remove();
    }
  }

  point_1.drag( movePoint, null, null);
  point_2.drag( movePoint, null, null);
  controlPoint.drag( movePoint, null, null);

  $('.btn-create-curve').on('click', function(e) {
    e.preventDefault();

    let startPointX = point_1.attr('cx');
    let startPointY = point_1.attr('cy');
    let controlPointX = controlPoint.attr('cx');
    let controlPointY = controlPoint.attr('cy');
    let endPointX = point_2.attr('cx');
    let endPointY = point_2.attr('cy');
    //console.log(startPointX + ' | ' + startPointY + ' | ' + controlPointX + ' | ' + controlPointY + ' | ' + endPointX + ' | ' + endPointY); // test
    let pathAttrD = 'M' + startPointX + ' ' + startPointY + ' ' + 'Q ' + controlPointX + ' ' + controlPointY + ' ' + endPointX + ' ' + endPointY;
    console.log(pathAttrD); // test
    let signalLineStartPoint = '<line x1="' + startPointX + '" y1="' + startPointY + '" x2="' + controlPointX + '" y2="' + controlPointY + '" style="stroke:rgba(255,127,124,0.5);stroke-width:2" class=\'signal-line\' />';
    let signalLineEndPoint = '<line x1="' + controlPointX + '" y1="' + controlPointY + '" x2="' + endPointX + '" y2="' + endPointY + '" style="stroke:rgba(255,127,124,0.5);stroke-width:2" class=\'signal-line\' />';
    let pathEl = '<path d="' + pathAttrD + '" style="fill:transparent;stroke:black;stroke-width:2" class=\'curve\'>';
    let curve = Snap.parse(pathEl);
    let signalLineStart = Snap.parse(signalLineStartPoint);
    let signalLineEnd = Snap.parse(signalLineEndPoint);
    s.append(curve);
    s.append(signalLineStart);
    s.append(signalLineEnd);
  });
});
