/*
	The TitleScene displays a title image, the background
	and prompts the user to press Spacebar to take them to
	the main menu
*/
var TitleScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
	
		Scene.apply(this);
		
		// add the two background Sprites
		this.addChild(new Background());
		this.addChild(new BackgroundS());
		
		// add a TitleImage instance to the game
		this.addChild(new TitleImage());
		
		spacebar = new Sprite(500, 40);
		spacebar.image = game.assets["img/spacebarimage.png"];
		spacebar.x = game.width * 1/2 - (spacebar.width *1/2);
		spacebar.y = game.height * 1/2;
		this.addChild(spacebar);
	
		
		this.addEventListener('abuttondown', function(evt){
			// spacebar pressed
			game.replaceScene(new MainMenu());
		});

	}
});

/*
	The Main Menu scene displays the scrolling background image,
	the title image, as well as two buttons to either start a new
	game or view the high scores screen.
	The buttons are controlled by either mouse clicks or pressing 
	the left and right arrow keys to select, and spacebar to enter.
*/
var MainMenu = Class.create(Scene, {
	initialize: function(){
		Scene.apply(this);
		
		// create the buttons for "Start" and "Scores"
		var start = new Button("start", 100, 250);
		var scores = new Button("scores", 500, 250);
		
		// add the two backgrounds to the Scene
		this.addChild(new Background());
		this.addChild(new BackgroundS());
		
		// add the buttons to the Scene
		this.addChild(start);
		this.addChild(scores);
		
		// add a TitleImage instance to the Scene
		this.addChild(new TitleImage());
		
		
		// which button is selected by default
		this.selected = "start";
		
		
		// these event listeners wait for keyboard inputs 
		// such as the arrow keys and spacebar and escape,
		// as well as entering a new frame
		
		this.addEventListener('leftbuttondown', function(evt){
			// change the selected button to "start"
			if(this.selected == "scores")
				this.selected = "start";
		});
		
		this.addEventListener('rightbuttondown', function(evt){
			// change the selected button to "start"
			if(this.selected == "start")
				this.selected = "scores";
		});
		
		this.addEventListener('abuttondown', function(evt){
			// take you to the selected scene
			if(this.selected == "start")
				game.replaceScene(new GameScene());
			else
				game.replaceScene(new ScoreScene());
		});
		
		this.addEventListener('enterframe', function() {
			// update the button images to selected or unselected
			if(this.selected == "start")
			{
				start.select();
				scores.unselect();
			}
			if(this.selected == "scores")
			{
				scores.select();
				start.unselect();
			}
		}); 
	}
});

/*
	The Score Scene reads a list of the top four high scores which
	are stored on the player's computer using localStorage.
	This list is displayed to the user along with a title image 
	and a button which will return them to the main menu
*/
var ScoreScene = Class.create(Scene, {
	initialize: function(){
	
		Scene.apply(this);
		
		// add the two backgrounds to the scene
		this.addChild(new Background());
		this.addChild(new BackgroundS());
		
		// add a TitleImage instance to the scene
		this.addChild(new TitleImage());
	
		
		var backButton = new Button("start", 50, 250);
		
		// create  labels for each high score
		var score1 = new Highscore (300, 250, 0);
		var score2 = new Highscore (300, 275, 1);
		var score3 = new Highscore (300, 300, 2);
		var score4 = new Highscore (300, 325, 3);
		
		// add the high score labels to the scene
		this.addChild(score1);
		this.addChild(score2);
		this.addChild(score3);
		this.addChild(score4);
		
		// add the back button to the screen
		this.addChild(backButton);
		
		// wait until spacebar pressed
		this.addEventListener('abuttondown', function(evt){
			// take the user to the Main Menu screen
			game.replaceScene(new MainMenu());
		});
	}
});

