export class EventDelegation {
  /** @param {Element} element */
  constructor (element) {
    this.element = element
    this.listeners = []
  }

  _assignOptions (event, listener) {
    let options = {}

    if (typeof event === 'string') {
      Object.assign(options, { event, listener })
    } else {
      options = event
    }

    return options
  }

  /**
   * @typedef Options
   * @property {String} event
   * @property {String} target
   */

  /**
   * @param {String|Options} event
   * @param {Function} [listener]
   */
  on (event, listener = undefined) {
    const options = this._assignOptions(event, listener)

    this.listeners.push(options.listener)
    this.element.addEventListener(options.event, event => {
      for (const listener of this.listeners) {
        listener(event)
      }
    })
  }

  /**
   * @param {String|Options} event
   * @param {Function} [listener]
   */
  off (event, listener = undefined) {
    const options = this._assignOptions(event, listener)

    this.listeners = this.listeners.filter(item => item !== options.listener)
    this.element.removeEventListener(options.event, options.listener)
  }
}
