export class EventDelegation {
  /**
   * @typedef Listener
   * @property {Function} callback
   * @property {boolean} capture
   */

  /**
   * @typedef {Object} ListenersObject
   * @property {Listener[]} [event]
   */

  /** @param {Element} element */
  constructor (element) {
    /** @type {Element} */
    this.element = element

    /** @type {ListenersObject} */
    this.listeners = {}
  }

  _resolveArguments (event, listener, options) {
    let args = {}

    if (typeof event === 'string') {
      Object.assign(args, { event, listener })
      if (options !== undefined && typeof options === 'object') Object.assign(args, { options })
      if (options === true) Object.assign(args, { options: { capture: true } })
    } else {
      args = event
    }

    return args
  }

  /** @param {Event} event */
  _callListeners (event) {
    if (!this.listeners[event.type]) return

    for (const listener of this.listeners[event.type]) {
      listener.callback(event)
      if (listener.capture) return
    }
  }

  /**
   * @typedef ArgumentsObject
   * @property {string} event
   * @property {Function} [listener]
   * @property {boolean|Options} [options]
   */

  /**
   * @typedef Options
   * @property {boolean} [capture]
   */

  /**
   * @param {string|ArgumentsObject} event
   * @param {Function} [listener]
   * @param {Options} [options]
   */
  on (event, listener = undefined, options = undefined) {
    const args = this._resolveArguments(event, listener, options)

    if (!this.listeners[args.event]) {
      this.element.addEventListener(args.event, this._callListeners.bind(this))
      this.listeners[args.event] = []
    }

    this.listeners[args.event].push({
      event: args.event,
      callback: args.listener,
      capture: args.options?.capture || false
    })
  }

  /**
   * @param {string|ArgumentsObject} event
   * @param {Function} [listener]
   * @param {Options} [options]
   */
  off (event, listener = undefined, options = undefined) {
    const args = this._resolveArguments(event, listener, options)

    this.listeners[args.event] = this.listeners[args.event].filter(
      /** @param {Listener} listener */
      listener => listener.callback !== args.listener
    )
  }
}
