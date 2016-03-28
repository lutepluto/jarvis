$(document).ready(function() {
  var $mainContainer = $('.main-container')
  $(window).on('load resize', function() {
    $mainContainer.css('min-height', window.innerHeight)
  })

  $('tbody').on('change', 'input[type="checkbox"]', function(e) {
    e.currentTarget.checked ?
      $(e.currentTarget).parentsUntil('tbody').last().addClass('active') :
      $(e.currentTarget).parentsUntil('tbody').last().removeClass('active')
  })

  $('thead').on('change', 'input[type="checkbox"]', function(e) {
      var $checkboxes = $(e.currentTarget)
        .parentsUntil('table')
        .last()
        .next('tbody')
        .find('tr > td:first-child > input[type="checkbox"]')
        .each(function() {
          $(this).prop('checked', e.currentTarget.checked).change()
        })
  })

  $('.input-field').focus(function(e) {
    $(e.currentTarget).next('label').addClass('active')
  }).blur(function(e) {
    var $input
    ($input = $(e.currentTarget)) && !$input.val().trim() ?
      $input.next('label').removeClass('active') : void 0
  })
})
