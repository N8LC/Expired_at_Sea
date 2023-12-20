// Creates a new class to contain all 'sprites' eg. background image or player sprite
class Sprite {
  constructor({position, image, frames = { max: 1 }, sprites = [], textBubble = Nothing, talking = false, speed = 3}) {
    this.position = position
    this.image = image
    this.frames = {...frames, val: 0, elapsed: 0}
    this.sprites = sprites
    this.textBubble = textBubble
    this.talking = talking
    this.speed = speed

    // Makes sure that the width and height property is only calculated after the image is loaded
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max
      this.height = this.image.height
    }
    this.moving = false
  }

  draw() {
    // Makes sure that if the image changes, so does the height and width
    this.width = this.image.width / this.frames.max
    this.height = this.image.height
    
    c.drawImage(
      this.image,
      // Next 4 numbers are for cropping image
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      // These determine how the image is displayed
      this.image.width / this.frames.max,
      this.image.height
    )

    c.drawImage(
      this.textBubble,
      this.position.x + (this.image.width/this.frames.max - this.textBubble.width)/2,
      this.position.y - 50
    )

    // Only plays animation when moving
    if (!this.moving) return
    
    // Slows animation down
    if (this.frames.max > 1) {
      this.frames.elapsed++
    }

    if (this.frames.elapsed % 10 === 0) {
      // Iterates through sprites to create animation
      if (this.frames.val < this.frames.max - 1) {
        this.frames.val++
      }
      else {
        this.frames.val = 0
      }
    }
  }
}

// This class draws out the red 'collision' pieces
class Boundary {
  static width = 48
  static height = 48
  constructor({position, width, height}) {
    this.position = position
    this.width = width
    this.height = height
  }

  draw() {
    c.fillStyle = 'rgba(255,0,0,0.0)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}

// This class draws out the doors
class Door {
  static width = 48
  static height = 48
  constructor({position, width, height}) {
    this.position = position
    this.width = width
    this.height = height
  }

  draw() {
    c.fillStyle = 'rgba(0,255,0,0.0)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }
}