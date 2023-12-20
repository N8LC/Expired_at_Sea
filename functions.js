// This variable is used to determine what the last thing the npc collided with was
let lastCol = ''

// Difference in x and y values between npc and player
let x_diff = 0
let y_diff = 0

// These variables save the x and y data when entering a house
let oldX = 0
let oldY = 0

// Variable for when the game starts
let started = false

// Checks if two object collide
function rectangularCollision({rectangle1, rectangle2}) {
  return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height/2 &&
    rectangle1.position.y + rectangle1.height/2 >= rectangle2.position.y
  )
}

function playerToBoat() {
  // Changes the player sprite to the player in the boat
  player.image = playerDownBoat
  player.sprites.up = playerUpBoat
  player.sprites.down = playerDownBoat
  player.sprites.right = playerRightBoat
  player.sprites.left = playerLeftBoat

  // Changes player height/width
  play_image_x = 525
  play_image_y = 218
  player.position.x = canvas.width / 2 - play_image_x / 4 / 2,
  player.position.y = canvas.height / 2 - play_image_y / 2

  // Makes the boat speed faster than the player speed
  player.speed = 12
}

// Checks if two objects are "in range" of each other
function inRange(varobject, root, range) {
  if ((varobject.position.x > root.position.x - range && varobject.position.x < root.position.x + range) && (varobject.position.y > root.position.y - range && varobject.position.y < root.position.y + range)) {
    return true
  }
  else {
    return false
  }
}

// This function moves the character around randomly
function monsterMove(rand, object, objectHitBox) {
  // Resets variable after hilkren collides with something
  object.moving = true
  boundaries.push(playerHitbox)

  if(hilkren.talking) {
    object.moving = false

    // Gets difference between hilkren position and y position
    x_diff = object.position.x - player.position.x
    y_diff = object.position.y - player.position.y

    if(x_diff <= 0 && y_diff <= 0) {
      if (Math.abs(x_diff) >= Math.abs(y_diff)) {
        object.image = object.sprites.right
      }
      else {
        object.image = object.sprites.down
      }
    }
    else if (x_diff <= 0 && y_diff >= 0) {
      if (Math.abs(x_diff) >= Math.abs(y_diff)) {
        object.image = object.sprites.right
      }
      else {
        object.image = object.sprites.up
      }
    }
    else if (x_diff >= 0 && y_diff <= 0) {
      if (Math.abs(x_diff) >= Math.abs(y_diff)) {
        object.image = object.sprites.left
      }
      else {
        object.image = object.sprites.down
      }
    }
    else if (x_diff >= 0 && y_diff >= 0) {
      if (Math.abs(x_diff) >= Math.abs(y_diff)) {
        object.image = object.sprites.left
      }
      else {
        object.image = object.sprites.up
      }
    }
  }
  else if (rand < 8) {
    object.moving = false
  }
  else if (rand < 9) {
    object.moving = true
    object.image = object.sprites.down

    // Checks if the npc guy collides into anything
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
      rectangularCollision({
        rectangle1: object,
        rectangle2: {
          ...boundary, 
          position: {
          x: boundary.position.x,
          y: boundary.position.y - 3
        }}
      })
      ) {
        lastCol = 'up'

        // Uses the lastCol property to determine whether the character should proceed
        object.moving = false
        break
      }
    }

    if (object.moving) {
      object.position.y = object.position.y + 3
      // Makes sure that the hitbox moves with the character
      objectHitBox.position.y = objectHitBox.position.y + 3
    }
  }
  else if (rand < 10) {
    object.moving = true
    object.image = object.sprites.up
    
    // Checks if the npc guy collides into anything
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
      rectangularCollision({
        rectangle1: object,
        rectangle2: {
          ...boundary, 
          position: {
          x: boundary.position.x,
          y: boundary.position.y + 3
        }}
      })
      ) {
        object.moving = false
        break
      }
    }

    if (object.moving) {
      object.position.y = object.position.y - 3
      // Makes sure that the hitbox moves with the character
      objectHitBox.position.y = objectHitBox.position.y - 3
    }
  }
  else if (rand < 11) {
    object.moving = true
    object.image = object.sprites.right

    // Checks if the npc guy collides into anything
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
      rectangularCollision({
        rectangle1: object,
        rectangle2: {
          ...boundary, 
          position: {
          x: boundary.position.x - 3,
          y: boundary.position.y
        }}
      })
      ) {
        object.moving = false
        break
      }
    }

    if (object.moving) {
      object.position.x = object.position.x + 3
      // Makes sure that the hitbox moves with the character
      objectHitBox.position.x = objectHitBox.position.x + 3
    }
  }
  else if (rand < 12) {
    object.moving = true
    object.image = object.sprites.left

    // Checks if the npc guy collides into anything
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i]
      if (
      rectangularCollision({
        rectangle1: object,
        rectangle2: {
          ...boundary, 
          position: {
          x: boundary.position.x + 3,
          y: boundary.position.y
        }}
      })
      ) {
        object.moving = false
        break
      }
    }

    if (object.moving) {
      object.position.x = object.position.x - 3
      // Makes sure that the hitbox moves with the character
      objectHitBox.position.x = objectHitBox.position.x - 3
    }
  }
  boundaries.pop()
}

