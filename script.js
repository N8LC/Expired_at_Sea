// Sets up our canvas, and uses 'c' variable to get info about the canvas
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// These variables center the player by moving him a little depending on how big his current image is
var play_image_x = 192
var play_image_y = 68

// This sets the fade div 0 height and 0 width so we can click buttons 
document.getElementById('FadeBlock').style.width = "0";
document.getElementById('FadeBlock').style.height = "0";

// This variable is used to tell when the loading animation needs to be played
var justFinished = false

// offsets boundaries along with map
const offset = {
  x: -6087,
  y: -2282,
}

// Sets Canvas Height and Width
canvas.width = 1024
canvas.height = 576

// Creates doors for the overworld
let doors = createDoors(doorData, 300, 1025, offset.x, offset.y)

// Creates boundaries for the overworld
let boundaries = createBoundaries(collisions, 300, 1025, offset.x, offset.y)

// These Images are for the title sequence
const titleImage = new Image()
titleImage.src = 'Images/Intro/Title.png'

const authorImage = new Image()
authorImage.src = 'Images/Intro/Author_Text.png'

// Makes Image html code
const image = new Image()
image.src = 'Images/MapSprites/PokeMap.png'

const foregroundImage = new Image()
foregroundImage.src = 'Images/MapSprites/Foreground.png'

const firstHouse = new Image()
firstHouse.src = 'Images/MapSprites/FirstHouse.png'

const indoorForeground = new Image()
indoorForeground.src = 'Images/MapSprites/IndoorRoom.png'

// These are all text bubble images
const blankText = new Image()
blankText.src = 'Images/MISCSprites/BlankText.png'

const Nothing = new Image()
Nothing.src = 'Images/MISCSprites/Nothing.png'

const HilkrenHelloBubble = new Image()
HilkrenHelloBubble.src = 'Images/NPCSprites/HilkrenHelloBubble.png'

// Hilkren's animation frames
const hilkrenDownImage = new Image()
hilkrenDownImage.src = 'Images/NPCSprites/HilkrenDown.png'

const hilkrenUpImage = new Image()
hilkrenUpImage.src = 'Images/NPCSprites/HilkrenUp.png'

const hilkrenLeftImage = new Image()
hilkrenLeftImage.src = 'Images/NPCSprites/HilkrenLeft.png'

const hilkrenRightImage = new Image()
hilkrenRightImage.src = 'Images/NPCSprites/HilkrenRight.png'

// These images are all for animating the player character
const playerDownImage = new Image()
playerDownImage.src = 'Images/PlayerAnimations/playerDown.png'

const playerUpImage = new Image()
playerUpImage.src = 'Images/PlayerAnimations/playerUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = 'Images/PlayerAnimations/playerLeft.png'

const playerRightImage = new Image()
playerRightImage.src = 'Images/PlayerAnimations/playerRight.png'

// The following images are for when the player is in a boat
const playerDownBoat = new Image()
playerDownBoat.src = 'Images/PlayerAnimations/PlayerDownBoat.png'

const playerUpBoat = new Image()
playerUpBoat.src = 'Images/PlayerAnimations/PlayerUpBoat.png'

const playerRightBoat = new Image()
playerRightBoat.src = 'Images/PlayerAnimations/PlayerRightBoat.png'

const playerLeftBoat = new Image()
playerLeftBoat.src = 'Images/PlayerAnimations/PlayerLeftBoat.png'

// The following images are for the luke npc sprite
const lukeDown = new Image()
lukeDown.src = 'Images/NPCSprites/LukeDown.png'

const lukeRight = new Image()
lukeRight.src = 'Images/NPCSprites/LukeRight.png'

const lukeLeft = new Image()
lukeLeft.src = 'Images/NPCSprites/LukeLeft.png'

const lukeUp = new Image()
lukeUp.src = 'Images/NPCSprites/LukeUp.png'

