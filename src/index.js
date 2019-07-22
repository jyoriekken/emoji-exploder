import { Engine, Body, Bodies, World } from 'matter-js'
import randomEmoji from 'random-emoji'

require('./index.scss')

class EmojiExploder {
  constructor() {
    this.emojis = {}
    this.defaultEmoji = null
    this.renderSpeed = 1000 / 15

    this.explosionDensity = 15
    this.explosionForce = 0.05
    this.emojiLifespan = 50
    this.emojiScale = 2
    this.emojiBodySize = 25
    this.emojiBodyOverlap = 2.5
    this.worldGravity = { x: 0.0, y: 0.0 }

    this.latestId = 0
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

      if (emojiData.lifespan > this.emojiLifespan) {
        World.remove(this.engine.world, emojiData.physicsBody)
        emojiData.el.remove()
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
    this.engine.world.gravity = this.worldGravity

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

  explodeAtElement(element) {
    const elementRect = element.getClientRects()[0]

    const explosionLoop = setInterval(() => {
      this.spawnAtCursor({
        x: elementRect.x + elementRect.width * Math.random(),
        y: elementRect.y + elementRect.height * Math.random()
      })
    })

    setTimeout(() => {
      clearTimeout(explosionLoop)
    }, this.explosionDensity)
  }

  explodeAtCursor() {
    const cursorPosition = {
      x: this.cursorX,
      y: this.cursorY
    }

    const explosionLoop = setInterval(() => {
      this.spawnAtCursor({
        x: cursorPosition.x + (-0.5 + Math.random()) * 10,
        y: cursorPosition.y + (-0.5 + Math.random()) * 10
      })
    })

    setTimeout(() => {
      clearTimeout(explosionLoop)
    }, this.explosionDensity)
  }

  spawnAtCursor(cursorPosition = { x: 0, y: 0 }) {
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
        x: cursorPosition.x,
        y: cursorPosition.y
      }
    }

    // Add entry to physics simulation
    const newBody = Bodies.circle(emojiData.position.x, emojiData.position.y, this.emojiBodySize)
    const randForceX = -0.5 + Math.random()
    const randForceY = -0.5 + Math.random()

    // Allow bodies to pass into one another
    newBody.slop = this.emojiBodyOverlap

    // Send em flying
    Body.applyForce(
      newBody,
      { x: cursorPosition.x, y: cursorPosition.y },
      {
        x: randForceX * this.explosionForce,
        y: randForceY * this.explosionForce
      }
    )

    // Track em
    World.add(this.engine.world, newBody)

    // Keep refs
    emojiData.physicsBody = newBody
    this.emojis[emojiGuid] = emojiData
  }

  renderEmoji(emojiData) {
    emojiData.el.style.transform = this.buildEmojiTransform(emojiData)
    emojiData.el.style.opacity = 1 - emojiData.lifespan / this.emojiLifespan
  }

  buildEmojiTransform(emojiData) {
    return `
      translateX(${emojiData.position.x}px)
      translateY(${emojiData.position.y}px)
      scale(${this.emojiScale - emojiData.lifespan / this.emojiLifespan})
    `
  }

  pickEmoji() {
    return this.defaultEmoji || randomEmoji.random({ count: 1 })[0].character
  }
}

export default EmojiExploder
