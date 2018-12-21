'use strict';

// unfolding top nav

$('.top-nav').bind('topNavUnfolding', function(event, collapsedNavId) {
  console.log(collapsedNavId); // test
  $('.nav-collapse').each(function(i, el) {
    let currentCollapsedNavId = $(el).attr('id');
    if(currentCollapsedNavId == collapsedNavId) {
      let liAmount = $(el).find('li').length;
      let unfoldedNavHeight = 30 * liAmount + 100;
      //console.log(unfoldedNavHeight); // test
      $(el).css('height', unfoldedNavHeight + 'px');
      $(el).show();
    }
  });
});

// folding top nav

$('.top-nav').bind('topNavFolding', function(event, collapsedNavId) {
  $('.nav-collapse').each(function(i, el) {
    let currentCollapsedNavId = $(el).attr('id');
    if(currentCollapsedNavId == collapsedNavId) {
      $(el).hide();
    }
  });
});

let dataTarget = '';

$('.nav-toggler').on('click', function() {
  if( $(this).hasClass('active') ) {
    $(this).find('.top-nav-toggler-icon').show();
    $(this).find('.top-nav-toggler-icon-close').hide();
    $(this).removeClass('active');
    $(this).trigger('topNavFolding', [dataTarget]);
  } else {
    dataTarget = $(this).data('target');
    dataTarget = dataTarget.replace('#', '');
    console.log(dataTarget); // test
    $(this).trigger('topNavUnfolding', [dataTarget]);
    $(this).find('.top-nav-toggler-icon').hide();
    $(this).find('.top-nav-toggler-icon-close').show();
    $(this).addClass('active');
  }
});

$(document).on('topNavUnfolding', function() {
  
});
