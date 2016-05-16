
(($, window) => {

  const $sidenav   = $('.navbar-side')
  const $container = $('.main-container')

  const fixHeight = () => {

    var windowHeight = window.innerHeight
    var sidenavHeight = $sidenav.outerHeight()
    var containerHeight = $container.outerHeight()

    if (windowHeight > sidenavHeight && windowHeight > containerHeight) {
      $container.css('min-height', windowHeight + 'px')
    } else {
      $container.css('min-height',
        sidenavHeight > containerHeight ?
          (sidenavHeight + 'px') :
          (window.innerHeight + 'px')
      )
    }
  }

  $(window).on('load resize', fixHeight)

})(jQuery, window)