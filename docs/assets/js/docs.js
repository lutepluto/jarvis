(function($) {
  $(function() {

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

    $('#single-select').select2()
    $('#single-select-jarvis').select2({
      theme: 'jarvis',
      placeholder: "Select a state"
    })
    $('#multiple-select-jarvis').select2({
      theme: 'jarvis',
      placeholder: "Select a state"
    })
    
  })
})(jQuery)