function playerMove() {
  // Adds in NPC hitbox during player calculations so that the hitbox is not noticed by the npc during normal calculations IMP
  
  for (let i = 0; i < NPCHitBoxes.length; i++) {
    boundaries.push(NPCHitBoxes[i])
  }
  
  let moving = true
  player.moving = false
  // Checks if any keys are pressed and moves sprite if they are
  if (keys.w.pressed && lastKey === 'w') {
    player.moving = true
    player.image = player.sprites.up
    
    if (background.image === image) {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary, 
            position: {
            x: boundary.position.x,
            y: boundary.position.y + player.speed
          }}
        })
        ) {
          moving = false
          break
        }
      }
  
      // Stops moving if character collides with a collision block
      if (moving) {
        movables.forEach((movable) => {
          movable.position.y = movable.position.y + player.speed
        })
      }
    }
    else {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary, 
            position: {
            x: boundary.position.x,
            y: boundary.position.y + player.speed
          }}
        })
        ) {
          moving = false
          break
        }
      }
      
      // Stops moving if character collides with a collision block
      if (moving) {
        player.position.y = player.position.y - player.speed
        playerHitbox.position = player.position
      }
    }
  }
  else if (keys.a.pressed && lastKey === 'a') {
    player.moving = true
    player.image = player.sprites.left
    
    if (background.image === image) {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary, 
            position: {
            x: boundary.position.x + player.speed,
            y: boundary.position.y
          }}
        })
        ) {
          moving = false
          break
        }
      }
  
      // Stops moving if character collides with a collision block
      if (moving) {
        movables.forEach((movable) => {
          movable.position.x = movable.position.x + player.speed
        })
      }
    }
    else {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary, 
            position: {
            x: boundary.position.x + player.speed,
            y: boundary.position.y
          }}
        })
        ) {
          moving = false
          break
        }
      }
      
      // Stops moving if character collides with a collision block
      if (moving) {
        player.position.x = player.position.x - player.speed
        playerHitbox.position = player.position
      }
    }
  }
  else if (keys.s.pressed && lastKey === 's') {
    player.moving = true
    player.image = player.sprites.down

    if (background.image === image) {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary, 
            position: {
            x: boundary.position.x,
            y: boundary.position.y - player.speed
          }}
        })
        ) {
          moving = false
          break
        }
      }
  
      // Stops moving if character collides with a collision block
      if (moving) {
        movables.forEach((movable) => {
          movable.position.y = movable.position.y - player.speed
        })
      }
    }
    else {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary, 
            position: {
            x: boundary.position.x,
            y: boundary.position.y - player.speed
          }}
        })
        ) {
          moving = false
          break
        }
      }
      
      // Stops moving if character collides with a collision block
      if (moving) {
        player.position.y = player.position.y + player.speed
        playerHitbox.position = player.position
      }
    }
  }
  else if (keys.d.pressed && lastKey === 'd') {
    player.moving = true
    player.image = player.sprites.right
    if (background.image === image) {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary, 
            position: {
            x: boundary.position.x - player.speed,
            y: boundary.position.y
          }}
        })
        ) {
          moving = false
          break
        }
      }
  
      // Stops moving if character collides with a collision block
      if (moving) {
        movables.forEach((movable) => {
          movable.position.x = movable.position.x - player.speed
        })
      }
    }
    else {
      for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary, 
            position: {
            x: boundary.position.x - player.speed,
            y: boundary.position.y
          }}
        })
        ) {
          moving = false
          break
        }
      }
      
      // Stops moving if character collides with a collision block
      if (moving) {
        player.position.x = player.position.x + player.speed
        playerHitbox.position = player.position
      }
    }
  }
  else if (keys.e.pressed && can_press) {
    
    for (let i = 0; i < doors.length; i++) {
      const door = doors[i]
      if (inRange(player, door, 50) && (door instanceof Door) && background.image === image) {
          // Temporary Saves current x and y values
          oldX = background.position.x
          oldY = background.position.y
  
          // Puts player in correct location
          player.position.x = 380
          player.position.y = 450
          
          // sets new background image
          background.image = firstHouse
  
          // Resets background
          background.position.x = -30
          background.position.y = -210
  
          // puts in current npc hitboxes
          NPCHitBoxes = []
          
          // Creates new boundaries
          boundaries = createBoundaries(indoorCollisions, 22, 161, -30, -210)
  
          // Doors
          doors = createDoors(indoorDoors, 22, 161, -30, -210)
  
          // changes foreground
          foreground.image = indoorForeground
          foreground.position.x = -30
          foreground.position.y = -210
  
          // Resets movables
          movables = [background, ...boundaries, ...doors, foreground, hilkren, luke, ...NPCHitBoxes, boatBubbles, boatBubblesMain, hilkrenSpawn, mainSpawn]
          document.getElementById('FadeBlock').style.opacity = 0
      }
    }
    if (inRange(player, hilkren, 100)) {
      player.moving = false
      hilkren.moving = false
      hilkren.talking = true
      hilkren.textBubble = HilkrenHelloBubble
      setTimeout(() => { 
        hilkren.textBubble = blankText 
        hilkren.talking = false
      }, 5000);
    }
    else if (inRange(player, boatBubbles, 300)) {
      if (player.sprites.up == playerUpImage) {
        playerToBoat() // Turns the player into the boat animation
  
        // Moves the player outside of the island
        movables.forEach((movable) => {
          movable.position.x = movable.position.x - 300
        })

        // Sets variables for e restrictions
        can_press = false
        setTimeout(() => {
          can_press = true
        }, int_time)
      }
      else {
        setTimeout(() => { 
          // Changes the player sprite to the player in the boat
          player.image = playerLeftImage
          player.sprites.up = playerUpImage
          player.sprites.down = playerDownImage
          player.sprites.right = playerRightImage
          player.sprites.left = playerLeftImage

          // Changes player height/width
          play_image_x = 192
          play_image_y = 68
          player.position.x = canvas.width / 2 - play_image_x / 4 / 2,
          player.position.y = canvas.height / 2 - play_image_y / 2
  
          // Slows down player
          player.speed = 6
  
          // puts player at island spawn
          movables.forEach((movable) => {
            movable.position.x -= hilkrenSpawn.position.x
            movable.position.y -= hilkrenSpawn.position.y
          })
        }, 100)
        // Sets variables for e restrictions
        can_press = false
        setTimeout(() => {
          can_press = true
        }, int_time)
      }
    }
    else if (inRange(player, boatBubblesMain, 300)) {
      if (player.sprites.up == playerUpImage) {
        playerToBoat() // Turns the player into boat animation
  
        // Moves the player outside of the island
        movables.forEach((movable) => {
          movable.position.x = movable.position.x - 300
        })

        // Sets variables for e restrictions
        can_press = false
        setTimeout(() => {
          can_press = true
        }, int_time)
      }
      else {
        setTimeout(() => { 
          // Changes the player sprite to the player in the boat
          player.image = playerLeftImage
          player.sprites.up = playerUpImage
          player.sprites.down = playerDownImage
          player.sprites.right = playerRightImage
          player.sprites.left = playerLeftImage
  
          // Slows down player
          player.speed = 6
  
          // puts player at island spawn
          movables.forEach((movable) => {
            movable.position.x -= mainSpawn.position.x
            movable.position.y -= mainSpawn.position.y
          })
        }, 100)
        // Sets variables for e restrictions
        can_press = false
        setTimeout(() => {
          can_press = true
        }, int_time)
      }
    }
  }
  for (let i = 0; i < NPCHitBoxes.length; i++) {
    boundaries.pop()
  }
}