// Creates the Player sprite 
const player = new Sprite ({
  position: {
    // This uses the static pixel value of the sprite - found in finder by using get info on image (play_image_x, play_image_y)
    x: canvas.width / 2 - play_image_x / 4 / 2,
    y: canvas.height / 2 - play_image_y / 2
  },
  image: playerDownImage,
  frames: {
    max: 4
  },
  sprites: {
    up: playerUpImage,
    right: playerRightImage,
    left: playerLeftImage,
    down: playerDownImage
  },
  textBubble: Nothing,
  speed: 6
})

// This boundary is used for the player to make sure that npcs don't run them over
const playerHitbox = new Boundary({
  position: {
    x: player.position.x + 5,
    y: player.position.y - 5
  },
  width: 40,
  height: 70
})

// This gives the boats the little text bubble things
const boatBubbles = new Sprite ({
  position: {
    x: offset.x + 4534,
    y: offset.y + 1833
  },
  image: blankText
})

const boatBubblesMain = new Sprite ({
  position: {
    x: offset.x + 10460,
    y: offset.y + 1455
  },
  image: blankText
})

// Creates the title for the intro sequence
const title = new Sprite ({
  position: {
    x: canvas.width/5,
    y: canvas.height/7
  },
  image: titleImage
})

// Creates the author text for the intro sequence
const author = new Sprite ({
  position: {
    x: canvas.width/7,
    y: canvas.height/1.3
  },
  image: authorImage
})

// 'Spawn' point for main island
const mainSpawn = new Sprite ({
  position: {
    x: offset.x + 10460,
    y: offset.y + 1455
  },
  image: Nothing
})

// This is the 'spawn' point for characters when they leave the boat (at hilkren island)
const hilkrenSpawn = new Sprite ({
  position: {
    x: offset.x + 3870,
    y: offset.y + 1525
  },
  image: Nothing
})

// Creates hilkren npc sprite
const hilkren = new Sprite ({
  position: {
    x: offset.x + 3498,
    y: offset.y + 1707
  },
  image: hilkrenDownImage,
  frames: {
    max: 4
  },
  sprites: {
    up: hilkrenUpImage,
    right: hilkrenRightImage,
    left: hilkrenLeftImage,
    down: hilkrenDownImage
  },
  textBubble: blankText,
  speed: 3
})

// This boundary is used for the npc character to give him a hitbox
const hilHitbox = new Boundary({
  position: {
    x: hilkren.position.x + 10,
    y: hilkren.position.y + 15
  },
  width: 40,
  height: 40
})

// Luke character sprite
const luke = new Sprite ({
  position: {
    x: 7897,
    y: 335
  },
  image: lukeDown,
  frames: {
    max: 4
  },
  sprites: {
    up: lukeUp,
    right: lukeRight,
    left: lukeLeft,
    down: lukeDown
  },
  textBubble: blankText,
  speed: 3
})

// This boundary is used for the luke npc character to give him a hitbox
const lukeHitbox = new Boundary({
  position: {
    x: luke.position.x + 10,
    y: luke.position.y + 15
  },
  width: 40,
  height: 40
})

// creates a new sprite using the sprite class, this will be the map for the game
const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: image
})

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y
  },
  image: foregroundImage
})

// This const is used to know when keys are being pushed down
const keys = {
  w: {
    pressed: false
  },
  a: {
    pressed: false
  },
  s: {
    pressed: false
  },
  d: {
    pressed: false
  },
  e: {
    pressed: false
  }
}

// Code from Stack Overflow
canvas.onclick = function() { 
  alert(background.position.x);
  alert(background.position.y); 
}

// This contains all npc hitboxes for easy access
let NPCHitBoxes = [hilHitbox, lukeHitbox]

// This constant is the things that need to move to give the illusion that the player is moving around
// Uses spread operator (...) to put all items in the boundaries array into the movables const
let movables = [background, ...boundaries, ...doors, foreground, hilkren, luke, ...NPCHitBoxes, boatBubbles, boatBubblesMain, mainSpawn, hilkrenSpawn]

