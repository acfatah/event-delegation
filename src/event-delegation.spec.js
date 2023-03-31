import { describe, it, expect, vi, afterEach } from 'vitest'
import { EventDelegation } from './event-delegation.js'

describe('EventDelegation', () => {
  describe('listener registration', () => {
    afterEach(async () => {
      vi.restoreAllMocks()
    })

    describe('using string and callback arguments', () => {
      it('register the event listener', () => {
        const div = document.createElement('div')

        div.innerHTML = `
          <div>
            <label for="username">Username</label>
            <input id="username" />
            <button>Print Username</button>
          </div>
        `
        const eventDelegation = new EventDelegation(div)
        /** @type {Element} button */
        const button = div.querySelector('button')
        const clickListener = vi.fn()

        eventDelegation.on('click', clickListener)
        button.click()

        expect(clickListener).toHaveBeenCalled()
      })
    })

    describe('using object argument', () => {
      it('register the event listener', () => {
        const div = document.createElement('div')
        div.innerHTML = `
          <div>
            <label for="username">Username</label>
            <input id="username" />
            <button>Print Username</button>
          </div>
        `
        const eventDelegation = new EventDelegation(div)
        /** @type {Element} button */
        const button = div.querySelector('button')
        const listener = vi.fn()

        eventDelegation.on({
          event: 'click',
          listener
        })
        button.click()

        expect(listener).toHaveBeenCalled()
      })
    })
  })

  describe('event propagation', () => {
    describe('using string, callback and boolean arguments', () => {
      it('should stop if options.capture is thruthy', () => {
        const div = document.createElement('div')
        div.innerHTML = `
          <div class="parent">
            <label for="username">Username</label>
            <input id="username" />
            <button>Print Username</button>
          </div>
        `
        const eventDelegation = new EventDelegation(div)
        /** @type {Element} */
        const button = div.querySelector('button')
        const parentListener = vi.fn()
        const buttonListener = vi.fn()

        eventDelegation.on('click', buttonListener, true)
        eventDelegation.on('click', parentListener)

        button.click()
        expect(buttonListener).toBeCalled()
        expect(parentListener).not.toBeCalled()
      })
    })

    describe('using object argument', () => {
      it('should stop if options.capture is thruthy', () => {
        const div = document.createElement('div')
        div.innerHTML = `
          <div class="parent">
            <label for="username">Username</label>
            <input id="username" />
            <button>Print Username</button>
          </div>
        `
        const eventDelegation = new EventDelegation(div)
        /** @type {Element} */
        const button = div.querySelector('button')
        const parentListener = vi.fn()
        const buttonListener = vi.fn()

        eventDelegation.on({
          event: 'click',
          listener: buttonListener,
          options: { capture: true }
        })
        eventDelegation.on({ event: 'click', listener: parentListener })

        button.click()
        expect(buttonListener).toBeCalled()
        expect(parentListener).not.toBeCalled()
      })
    })
  })

  describe('listener removal using options object', () => {
    it('should not call the listener', () => {
      const div = document.createElement('div')
      div.innerHTML = `
        <div>
          <label for="username">Username</label>
          <input id="username" />
          <button>Print Username</button>
        </div>
      `
      const eventDelegation = new EventDelegation(div)
      /** @type {Element} button */
      const button = div.querySelector('button')
      const listener = vi.fn()

      eventDelegation.on({ event: 'click', listener })
      button.click()
      expect(listener).toBeCalled()

      eventDelegation.off({ event: 'click', listener })
      button.click()
      expect(listener).toBeCalledTimes(1)
    })
  })
})
