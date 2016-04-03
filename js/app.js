

// Enemies our player must avoid
var Enemy = function(rowStart) {

  this.sprite = 'images/enemy-bug.png';
  this.x = random();
  this.speed = this.x;
  this.y = rowStart;
  this.row = Math.floor((this.y + SQ_HEIGHT) / SQ_HEIGHT);
  this.col = Math.floor((this.x + ENEMY_OFFSET) / SQ_WIDTH);
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

  if (this.row == player.row && this.col == player.col) {
    player.enemyCollision();
  }

  if (this.x < SQ_WIDTH * 5) {
    this.x += dt * this.speed;
    this.col = Math.floor((this.x + ENEMY_OFFSET) / SQ_WIDTH);
  }

  else{
    this.x = 0 - SQ_WIDTH;
    this.speed = random();
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var random = function() {
  return Math.floor(Math.random() * 500) + 100;
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 400;
  this.row = 5;
  this.col = 2;
  this.score = 0;
  this.lives = 3;
};

Player.prototype.update = function(dt) {
  if (this.lives == 0) {
    gameOver();
  }
};

Player.prototype.enemyCollision = function() {
  this.score -= 100;
  this.lives--;
  this.resetPosition();
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  sideBarUpdate('lives','Lives: ' + this.lives);
  sideBarUpdate('score','Score: ' + this.score);
};

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
      if (this.row + 1 < maxRow) {
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
      if (this.col + 1 < maxCol) {
        this.x += SQ_WIDTH;
        this.col++;
      }
    break;
  }
};

Player.prototype.resetPosition = function() {
  this.x = 200;
  this.y = 400;
  this.row = 5;
  this.col = 2;
};

var Item = function(item,location,col) {
  this.x = ((SQ_WIDTH + 15) * col);
  this.y = location;
  this.col = col;
  this.row = Math.floor(this.y / SQ_HEIGHT);
  this.item = item;
  this.sprite = 'images/' + item + '.png';
};

Item.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y,60,100);
}

Item.prototype.update = function() {
  this.itemCollision();
}

Item.prototype.itemCollision = function() {
  if (this.row == player.row && this.col == player.col) {
    switch (this.item) {
      case 'Heart':
        player.lives += 1;
        removeArrayElement(this.item);
      break;

      default:
        player.score += 200;
        removeArrayElement(this.item);
      break;
    }
  }
};
var gameOver = function(){
  player.score = 0;
  player.lives = 3;
  player.resetPosition();
};

var removeArrayElement = function(itemToRemove) {
  for(var i = 0; i < allItems.length; i++){
    if (allItems[i].item == itemToRemove) {
      allItems.splice(i,1);
    }
  }
};

var sideBarUpdate = function(type,text) {
  switch (type) {
    case 'lives':
      sideBarCtx.font = 'italic bold 24px Verdana, Arial, Helvetica, Sans-serif';
      sideBarCtx.fillStyle = '#ff00cc';
      sideBarCtx.fillText(text, 20, 200);
    break;

    case 'score':
      sideBarCtx.font = 'italic bold 24px Verdana, Arial, Helvetica, Sans-serif';
      sideBarCtx.fillStyle = '#0095dd';
      sideBarCtx.fillText(text, 20, 240);
    break;
  }
};

var rowOne = 48,
    rowTwo = 144,
    rowThree = 225;

var maxRow = 6,
    maxCol = 5;

var ENEMY_OFFSET = 80,
    ITEM_OFFSET = 50;
    SQ_WIDTH = 101,
    SQ_HEIGHT = 83;

  var allEnemies = [new Enemy(rowOne)]//, new Enemy(rowTwo), new Enemy(rowThree)],
      allItems = [new Item('Heart',rowThree + ITEM_OFFSET, 1),
                  new Item('Key', rowOne + ITEM_OFFSET, 2),
                  new Item('Star',rowTwo + ITEM_OFFSET, 3)];
      player = new Player,



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
