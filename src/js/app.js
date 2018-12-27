'use strict';

$(function() {
  $('.icon-close-tip').on('click', function() {
    $(this).parent().hide();
  });

  // tip content
  const TIP_CONTENT = $('.tip-content');
  const TIP_CONTENT_INIT = 'Please, click anywhere in the right SVG area. You need in three points. The third point (pink) will be a control point. After three clicks you may move points and use buttons.';
  const TIP_CONTENT_AFTER_POINTS_READY = 'Note, the point created third (pink) is a control point. You can move points before and after creating curve.';
  const TIP_CONTENT_AFTER_CREATING_CURVE = 'Congrats! Your quadratic Bezier curve is ready. If you want, you can move points and create curve again. And one thing as a cherry on the cake: in the nearest future we\'ll add ability to save the curve locally *__*';
  let tipContentCurrent = TIP_CONTENT_INIT;
  $(TIP_CONTENT).text(tipContentCurrent);

  // buttons
  const BTN_CREATE_CURVE = $('.btn-create-curve');
  const BTN_CLEAN = $('.btn-clean');

  // coords wrapper
  const COORDS_WRAPPER = $('.coords-wrapper');

  const S = Snap('#sandbox');

  // counter for cleaning after each moving
  let counter = 0;
  let p_1CurrentPos, p_2CurrentPos, pControlCurrentPos;
  p_1CurrentPos = p_2CurrentPos = pControlCurrentPos = '';

  // point moving
  let movePoint = function(dX, dY, posX, posY) {
    if(posX < 594 && posY < 394 && posX > 6 && posY > 6) {
      this.attr( { dx: dX, dy: dY, cx: posX, cy: posY, cursor: 'grab' } );
      let currentPointId = this.attr('id');
      currentPointId = currentPointId[0].toUpperCase() + currentPointId.substring(1);
      let pointPosStr = `X: ${posX}, Y: ${posY}`;
      if(currentPointId == 'Point_1') {
        p_1CurrentPos = `<strong>${currentPointId}:</strong> ${pointPosStr}`;
        //console.log(p_1CurrentPos); // test
      } else if(currentPointId == 'Point_2') {
        p_2CurrentPos = `<strong>${currentPointId}:</strong> ${pointPosStr}`;
      } else {
        pControlCurrentPos = `<strong>Control Point:</strong> ${pointPosStr}`;
      }
      if( $(COORDS_WRAPPER).css('display') == 'none' ) {
        $(COORDS_WRAPPER).html('');
        $(COORDS_WRAPPER).show().html(`${p_1CurrentPos}; ${p_2CurrentPos}; ${pControlCurrentPos}.`);
      } else {
        $(COORDS_WRAPPER).html('');
        $(COORDS_WRAPPER).html(`${p_1CurrentPos}; ${p_2CurrentPos}; ${pControlCurrentPos}.`);
      }
    } else {
      return false;
    }
    counter++;
    if(counter > 0) {
      $('.curve').remove();
      $('.signal-line').remove();
    }
  }

  // init required vars
  let point_1, point_2, controlPoint, curve;
  let point_1Id, point_2Id, controlPointId; // for array `elsToRemove`
  let signalLine_1, signalLine_2, curveToRemove, signalLine_1Id, signalLine_2Id, curveToRemoveId; // for array `elsToRemove`
  let counterOfPoints = 0;
  let elsToRemove = [];

  // leaves only unique values (IDs) in array `elsToRemove`
  let leaveUniqueArrEls = (arr) => {
    let objHelper = {};

    for(let i = 0; i < arr.length; i++) {
      let str = arr[i];
      objHelper[str] = true;
    }
    arr.length = 0;
    $.each(objHelper, function(i, val) {
      arr.push(i);
    });
    return arr;
  }

  // creating points anywhere in the svg area
  let pointsCoordsInit = [];

  $('#sandbox').click(function(e) {
    ++counterOfPoints;

    let offset = $(this).offset();
    let relativeX = (e.pageX - offset.left);
    let relativeY = (e.pageY - offset.top);

    if(counterOfPoints > 3) {
      return false;
    } else {
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

    // display coords of each click (in fact each new point)
    // it will be overwritten after first point's moving and it uses standalone array
    let currentPointX = relativeX;
    let currentPointY = relativeY;
    currentPointX = `X: ${currentPointX}, `;
    currentPointY = `Y: ${currentPointY}`;
    pointsCoordsInit.push(currentPointX + currentPointY);
    //console.log(pointsCoordsInit.length); // test

    if(pointsCoordsInit.length == 3) {
      pointsCoordsInit[0] = '<strong>Point_1:</strong> ' + pointsCoordsInit[0];
      pointsCoordsInit[1] = '<strong>Point_2:</strong> ' + pointsCoordsInit[1];
      pointsCoordsInit[2] = '<strong>Control Point:</strong> ' + pointsCoordsInit[2];
      if( $(COORDS_WRAPPER).css('display') == 'none' ) {
        $(COORDS_WRAPPER).show().html( pointsCoordsInit.join('; ') );
        console.log(pointsCoordsInit.join('; ')); // test
        //console.log(pointsCoordsInit.length); // test
      }
      // set current coords as initial coords before point moving starts
      p_1CurrentPos = pointsCoordsInit[0];
      p_2CurrentPos = pointsCoordsInit[1];
      pControlCurrentPos = pointsCoordsInit[2];
    } else {
      return false;
    }
  });

  // using custom event
  // when points are ready buttons are enabled
  $('#sandbox').bind('pointsReady', function() {
    console.log('points are ready'); // test
    $(BTN_CREATE_CURVE).attr('disabled', false);
    $(BTN_CLEAN).attr('disabled', false);
  });

  $('#sandbox').on('pointsReady', function() {
    point_1 = S.select('#point_1');
    point_2 = S.select('#point_2');
    controlPoint = S.select('#point_3');
    // for array `elsToRemove`
    point_1Id = point_1.attr('id');
    point_2Id = point_2.attr('id');
    controlPointId = controlPoint.attr('id');
    elsToRemove.push(point_1Id, point_2Id, controlPointId);
    // calling method `drag`
    point_1.drag(movePoint, null, null);
    point_2.drag(movePoint, null, null);
    controlPoint.drag(movePoint, null, null);
  });

  // drawing Q Bezier curve by click
  $(BTN_CREATE_CURVE).on('click', function(e) {
    e.preventDefault();

    let startPointX = point_1.attr('cx');
    let startPointY = point_1.attr('cy');
    let controlPointX = controlPoint.attr('cx');
    let controlPointY = controlPoint.attr('cy');
    let endPointX = point_2.attr('cx');
    let endPointY = point_2.attr('cy');
    let pathAttrD = `M${startPointX} ${startPointY} Q ${controlPointX} ${controlPointY} ${endPointX} ${endPointY}`;
    //console.log(pathAttrD); // test
    let signalLineStartPoint = `<line x1=${startPointX} y1=${startPointY} x2=${controlPointX} y2=${controlPointY} style="stroke:rgba(255,127,124,0.5);stroke-width:2" id='signal_line_1' class='signal-line' />`;
    let signalLineEndPoint = `<line x1=${controlPointX} y1=${controlPointY} x2=${endPointX} y2=${endPointY} style="stroke:rgba(255,127,124,0.5);stroke-width:2" id='signal_line_2' class='signal-line' />`;
    let pathEl = `<path d='${pathAttrD}' style="fill:transparent;stroke:black;stroke-width:2" id='quadratic_bezier_curve' class='curve'>`;
    curve = Snap.parse(pathEl);
    let signalLineStart = Snap.parse(signalLineStartPoint);
    let signalLineEnd = Snap.parse(signalLineEndPoint);
    S.append(curve);
    S.append(signalLineStart);
    S.append(signalLineEnd);
    // displays another tip
    tipContentCurrent = TIP_CONTENT_AFTER_CREATING_CURVE;
    $(TIP_CONTENT).text(tipContentCurrent);
    // adds elements to array for removing
    signalLine_1 = S.select('#signal_line_1');
    signalLine_2 = S.select('#signal_line_2');
    curveToRemove = S.select('#quadratic_bezier_curve');
    signalLine_1Id = signalLine_1.attr('id');
    signalLine_2Id = signalLine_2.attr('id');
    curveToRemoveId = curveToRemove.attr('id');
    elsToRemove.push(signalLine_1Id, signalLine_2Id, curveToRemoveId);
    leaveUniqueArrEls(elsToRemove); // leave only unique els in array
    console.log(elsToRemove); // test
  });

  // clean the canvas
  // using custom event
  $('#sandbox').bind('cleanCanvas', function() {
    console.log('cleanCanvas'); // test
  });

  $(BTN_CLEAN).on('click', function(e) {
    e.preventDefault();

    // - removes all elements except for SVG area's grid
    //console.log(elsToRemove.length); // test
    //console.log(elsToRemove.toString()); // test
    $.each(elsToRemove, function(i, val) {
      console.log(`${i} | ${val}`);
      S.select(`#${val}`).remove();
    });

    $('#sandbox').trigger('cleanCanvas');
    pointsCoordsInit.length = 0;
    console.log(pointsCoordsInit.length); // test
    $('.tip').hide();
    $(BTN_CREATE_CURVE).attr('disabled', true);
    $(BTN_CLEAN).attr('disabled', true);
    $(COORDS_WRAPPER).hide().html('');
  });

  const restoreTip = () => {
    tipContentCurrent = TIP_CONTENT_INIT;
    $(TIP_CONTENT).text(tipContentCurrent);
    $('.tip').show();
  }

  $('#sandbox').on('cleanCanvas', function() {
    setTimeout(restoreTip, 3000);
    // nullifies counter & array for removing elements
    counterOfPoints = 0;
    elsToRemove.length = 0;
  });
});
