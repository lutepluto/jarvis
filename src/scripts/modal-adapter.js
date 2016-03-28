// Modal adpater for AJAX loading modal

import $ from 'jquery'

$(document).on('click', '[data-toggle="modal"]', (e) => {
  e.preventDefault()
  let $this = $(e.currentTarget),
    url = $this.attr('href'),
    id = $this.attr('data-target').slice(1)

  if (url.indexOf('#') === 0) {
    $(url).modal('open')
  } else {
    let params = $this.attr('data-form-params')
    let data = params ? $(`#${params}`).serialize() : {}

    $.get(url, data, (data) => {
      $(`<div class="modal fade" id="${id}" role="dialog" aria-hidden="true">${data}</div>`)
        .modal()
        .on('hidden.bs.modal', e => $(e.currentTarget).remove())
        .on('shown.bs.modal', () => $this.trigger('shown.modal'))
    })
  }
}).off('click.bs.modal.data-api')