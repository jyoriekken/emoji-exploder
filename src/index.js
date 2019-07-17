class EmojiExploder {
  constructor() {
    this.inBrowser = !!window
    this.x = window.innerWidth / 2
    this.y = window.innerHeight / 2
    this.defaultEmoji = '🔥'
    this.emojiLifespan = 2000
    this.renderSpeed = 1000 / 15
    this.addEvents()
  }

  addEvents() {
    if (!this.inBrowser) return
    window.addEventListener('pointermove', this.onPointerMove.bind(this))
  }

  onPointerMove(e) {
    this.x = e.pageX
    this.y = e.pageY
  }

  explode() {
    if (!this.inBrowser) return

    const emojiEle = document.createElement('div')
    emojiEle.style = `position: absolute; left: ${this.x}px; top: ${this.y}px; opacity: 1`
    emojiEle.textContent = this.pickEmoji()
    emojiEle.dataset.drift = (-0.5 + Math.random()) * 4
    const emojiRef = document.body.appendChild(emojiEle)

    // Animate emoji
    this.animateEmoji(emojiRef)

    // Expire emoji after lifespan
    setTimeout(this.expireEmoji.bind(this, emojiRef), this.emojiLifespan)
  }

  animateEmoji(emoji) {
    if (!emoji) return

    setInterval(() => {
      emoji.style.top = `${parseInt(emoji.style.top) + 5}px`
      emoji.style.left = `${parseInt(emoji.style.left) + parseInt(emoji.dataset.drift)}px`
      emoji.style.opacity = `${emoji.style.opacity * 0.98}`
    }, this.renderSpeed)
  }

  expireEmoji(emoji) {
    document.body.removeChild(emoji)
  }

  pickEmoji() {
    return this.defaultEmoji
  }
}

export default EmojiExploder
