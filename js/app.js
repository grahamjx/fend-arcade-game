var random = function() {
  return Math.floor(Math.random() * 500) + 100;
}
// Enemies our player must avoid
var Enemy = function(location) {

  this.sprite = 'images/enemy-bug.png';
  this.x = 202;
  this.y = location;
  this.Row = Math.floor(location / 83);
  console.log(this.Row);
  this.Col = Math.floor(this.x / 101);
  console.log(this.Col);
  this.speed = 100;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

  if (this.x < rightBotBoundary ) {
    this.x += 50 * dt;
    this.Col = Math.floor(this.x / 101);
    console.log(this.Col);
  }
  else{
    this.x = -101;
    this.Col = 0;
  }
  if (player.Row == this.Row && player.Col == this.Col) {
    player.x = 200;
    player.y = 400;
    player.Col = 1;
    player.Row = 4;
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(){
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 400;
  this.Row = Math.floor(this.y / 83);
  this.Col = Math.floor(this.x / 101);

};

Player.prototype.update = function() {

  if (this.x > rightBotBoundary) {
    this.x = rightBotBoundary;
  }
  if (this.x < leftTopBoundary) {
    this.x = leftTopBoundary;
  }
  if (this.y > rightBotBoundary) {
    this.y = rightBotBoundary;
  }
  if (this.y < leftTopBoundary) {
    this.x = 200;
    this.y = 400;
    this.Col = 1;
    this.Row = 4;
  }
};

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(input) {
  if (input == 'up') {
    this.y -= 83;
  }
  if (input == 'down') {
    this.y += 83;
  }
  if (input == 'left') {
    this.x -= 101;
  }
  if (input == 'right') {
    this.x += 101;
  }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var row = 55;

var rightBotBoundary = 400;
var leftTopBoundary = 0;

var allEnemies = [new Enemy(row)];

var player = new Player;



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
