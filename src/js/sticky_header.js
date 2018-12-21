'use strict';

// sticky top header

let topHeaderStartPos = $('.header').offset();
let topHeaderStartPosTop = topHeaderStartPos.top;

let windowInnerHeight = $(window).innerHeight();

$(window).scroll(function() {
  if ( $(this).scrollTop() > topHeaderStartPosTop ) {
    $('.header').addClass('fixed-top');
  } else {
    $('.header').removeClass('fixed-top');
  }
});