// These variables help with the random movement of the npc
let hilkrenCounter = 0
let rand = 0

// These variables help with the random movement of the luke npc
let lukeCounter = 0
let rand2 = 0

// These variable makes it so that the e button cannot be used aton
int_time = 500
can_press = true

// This variable determines when the player is drawn
let playerDrawn = false
let intro = true

// This variable is used to determine which key was last pressed
let lastKey = ''

// This variable is used in the intro
var y_pos = []

movables.forEach((movable) => {
  y_pos.push(movable.position.y)
})

// This variable is used to reset the player during the intro sequence
let resetIntro = true
// infiniteley looping function, updates game regularly
function animate() {
  window.requestAnimationFrame(animate)

  if(background.image === image) {
    // Draws background png
    background.draw()

    console.log(hilkrenSpawn.position.x)

    // Draws all collision squares
    boundaries.forEach((boundary) => {
      boundary.draw()
    })
  
    // Draws all doors
    doors.forEach((door) => {
      door.draw()
    })
  
    // Draws player
    player.draw()
    playerHitbox.draw()
  
    // Draws hilkren stuff
    hilkren.draw()
    hilHitbox.draw()
    hilkrenSpawn.draw()
  
    // Draws luke character sprite
    luke.draw()
    lukeHitbox.draw()
  
    // Redraws plyayer if they should be over the other characters sprite
    for(let i = 0; i < NPCHitBoxes.length; i++) {
      const hitbox = NPCHitBoxes[i]
      if ((inRange(player, hitbox, 200)) && (player.position.y > hitbox.position.y)) {
        player.draw()
        playerHitbox.draw()
        break
      }
    }

    if(intro) {
      title.draw()
      author.draw()
      playerToBoat()
      keys.s.pressed = true
      lastKey = 's'
      if (resetIntro) {
        resetIntro = false
        setTimeout(function() {
          if (started == false) {
            let i = 0
            movables.forEach((movable) => {
              movable.position.y = y_pos[i]
              i++
            })
            resetIntro = true
          }
        }, 2000)
      }
    }
    
    // Draws Foreground
    foreground.draw()
  
    // Draws Boat Bubble thingy
    boatBubbles.draw()
    boatBubblesMain.draw()

    if(justFinished) {
      // This piece of code makes sure that the game is displayed after door is entered
      fadeIn()
      justFinished = false;
    }
  
    // moves npc in random directions
    hilkrenCounter++
    monsterMove(rand, hilkren, hilHitbox)
    if (hilkrenCounter === 25) {
      rand = Math.floor(Math.random() * 12)
      hilkrenCounter = 0
    }
  
    // moves luke npc in random directions
    lukeCounter++
    monsterMove(rand, luke, lukeHitbox)
    if (lukeCounter === 25) {
      rand2 = Math.floor(Math.random() * 12)
      lukeCounter = 0
    }
    
    playerMove()

  }
  else if (background.image = firstHouse) {
    // Draws background png
    background.draw()

    // Draws all boundaries
    boundaries.forEach((boundary) => {
      boundary.draw()  
    })

    // Draws all doors
    doors.forEach((door) => {
      door.draw()
    })

    // Draws player
    player.draw()
    playerHitbox.draw()

    // Draws Foreground
    foreground.draw()

    // Moves player
    playerMove()

    // Checks if the player wants to go outside
    touchGrass()
    
  }

}
animate()

// Moves Character
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true
      lastKey = 'w'
      break
    case 'a':
      keys.a.pressed = true
      lastKey = 'a'
      break
    case 's':
      keys.s.pressed = true
      lastKey = 's'
      break
    case 'd':
      keys.d.pressed = true
      lastKey = 'd'
      break
    case 'e':
      keys.e.pressed = true
      lastKey = 'e'
      break
  }
})

// Makes sure that when key is released, the corresponding key value is set to false
window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
    case 'e':
      keys.e.pressed = false
      break
  }
})