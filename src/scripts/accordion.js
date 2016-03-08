import Util from './util'

const Accordion = (($) => {

  const NAME                = 'accordion'
  const VERSION             = '0.0.1'
  const DATA_KEY            = 'jar.accordion'
  const EVENT_KEY           = `.${EVENT_KEY}`
  const JQUERY_NO_CONFLICT  = $.fn[NAME]
  const TRANSITION_DURATION = 600

  const Event = {
    SHOW   : `show${EVENT_KEY}`,
    SHOWN  : `shown${EVENT_KEY}`,
    HIDE   : `hide${EVENT_KEY}`,
    HIDDEN : `hidden${EVENT_KEY}`,
    CLICK  : `click${EVENT_KEY}`,
    LOAD   : `load${EVENT_KEY}`
  }

  const ClassName = {
    ACTIVE     : 'active',
    IN         : 'in',
    COLLAPSE   : 'collapse',
    COLLAPSED  : 'collapsed',
    COLLAPSING : 'collapsing'
  }

  const Dimension = {
    WIDTH  : 'width',
    HEIGHT : 'height'
  }

  const Selector = {
    DATA_TOGGLE   : '[data-toggle="accordion"]'
  }

  class Accordion {

    constructor(element, options) {
      this._element = $(element)
      // this._bellows = this._getBellows()
      
      this._isTransitioning = false

      this._addEventListeners()
    }

    static get Default() {}

    toggle(event) {
      event.preventDefault()
      let $target = this._getTargetFromElement(event.currentTarget)
      $target.hasClass(ClassName.IN) ? this.hide($target) : this.show($target)
    }

    show($target) {
      if (this._isTransitioning || $target.hasClass(ClassName.IN)) {
        return
      }

      let $actives, $activesTarget
      let selector = `.${ClassName.ACTIVE} [data-parent="#${this._element[0].id}"]`
      $actives = this._element.find(`.${ClassName.ACTIVE} [data-parent="#${this._element[0].id}"]`)
      if ($actives.length) {
        $activesTarget = this._getTargetFromElement($actives[0])
        if ($activesTarget && $activesTarget.length && $activesTarget.hasClass(ClassName.COLLAPSING)) {
          return
        }
      }

      let event = $.Event(Event.SHOW, { _relatedTarget: $target[0] })
      this._element.trigger(event)
      if (event.isDefaultPrevented()) {
        return
      }

      if ($actives.length) {
        this.hide($activesTarget)
      }

      let dimension = this._getDimension($target)
      let targetId = $target.attr('id')

      $target
        .removeClass(ClassName.COLLAPSE)
        .addClass(ClassName.COLLAPSING)
        .css(dimension, 0)
        .attr('aria-expanded', true)

      $(`[data-parent="#${this._element[0].id}"][data-target="#${targetId}"],
        [data-parent="#${this._element[0].id}"][href="#${targetId}"]`)
        .removeClass(ClassName.COLLAPSED)
        .attr('aria-expanded', true)
        .parentsUntil(this._element)
        .addClass(ClassName.ACTIVE)

      this._isTransitioning = true

      let complete = () => {
        $target
          .removeClass(ClassName.COLLAPSING)
          .addClass(ClassName.COLLAPSE)
          .addClass(ClassName.IN)
          .css(dimension, '')

        this._isTransitioning = false
        this._element.trigger($.Event(Event.SHOWN, { _relatedTarget: $target[0] }))
      }

      if (!Util.supportsTransitionEnd()) {
        return complete()
      }

      let capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1)
      let scrollSize = `scroll${capitalizedDimension}`

      $target
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(TRANSITION_DURATION)

      $target.css(dimension, `${$target[0][scrollSize]}px`)
    }

    hide($target) {
      if (this._isTransitioning || !$target.hasClass(ClassName.IN)) {
        return
      }

      let event = $.Event(Event.HIDE, { _relatedTarget: $target[0] })
      this._element.trigger(event)
      if (event.isDefaultPrevented()) {
        return
      }

      let dimension = this._getDimension($target)
      let offsetDimension = dimension === Dimension.WIDTH ?
        'offsetWidth' : 'offsetHeight'
      let targetId = $target.attr('id')

      $target.css(dimension, `${$target[0][offsetDimension]}px`)

      Util.reflow($target[0])

      $target
        .addClass(ClassName.COLLAPSING)
        .removeClass(ClassName.COLLAPSE)
        .removeClass(ClassName.IN)
        .attr('aria-expanded', false)

      $(`[data-parent="#${this._element[0].id}"][data-target="#${targetId}"],
        [data-parent="#${this._element[0].id}"][href="#${targetId}"]`)
        .addClass(ClassName.COLLAPSED)
        .attr('aria-expanded', false)
        .parentsUntil(this._element)
        .removeClass(ClassName.ACTIVE)

      this._isTransitioning = true

      let complete = () => {
        this._isTransitioning = false
        $target
          .removeClass(ClassName.COLLAPSING)
          .addClass(ClassName.COLLAPSE)

        this._element.trigger($.Event(Event.HIDDEN, { _relatedTarget: $target[0] }))
      }

      $target.css(dimension, 0)

      if (!Util.supportsTransitionEnd()) {
        return complete()
      }

      $target
        .one(Util.TRANSITION_END, complete)
        .emulateTransitionEnd(TRANSITION_DURATION)
    }

    _addEventListeners() {
      this._element.on(Event.CLICK, `[data-parent="#${this._element[0].id}"]`, $.proxy(this.toggle, this))
    }

    _getDimension($element) {
      let hasWidth = $element.hasClass(Dimension.WIDTH)
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT
    }

    _getBellows() {
      let selector = `[data-parent="#${this._element[0].id}"]`
      return $(selector, `#${this._element[0].id}`)
    }

    _getTargetFromElement(element) {
      let selector = Util.getSelectorFromElement(element)
      return selector ? $(selector) : null
    }

    static _plugin(option) {
      return this.each(function() {
        let $this = $(this)
        let data = $this.data(DATA_KEY)
        let options = $.extend({}, Accordion.Default, $this.data(), typeof option === 'object' && option)

        if (!data) $this.data(DATA_KEY, (data = new Accordion(this, options)))
      })
    }
  }

  $(window).on(Event.LOAD, () => {
    $(Selector.DATA_TOGGLE).each(function() {
      var $accordion = $(this)
      Accordion._plugin.call($accordion, $accordion.data())
    })
  })

  return Accordion

})(jQuery)

export default Accordion