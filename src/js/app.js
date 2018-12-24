'use strict';

$(function() {
  $('.icon-close-tip').on('click', function() {
    $(this).parent().hide();
  });

  // tip content
  const TIP_CONTENT = $('.tip-content');
  const TIP_CONTENT_INIT = 'Please, click anywhere in the right SVG area. You need in three points. Than click on the button "Create curve".';
  const TIP_CONTENT_AFTER_POINTS_READY = 'The point created third is a control point. You can move points before and after creating curve.';
  let tipContentCurrent = TIP_CONTENT_INIT;
  $(TIP_CONTENT).text(tipContentCurrent);

  const S = Snap('#sandbox');

  // counter for cleaning after each moving
  let counter = 0;
  let p_1CurrentPos = 'Point_1: 0';
  let p_2CurrentPos = 'Point_2: 0';
  let pControlCurrentPos = 'Control Point: 0';

  let movePoint = function(dX, dY, posX, posY) {
    if(posX < 594 && posY < 394 && posX > 6 && posY > 6) {
      this.attr( { dx: dX, dy: dY, cx: posX, cy: posY, cursor: 'grab' } );
      let currentPointId = this.attr('id');
      let pointPosStr = `X: ${posX}; Y: ${posY}`;
      if(currentPointId == 'point_1') {
        p_1CurrentPos = `Point_1: ${pointPosStr}`;
      } else if(currentPointId == 'point_2') {
        p_2CurrentPos = `Point_2: ${pointPosStr}`;
      } else {
        pControlCurrentPos = `Control Point: ${pointPosStr}`;
      }
      $('.coords-wrapper').text(`${p_1CurrentPos} | ${p_2CurrentPos} | ${pControlCurrentPos}`);
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
      let offset = $(this).offset();
      let relativeX = (e.pageX - offset.left);
      let relativeY = (e.pageY - offset.top);
      if(counterOfPoints > 2) {
        let circle = Snap.parse(`<circle cx="${relativeX}" cy="${relativeY}" r="6" fill="#ff7f7c" class="point" id="point_${counterOfPoints}">`);
        S.append(circle);
      } else {
        let circle = Snap.parse(`<circle cx="${relativeX}" cy="${relativeY}" r="6" fill="#6596ff" class="point" id="point_${counterOfPoints}">`);
        S.append(circle);
      }

      if(counterOfPoints == 3) {
        $('#sandbox').trigger('pointsReady');
        tipContentCurrent = TIP_CONTENT_AFTER_POINTS_READY;
        $(TIP_CONTENT).text(tipContentCurrent);
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
    point_1 = S.select('#point_1');
    point_2 = S.select('#point_2');
    controlPoint = S.select('#point_3');
    point_1.drag(movePoint, null, null);
    point_2.drag(movePoint, null, null);
    controlPoint.drag(movePoint, null, null);
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
    let pathAttrD = 'M' + startPointX + ' ' + startPointY + ' ' + 'Q ' + controlPointX + ' ' + controlPointY + ' ' + endPointX + ' ' + endPointY;
    console.log(pathAttrD); // test
    let signalLineStartPoint = '<line x1="' + startPointX + '" y1="' + startPointY + '" x2="' + controlPointX + '" y2="' + controlPointY + '" style="stroke:rgba(255,127,124,0.5);stroke-width:2" class=\'signal-line\' />';
    let signalLineEndPoint = '<line x1="' + controlPointX + '" y1="' + controlPointY + '" x2="' + endPointX + '" y2="' + endPointY + '" style="stroke:rgba(255,127,124,0.5);stroke-width:2" class=\'signal-line\' />';
    let pathEl = '<path d="' + pathAttrD + '" style="fill:transparent;stroke:black;stroke-width:2" class=\'curve\'>';
    let curve = Snap.parse(pathEl);
    let signalLineStart = Snap.parse(signalLineStartPoint);
    let signalLineEnd = Snap.parse(signalLineEndPoint);
    S.append(curve);
    S.append(signalLineStart);
    S.append(signalLineEnd);
  });

  // clean the canvas
  // using custom event
  $('#sandbox').bind('cleanCanvas', function() {
    console.log('cleanCanvas'); // test
  });

  $('.btn-clean').on('click', function(e) {
    e.preventDefault();
    
    S.clear();
    $('#sandbox').trigger('cleanCanvas');
    $('.tip').hide();
    $('.btn-create-curve, .btn-clean').hide();
  });

  const restoreTip = () => {
    tipContentCurrent = TIP_CONTENT_INIT;
    $(TIP_CONTENT).text(tipContentCurrent);
    $('.tip').show();
  }

  $('#sandbox').on('cleanCanvas', function() {
    setTimeout(restoreTip, 5000);
    counterOfPoints = 0;
  });
});
