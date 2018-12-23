'use strict';

$(function() {
  $('.icon-close-tip').on('click', function() {
    $(this).parent().hide();
  });

  let s = Snap('#sandbox');

  // counter for cleaning after each moving
  let counter = 0;

  let movePoint = function(dX, dY, posX, posY, e) {
    if(posX <= 594 && posY <= 394 && posX >= 6 && posY >= 6) {
      this.attr( { dx: dX, dy: dY, cx: posX, cy: posY, cursor: 'grab' } );
      //console.log( e ); // test
    } else {
      return false;
    }
    counter++;
    if(counter > 0) {
      $('.curve').remove();
      $('.signal-line').remove();
    }
  }

  // init required points
  let point_1, point_2, controlPoint;
  let counterOfPoints = 0;
  
  // creating points anywhere in the svg area
  $('#sandbox').click(function(e) {
    ++counterOfPoints;
    if(counterOfPoints > 3) {
      return false;
    } else {
      if(counterOfPoints > 2) {
        alert('The next point will be a control point');
      }
      let offset = $(this).offset();
      let relativeX = (e.pageX - offset.left);
      let relativeY = (e.pageY - offset.top);
      if(counterOfPoints > 2) {
        let circle = Snap.parse('<circle cx="' + relativeX + '" cy="' + relativeY + '" r="6" fill="#ff7f7c" class="point" id="point_' + counterOfPoints + '">');
        s.append(circle);
      } else {
        let circle = Snap.parse('<circle cx="' + relativeX + '" cy="' + relativeY + '" r="6" fill="#6596ff" class="point" id="point_' + counterOfPoints + '">');
        s.append(circle);
      }
      
      if(counterOfPoints == 3) {
        $('#sandbox').trigger('pointsReady');
      }
    }
  });

  // using custom event
  // when points are ready show buttons
  $('#sandbox').bind('pointsReady', function() {
    console.log('points are ready'); // test
    $('.btn-create-curve, .btn-clean').show();
  });

  $('#sandbox').on('pointsReady', function() {
    point_1 = s.select('#point_1');
    point_2 = s.select('#point_2');
    controlPoint = s.select('#point_3');
    point_1.drag( movePoint, null, null);
    point_2.drag( movePoint, null, null);
    controlPoint.drag( movePoint, null, null);
  });

  // drawing Q Bezier curve by click
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

  // clean the canvas
  // using custom event
  $('#sandbox').bind('cleanCanvas', function() {
    console.log('cleanCanvas'); // test
  });

  $('.btn-clean').on('click', function(e) {
    e.preventDefault();
    
    s.clear();
    $('#sandbox').trigger('cleanCanvas');
    $('.tip').hide();
    $('.btn-create-curve, .btn-clean').hide();
  });

  function restoreTip() {
    $('.tip').show();
  }

  $('#sandbox').on('cleanCanvas', function() {
    setTimeout(restoreTip, 5000);
  });
});
