'use strict';

// link to top

$('.link-to-top').on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({ scrollTop: 0 }, 600);
});