/*
	The Game Scene is where it all happens. A player sprite is created,
	as well as 3 sets of barriers. Enemies move down from the top of screen
	The player can be moved using the arrow keys and fires a torpedo with the spacebar
	Enemies fire torpedoes at random at players
	Every frame, all torpedoes are checked to see if they are colliding with an enemy, the player or a barrier
	If collision occurs, the object will be destroyed
*/
var GameScene = Class.create(Scene, {
	initialize: function(){
	
		Scene.apply(this);
		
		// add the two background Sprites
		this.addChild(new Background());
		this.addChild(new BackgroundS());
		
		
		this.pause = 0;
		this.lives = 3;
		this.score = 0;
		this.wave = 0;
		this.enemyCount = 0;
		
		var timer = [0,0];
		var wave = new NewWave()
		var pewSound = Sound.load("audio/pew.mp3");
		var beepSound  = Sound.load("audio/beep.mp3");
		var _torpedoes = new Group();
		var barrier = new Array();
		this.enemy = new Array();
		var player = new Player();
		
		this.enemyDifficulty = 1;
		this.enemyMoveSpeed = 1;
		
		// create a Life remainging label and add it to the scene
		lifeLabel = new LifeLabel(600, 5);
		// create a Score label and add it to the scene
		scoreLabel = new ScoreLabel(400, 5);
		
		
		
		
		
		this.addChild(player);
		
		// create the barriers
		barrier[0] = new Barrier(80, 450);
		barrier[1] = new Barrier(110, 450);
		barrier[2] = new Barrier(140, 450);
		
		barrier[3] = new Barrier(355, 450);
		barrier[4] = new Barrier(385, 450);
		barrier[5] = new Barrier(415, 450);
		
		barrier[6] = new Barrier(660, 450);
		barrier[7] = new Barrier(690, 450);
		barrier[8] = new Barrier(720, 450);
		
		// add the barriers to the game
		var x = 0;
		while(x < barrier.length){
			this.addChild(barrier[x]);
			x++;
		}
		
	

		/*
			These event listeners wait for key press events
		*/
		
		// fire a torpedo when the player presses spacebar
		this.addEventListener('abuttonup', function(evt){
			if(!this.pause){
				var torpedo = new Torpedo(player.x+7/16*player.width, player.y-20, "player");
				_torpedoes.addChild(torpedo);
				// Sounds no longer play properly, so commented this out until fixed. TODO get a new engine
				//pewSound.play();
			}else{
				this.gameover();
			}
		});
		
		// pause the game on escape key
		this.addEventListener('bbuttondown', function(evt){
				if(this.pause)  this.pause = 0;
				else			this.pause = 1;
		});
		
		this.addEventListener('leftbuttondown', function(evt){
		if(!this.pause){
				player.move("left");
			}
		});
		
		this.addEventListener('rightbuttondown', function(evt){
		if(!this.pause){
				player.move("right");
				}
		});
		
		
		
		
		
		/*
			This event listener triggers every new frame
		*/
		this.addEventListener('enterframe', function() {
			// only if game is currently running
			if(!this.pause){
			
				// no enemies remaining, create another wave
				if(this.enemyCount == 0)
				{
					if(timer[0] == 0)
					{
						timer[1] = game.frame;
						timer[0] = 1;
						this.addChild(wave);
					}
					else if((game.frame - timer[1]) >= 90)
					{
						timer[0] = 0;
						this.removeChild(wave);
						this.newWave();
					}
				}
				
				// move the enemy down the screen in a sequence of
				// 8 to the right, 1 down, 8 to the left, 1 down
				// and then repeat
				if(game.frame % (30 * (1/this.enemyMoveSpeed)) == 0)
				{
					for(var x = 0; x < this.enemy.length; x++){
					if(this.enemy[x]){
							if(this.enemy[x].count < 8)
							{
								this.enemy[x].move("right");
							}
							else if(this.enemy[x].count < 9)
							{
								this.enemy[x].move("down");
							}
							else if(this.enemy[x].count < 17)
							{
								this.enemy[x].move("left");
							}
							else if(this.enemy[x].count < 18)
							{
								this.enemy[x].move("down");
							}
							// TODO: Fix sounds in Enchant.js or find another engine
							//beepSound.play();
							this.enemy[x].count++;
							if(this.enemy[x].count == 20)
								this.enemy[x].count = 0;
						}
					}
				}

        
				// remove all torpedoes
				this.removeChild(_torpedoes);
				
				// make a random ALIVE enemy fire a torpedo every second
				if(game.frame % (30*(1/this.enemyDifficulty)) == 0){
					// generate a random enemy
					var enm = Math.floor((Math.random() * this.enemy.length) + 1); 
					// check that enemy still exists and is alive
					if(this.enemy[enm])
					{
						if(!this.enemy[enm].dead){
							// create a new enemy torpedo at the enemy's location
							var torpedo = new Torpedo(this.enemy[enm].x, this.enemy[enm].y, "enemy");
							_torpedoes.addChild(torpedo);
						}
					}
				}
				
				// check to see if any of the torpedoes intersect with a barrier, player or enemy
				var x = 0;
				while(x < _torpedoes.childNodes.length)
				{
					if(_torpedoes.childNodes[x].dead){
						// remove all dead torpedoes
						_torpedoes.removeChild(_torpedoes.childNodes[x]);
					}else {
						var i = 0;
						// check if any of torpedoes are colliding with barriers
						while(i < barrier.length){
							if(_torpedoes.childNodes[x].intersect(barrier[i]))
							{
								if(!barrier[i].dead){
									// remove torpedo and barrier
									_torpedoes.childNodes[x].dead = 1;
									this.removeChild(barrier[i]);
									barrier[i].dead = 1;
								}
							}
							i++;
						}
						var t = 0;
						// check if any of player torpedoes are colliding with enemies
						while(t < this.enemy.length){
							if(_torpedoes.childNodes[x].intersect(this.enemy[t]))
							{
								if(!this.enemy[t].dead && _torpedoes.childNodes[x].type == "player"){
									// remove enemy and torpedo from the scene
									// set both as dead
									this.enemy[t].dead = 1;
									
									this.score+=this.enemy[t].points;
									this.removeChild(this.enemy[t]);
									this.enemyCount--;
									
									_torpedoes.childNodes[x].dead = 1;
									
								}
							}
							t++;
						}
						
						// check to see if the any of the torpedoes are colliding with the player
						if(_torpedoes.childNodes[x].intersect(player))
						{
							if(_torpedoes.childNodes[x].type == "enemy")
							{
								// cause the player to die
								player.death();
								
								// remove the torpedo that hit the player
								_torpedoes.childNodes[x].dead = 1;
							}
						}
					}
					x++;
				}
				
				// add the torpedoes to the scene
				this.addChild(_torpedoes);
			}
		});
		
		// add the labels last so they displayed above other objects
		this.addChild(scoreLabel);
		this.addChild(lifeLabel);
	},
	
	newWave: function() 
	{
	// if wave is not the first in the game
			if(this.wave !=0)
			{
				// award player a new life
				this.lives++;
			}
			this.wave++;
			
			// spawn 8 x 4 grid of enemies
			for(var i = 0; i < 4; i++){ 
				for(var v = 0; v < 8; v++)
				{
					var en = new Enemy((v*60 + 60), (i*60 + 60), i);
					this.addChild(en);
					this.enemy[this.enemyCount] = en;
					this.enemyCount++;
				}
			}
	},
	gameover: function()
	{
			var name = "";
			var scores = JSON.parse(localStorage.scores);
			// client side validation
			while(name== "")
			{
				name = prompt("Game Over! You scored " + this.score + "\nPlease enter your name: ");
			}
			var score = [this.score, name];
			if(scores[0][0] < this.score)
			{
				scores[3] = scores[2];
				scores[2] = scores[1];
				scores[1] = scores[0]
				scores[0] = score;
			}
			else if(this.score > scores[1][0])
			{
				scores[3] = scores[2];
				scores[2] = scores[1];
				scores[1] = score;
			}
			else if(this.score >scores[2][0])
			{	
				scores[3] = scores[2];
				scores[2] = score;
			}
			else if(this.score > scores[3][0])
			{
				scores[3] = score;
			}
			localStorage.scores = JSON.stringify(scores);
			
			game.pushScene(new MainMenu());
			
	}
	
});