function createBoundaries (collisionData, width, searchNum, offx, offy) {
  // Converts data into 2d array
  const collisionsMap = []
  for (let i = 0; i < collisionData.length; i += width) {
    collisionsMap.push(collisionData.slice(i, i + width))
  }
  
  // Makes a new boundary for each tile in the collision image
  const boundaries = []
  
  // This piece of code puts all the collision blocks into an array
  collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === searchNum) {
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width + offx,
              y: i * Boundary.height + offy
            },
            width: 48,
            height: 48
          })
        )
      }
    })
  })

  return boundaries
}

function createDoors (doorData, width, searchNum, offx, offy) {
  // Converts data into 2d array
  const doorMap = []
  for (let i = 0; i < doorData.length; i += width) {
    doorMap.push(doorData.slice(i, i + width))
  }
  
  // Makes a new boundary for each tile in the collision image
  const doors = []
  
  // This piece of code puts all the collision blocks into an array
  doorMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
      if (symbol === searchNum) {
        doors.push(
          new Door({
            position: {
              x: j * Door.width + offx,
              y: i * Door.height + offy
            },
            width: 48,
            height: 48
          })
        )
      }
    })
  })

  return doors
}

function touchGrass() {
  for (let i = 0; i < doors.length; i++) {
    const door = doors[i]
    if (inRange(player, door, 30)) {
      fadeOut()
      // Puts player in correct location
      player.position.x = canvas.width / 2 - 192 / 4 / 2
      player.position.y = canvas.height / 2 - 68 / 2
      
      // sets new background image
      background.image = image
    
      // Resets background
      background.position.x = oldX
      background.position.y = oldY

      // puts in current npc hitboxes
      NPCHitBoxes = [hilHitbox, lukeHitbox]
    
      // boundaries
      boundaries = createBoundaries(collisions, 300, 1025, oldX, oldY)

      // Doors
      doors = createDoors(doorData, 300, 1025, oldX, oldY)

      // changes foreground
      foreground.image = foregroundImage
      foreground.position.x = oldX
      foreground.position.y = oldY

      // Resets movables
      movables = [background, ...boundaries, ...doors, foreground, hilkren, luke, ...NPCHitBoxes, boatBubbles, boatBubblesMain, hilkrenSpawn, mainSpawn]

      justFinished = true;
    }
  }
}

function startGame() {
  // Gets user out of the intro scene/removes text
  intro = false
  keys.s.pressed = false
  started = true

  // Moves boat to start
  let i = 0
  movables.forEach((movable) => {
    movable.position.y = y_pos[i]
    i++
  })

  // Removes start and option text
  document.getElementById("Play").style.display = "none";
  document.getElementById("Options").style.display = "none";
}

function options() {
  alert("options")
}

function fadeIn() {
  // This piece of code makes sure that the game is displayed after door is entered
  document.getElementById('FadeBlock').style.animation = "none";
  document.getElementById('FadeBlock').style.animation = "2s ease-in-out 0s 1 normal forwards running fadeOut";
  setTimeout(function() {
    document.getElementById('FadeBlock').style.width = "0";
    document.getElementById('FadeBlock').style.height = "0";
  }, 2000)
}

function fadeOut() {
  // This piece of code makes sure that the div is the size of the game
  document.getElementById('FadeBlock').style.width = "1024";
  document.getElementById('FadeBlock').style.height = "576";
  // This piece of code makes sure that the game is displayed after door is entered
  document.getElementById('FadeBlock').style.animation = "none";
  document.getElementById('FadeBlock').style.animation = "2s ease-in-out 0s 1 normal forwards running fade";
}