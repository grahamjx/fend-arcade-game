// This file contains the majority of game-logic used in my frogger arcade game.

/* Enemy Object: sets the x-axis and speed using a randomized value.
   Row and Col properties are set to whole numbers corresponding to the gameboard.
   An offset value is used in order to center the enemy within a square.

   Parameter: rowStart, sets the starting row for each enemy. */

var Enemy = function(rowStart) {
  this.sprite = 'images/enemy-bug.png';
  this.x = this.randomNum();
  this.speed = this.randomNum();
  this.y = rowStart;
  this.row = Math.floor((this.y + SQ_HEIGHT) / SQ_HEIGHT);
  this.col = Math.floor((this.x + ENEMY_OFFSET) / SQ_WIDTH);
};

/* Update function: Moves the enemy across the x-axis using dt parameter and
   current speed, updating col property over time. Once the enemy is off the screen,
   it's position is reset (out of view) with a new, randomized speed.

   Checks for enemyCollision.

   Parameter: dt, a time delta between ticks. */

Enemy.prototype.update = function(dt) {
  if (this.x < SQ_WIDTH * 5) {
    this.x += dt * this.speed;
    this.col = Math.floor((this.x + ENEMY_OFFSET) / SQ_WIDTH);
  }
  else{
    this.x = 0 - SQ_WIDTH;
    this.speed = this.randomNum();
  }
  if (this.row == player.row && this.col == player.col){
      player.enemyCollision();
  }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Returns a random whole number used for x-axis placement and speed.
Enemy.prototype.randomNum = function() {
  return Math.floor(Math.random() * 500) + 100;
};


// Player Object: Sets all starting properties for the player.
var Player = function(){
  this.sprite = 'images/char-boy.png';
  this.x = startX;
  this.y = startY;
  this.row = 5;
  this.col = 2;
  this.score = 0;
  this.lives = 3;
};

// Update Function: Score, position and # of lives is reset once lives = 0.
Player.prototype.update = function() {
  if (this.lives == 0) {
    this.score = 0;
    this.lives = 3;
    player.resetPosition();
  }
};

// Score, lives and position are changed if collision occurs.
Player.prototype.enemyCollision = function() {
    this.score -= 100;
    this.lives--;
    this.resetPosition();
};

// Draw the player as well as updates to the sideBar (current lives and score)
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  sideBarUpdate('lives','Lives: ' + this.lives);
  sideBarUpdate('score','Score: ' + this.score);
};

/* This function handles keyboard input and updates player properties accordingly.
   Allows for movement if only there is empty space adjacent to thier current position.
   If the player reaches the water (row == 0) then score is updated and postion reset. */

Player.prototype.handleInput = function(input) {
  switch (input) {
    case 'up':
      if (this.row - 1 > 0) {
        this.y -= SQ_HEIGHT;
        this.row--;
      }
      else {
        player.score += 100;
        player.resetPosition();
      }
    break;

    case 'down':
      if (this.row + 1 < MAX_ROW) {
        this.y += SQ_HEIGHT;
        this.row++;
      }
    break;

    case 'left':
      if (this.col - 1 >= 0) {
        this.x -= SQ_WIDTH;
        this.col--;
      }
    break;

    case 'right':
      if (this.col + 1 < MAX_COL) {
        this.x += SQ_WIDTH;
        this.col++;
      }
    break;
  }
};

//Uses mouse input to change the character sprite
Player.prototype.handleInputMouse = function(x,y) {
  if (y > charTop && y < charBot && x > charLeft && x < charRight) {
    this.sprite = 'images/char-horn-girl.png';
  }
  if (y > charTop && y < charBot && x > (charLeft+100) && x < (charRight+100)) {
    this.sprite = 'images/char-cat-girl.png';
  }
  if (y > charTop && y < charBot && x > (charLeft+200) && x < (charRight+200)) {
    this.sprite = 'images/char-boy.png';
  }
}

// Resets the player back to starting position
Player.prototype.resetPosition = function() {
  this.x = startX;
  this.y = startY;
  this.row = 5;
  this.col = 2;
};

/* Item Object: Places new items randomly so they always fall within the same rows
   and columns that the enemies use. */

var Item = function(item) {
  this.col = Math.floor(Math.random() * MAX_COL);
  this.row = Math.floor(Math.random() * (MAX_ROW-1-2) + 1);
  this.item = item;
  this.sprite = 'images/' + item + '.png';
};

// Draws a item to the canvas (centered using ITEM_OFFSET).
Item.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), (this.col*SQ_WIDTH)+ITEM_OFFSET, (this.row*SQ_HEIGHT)+ITEM_OFFSET,60,100);
};

/* Update function: A SPAWN_RATE constant is used to move item positions on the gameboard.
   Also checks itemCollision with a player */

Item.prototype.update = function() {
  Math.random() < SPAWN_RATE ? this.itemPut() : null;
  this.itemCollision();
};

// Puts the item in a new random location given the row and column constraints
Item.prototype.itemPut = function() {
  this.col = Math.floor(Math.random() * MAX_COL);
  this.row = Math.floor(Math.random() * (MAX_ROW-1-2) + 1);
};

/* If a player picks up an item, it will give them either a life (Heart) or
   points (Key, Star, ect). */

Item.prototype.itemCollision = function() {
  if (this.row == player.row && this.col == player.col) {
    if(this.item == 'Heart'){
      player.lives += 1;
      this.col = -2;
    }
    else{
      player.score += 200;
      this.col = -2;
    }
  }
};

// Updates the sideBar canvas depending on the type (lives or score)
// General use function
var sideBarUpdate = function(type,text) {
  switch (type) {
    case 'lives':
      sideBarCtx.font = 'italic 24px Helvetica, Sans-serif';
      sideBarCtx.fillStyle = '#000000';
      sideBarCtx.fillText(text, 20, 160);
    break;

    case 'score':
      sideBarCtx.font = 'italic 24px Helvetica, Sans-serif';
      sideBarCtx.fillStyle = '#000000';
      sideBarCtx.fillText(text, 20, 200);
    break;
  }
};

// Global variables and object initialization
var rowOne = 48,
    rowTwo = 144,
    rowThree = 225,
    startX = 200,
    startY = 400,
    charTop = 287;
    charBot = 368;
    charLeft = 1070;
    charRight = 1130;

    ENEMY_OFFSET = 80,
    ITEM_OFFSET = 20,
    SQ_WIDTH = 101,
    SQ_HEIGHT = 83,
    MAX_ROW = 6,
    MAX_COL = 5,
    SPAWN_RATE = 0.0007,

    allEnemies = [new Enemy(rowOne),new Enemy(rowTwo),new Enemy(rowThree)],
    allItems = [new Item('Heart'),new Item('Key'),new Item('Star')],
    player = new Player;

// This listens for key presses and sends the keys to your Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Listens for mouse clicks which are used for character selection
document.addEventListener('click',function(loc) {
  var x = loc.pageX;
  var y = loc.pageY;

  player.handleInputMouse(x,y);
})
