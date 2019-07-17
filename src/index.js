import { Engine, Body, Bodies, World } from 'matter-js'
import randomEmoji from 'random-emoji'

require('./index.css')

class EmojiExploder {
  constructor() {
    this.emojis = {}
    this.defaultEmoji = null
    this.renderSpeed = 1000 / 15
    this.lifespanTicks = 40
    this.latestId = 0
    this.inBrowser = !!window

    this.cursorX = window.innerWidth / 2
    this.cursorY = window.innerHeight / 2

    this.addEvents()
    this.initMatterJs()

    // prettier-ignore
    ;(function run() {
      window.requestAnimationFrame(run.bind(this))
      Engine.update(this.engine, 1000 / 60)
      this.tick()
    }.apply(this))
  }

  tick() {
    for (const emojiGuid in this.emojis) {
      const emojiData = this.emojis[emojiGuid]
      if (!emojiData) continue

      emojiData.lifespan += 1

      if (emojiData.lifespan > this.lifespanTicks) {
        emojiData.el.remove()
        World.remove(this.engine.world, emojiData.physicsBody)
        delete this.emojis[emojiGuid]
      } else {
        emojiData.position.x = emojiData.physicsBody.position.x
        emojiData.position.y = emojiData.physicsBody.position.y
        this.renderEmoji(emojiData)
      }
    }
  }

  initMatterJs() {
    // create an engine
    this.engine = Engine.create()

    // run the engine
    Engine.run(this.engine)
  }

  makeEmojiGuid() {
    this.latestId++
    return this.latestId
  }

  addEvents() {
    window.addEventListener('pointermove', this.onPointerMove.bind(this))
  }

  onPointerMove(e) {
    this.cursorX = e.pageX
    this.cursorY = e.pageY
  }

  spawnAtCursor() {
    const emojiGuid = this.makeEmojiGuid()
    const emojiEle = document.createElement('div')

    // Construct emoji DOM
    emojiEle.dataset.guid = emojiGuid
    emojiEle.classList.add('emo_explo--emoji')
    emojiEle.textContent = this.pickEmoji()

    // Insert and save ref to emoji
    const emojiRef = document.body.appendChild(emojiEle)
    const emojiData = {
      el: emojiRef,
      physicsBody: null,
      lifespan: 0,
      scale: 1,
      position: {
        x: this.cursorX,
        y: this.cursorY
      },
      drift: (-0.5 + Math.random()) * 4
    }

    // Add entry to physics simulation
    const newBody = Bodies.circle(emojiData.position.x, emojiData.position.y, 15)
    newBody.slop = 1
    Body.applyForce(
      newBody,
      { x: 0, y: 0 },
      { x: Math.random() * 0.005, y: Math.random() * -0.005 }
      // { x: Math.random() * 0.0001, y: Math.random() * -0.00015 }
    )
    World.add(this.engine.world, newBody)
    emojiData.physicsBody = newBody

    // Track emoji in "db"
    this.emojis[emojiGuid] = emojiData
  }

  renderEmoji(emojiData) {
    emojiData.el.style.transform = this.buildEmojiTransform(emojiData)
  }

  buildEmojiTransform(emojiData) {
    return `
      translateX(${emojiData.position.x}px)
      translateY(${emojiData.position.y}px)
      scale(${1 - emojiData.lifespan / this.lifespanTicks})
    `
  }

  pickEmoji() {
    return this.defaultEmoji || randomEmoji.random({ count: 1 })[0].character
  }
}

export default EmojiExploder
