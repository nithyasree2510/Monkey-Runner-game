//Global Variables
var jungleImg, jungle;
var monkeyImg, lostMonkeyImg, monkey, monkeyWon, monkeyWonImg;
var groundImg, ground;
var bananaImg, stoneImg, pondImg, logImg;
var gameOverImg, gameOver, restartImg, restart;

var score = 0;
var gameState;
var endcounter = 0;

function preload() {
  //preload all the images and Animation
  jungleImg = loadImage("jungle1.jpg");
  groundImg = loadImage("ground.jpg");
  bananaImg = loadImage("Banana.png");
  stoneImg = loadImage("stone.png");
  pondImg = loadImage("pond.png");
  logImg = loadImage("log.png");
  lostMonkeyImg = loadImage("lostMonkey.png");
  monkeyWonImg = loadImage("pro 18 won.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  monkeyImg = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png");
}

function setup() {
  createCanvas(700, 450);

  //create sprites for jungle,monkey,ground
  jungle = createSprite(200, 200, 600, 300);
  jungle.addImage(jungleImg);
  jungle.velocityX = -2;
  //jungle.scale=0.5;
  jungle.x = jungle.width / 2;

  monkey = createSprite(100, 360, 40, 40);
  monkey.addAnimation("monkey", monkeyImg);
  monkey.scale = 0.10;

  ground = createSprite(250, 420, 700, 10);
  ground.visible = false;
  //ground.addImage(groundImg);
  // ground.scale=0.55;   

  //create a happy monkey
  monkeyWon = createSprite(300, 300, 60, 40);
  monkeyWon.addImage(monkeyWonImg);
  monkeyWon.scale = 0.5;

  //create a crying monkey
  lostMonkey = createSprite(360, 180, 50, 20);
  lostMonkey.addImage(lostMonkeyImg);

  //display gameOver and restart
  gameOver = createSprite(300, 300, 50, 30);
  gameOver.addImage(gameOverImg);

  restart = createSprite(300, 350, 60, 30);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  monkeyWon.visible = false;
  gameOver.visible = false;
  restart.visible = false;
  lostMonkey.visible = false;

  //Create groups for bananas and obstacles
  bananaGroup = new Group();
  obstaclesGroup = new Group();



  //Declare the gameState as serve
  gameState = "serve";
}

function draw() {
  background(0);

  drawSprites();

  //displaying scores
  stroke("white");
  textSize(20);
  fill("white");
  text("Score: " + score, 500, 50);

  //Display instructions only at serve state
  if (gameState === "serve") {
    fill("pink");
    stroke("pink");
    text("This is a monkey runner game", 150, 200);
    text("Help monkey collect banana to grow bigger", 100, 230);
    text("Collect 20 banana to WIN", 150, 260);
    text("If you hit obstacles twice you Lost", 130, 290);

    //Display text still 100 frameCounts and change to play state
    //console.log(frameCount);
    if (frameCount % 100 === 0) {
      gameState = "play";
    }
  }
  //Things to be happended at play state
  if (gameState === "play") {
    //reset the ground
    if (jungle.x < 0) {
      jungle.x = jungle.width / 2;
    }

    //Prevent monkey from falling down
    monkey.collide(ground);

    //press space to jump 
    if (keyDown("space") && monkey.y > 320) {
      monkey.velocityY = -11;
    }
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.5;

    bananas();
    obstacles();

    //if monkey touches banana increase score and destroy it
    if (bananaGroup.isTouching(monkey)) {
      bananaGroup.destroyEach();
      score = score + 1;
    }

    //increase the size of monkey with score
    expression = score;
    switch (expression) {
      case 4:
        monkey.scale = 0.14;
        break;
      case 8:
        monkey.scale = 0.16;
        break;
      case 12:
        monkey.scale = 0.18;
        break;
      case 16:
        monkey.scale = 0.20;
    }
  }
  //when obstacles touch once
  if (obstaclesGroup.isTouching(monkey)) {
    //gameState="lost"
    obstaclesGroup.destroyEach();
    endcounter = endcounter + 1;
  }
  console.log(endcounter);
  //if touches twice state is lost
  if (endcounter === 2) {
    gameState = "lost"
  }
  //Things to happen at lost state
  if (gameState === "lost") {
    //text("You Lost",200,300);
    //Prevent monkey from falling down even in endState
    monkey.collide(ground);
    monkey.visible = false;

    gameOver.visible = true;
    restart.visible = true;
    lostMonkey.visible = true;

    //stop the background
    jungle.velocityX = 0;

    //destroy obstacles and bananas
    obstaclesGroup.destroyEach();
    bananaGroup.destroyEach();

  }
  //when score is 20,state is win
  if (score === 20){
    gameState = "win";
  }
  //things to happen at winning state
  if (gameState === "win") {

    text("You won", 360, 300);
    restart.visible = true;
    restart.x = 380;
    monkeyWon.visible = true;

    jungle.velocityX = 0;
    monkey.velocityY = 0;
    monkey.visible = false;

    obstaclesGroup.destroyEach();
    bananaGroup.destroyEach();

  }
  if (mousePressedOver(restart)) {
    reset();
  }
  console.log(gameState);
}

function bananas() {
  //create bananas for 140 frames
  if (frameCount % 140 === 0) {
    var banana = createSprite(700, 280, 40, 20);
    banana.addImage(bananaImg);
    banana.scale = 0.07;
    banana.velocityX = -4;
    banana.lifetime = 300;

    //banana.debug=true;

    bananaGroup.add(banana);

  }
}

function obstacles() {
  //create obstacles for 150 frames
  if (frameCount % 150 === 0) {
    var rand = Math.round(random(1, 3));

    var obstacles = createSprite(700, 400, 50, 20);
    obstacles.velocityX = -5;

    //console.log(rand);
    expression = rand;
    switch (expression) {
      case 1:
        obstacles.addImage(stoneImg);
        obstacles.scale = 0.2;
        break;
      case 2:
        obstacles.addImage(logImg);
        obstacles.scale = 0.3;
        break;
      case 3:
        obstacles.addImage(pondImg);
        obstacles.scale = 0.4;
        break;
      default:

    }
    obstacles.lifetime = 200;
    obstacles.debug = false;
    obstacles.setCollider("circle", 0, -20, 70);
    obstaclesGroup.add(obstacles);
  }
}

function reset() {

  gameState = "serve";

  gameOver.visible = false;
  restart.visible = false;

  monkey.visible = true;
  lostMonkey.visible = false;
  monkeyWon.visible = false;

  obstaclesGroup.destroyEach();
  bananaGroup.destroyEach();

  jungle.velocityX = -3;

  endcounter = 0;

  score = 0;
}