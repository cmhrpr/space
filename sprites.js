/*
	The button object. A different image per selected/different button type
*/

var Button = enchant.Class.create(enchant.Sprite, {
	initialize: function(type, x, y){
		enchant.Sprite.call(this, 200, 100);
		this.x = x;
		this.y = y;
		this.type = type;
		if(type == "start"){
			this.image = game.assets['img/start_un.png'];
			this.addEventListener("touchstart", function() {
				game.replaceScene(new GameScene());
			});
		}
		else{
			this.image = game.assets['img/scores_un.png'];
			this.addEventListener("touchstart", function() {
				game.replaceScene(new ScoreScene());
			});
		}
		
	},
	select: function() {
		if(this.type == "start")
			this.image = game.assets['img/start_sel.png'];
		else
			this.image = game.assets["img/scores_sel.png"];
	},
	unselect: function() {
		if(this.type == "start")
			this.image = game.assets['img/start_un.png'];
		else
			this.image = game.assets['img/scores_un.png'];
			
	}
});

/*
	The background images. Both move down the screen and reset at certain values 
*/

var Background = enchant.Class.create(enchant.Sprite, {
	initialize: function(){
		enchant.Sprite.call(this, 800, 600);
		this.image = game.assets['img/bgimage.png'];
		this.x = 0;
		this.y = 0;
		
		this.addEventListener("enterframe", function () {
			if(!game.currentScene.pause){this.y += bgSpeed;
			if(this.y >= game.height)
				this.y = 0;
				}
		});
	}
});

var BackgroundS = enchant.Class.create(enchant.Sprite, {
	initialize: function(){
		enchant.Sprite.call(this, 800, 600);
		this.image = game.assets['img/bgimage.png'];
		this.x = 0;
		this.y = -game.height;
		
		this.addEventListener("enterframe", function () {
		if(!game.currentScene.pause){
			this.y = this.y + bgSpeed;
			if(this.y >= 0)
				this.y =-game.height;
				}
		});
	}
});

/*
	Displays the player's score to the screen using a text label.
*/

var ScoreLabel = enchant.Class.create(enchant.Label, {
	initialize: function(x, y) {
		enchant.Label.call(this, "");
		this.x = x;
		this.y = y;
		this.score = 0;this.color = "#ffffff";
		this.font = "60px monospace";
		this.addEventListener("enterframe", function() {
			this.text = game.currentScene.score;
		});
	}
});

/*
	Displays the remaining lives the player has
*/

var LifeLabel = enchant.Class.create(enchant.Label, {
	initialize: function(x, y) {
		enchant.Label.call(this, "3");
		this.x = x;
		this.y = y;
		this.score = 0;this.color = "#ffffff";
		this.font = "60px monospace";
		this.addEventListener("enterframe", function() {
			this.text = game.currentScene.lives;
		});
	}
});

/*
	Used to display high scores to the player
*/

var Highscore = enchant.Class.create(enchant.Label, {
	initialize: function(x, y, num) {
		enchant.Label.call(this, "");
		var scores = JSON.parse(localStorage.scores);
		this.x = x;
		this.y = y;
		this.text = (num+1) + ". " + scores[num][0] + " - " + scores[num][1];
		this.color = "#ffffff";
		this.font = "20px monospace";
		
	}
});

/*
	The main title image of the game
*/

var TitleImage = enchant.Class.create(enchant.Sprite, {
	initialize: function() {
		enchant.Sprite.call(this, 
							game.assets['img/titleimage.png'].width,
							game.assets['img/titleimage.png'].height); 
		// create a new sprite to hold the title image and set its image
		this.image = game.assets['img/titleimage.png'];
		
		// position the title image in the center of the screen
		this.x = (1/2) * game.width - (1/2 * this.width);
		this.y = 50;
	}
});

/*
	The new wave image, displayed to the player at the start of each wave
*/

var NewWave = enchant.Class.create(enchant.Sprite, {
	initialize: function() {
		enchant.Sprite.call(this, 
							game.assets['img/wave.png'].width,
							game.assets['img/wave.png'].height); 
		// create a new sprite to hold the title image and set its image
		this.image = game.assets['img/wave.png'];
		
		// position the title image in the center of the screen
		this.x = (1/2) * game.width - (1/2 * this.width);
		this.y = 100;
	}
});

/*
	The player object. This will spawn() at the middle bottom of the screen,
	and move() left and right. 
*/
var Player = enchant.Class.create(enchant.Sprite, {
    initialize: function () {
        enchant.Sprite.call(this, 60, 40);
		this.image = game.assets['img/player.png'];
        this.spawn();
    },
	
	spawn: function() {
		this.x = 1/2 * game.width - 1/2*this.width;
		
		this.y = game.height - 2*this.height;
	},
	
	death: function() {
		if(game.currentScene.lives == 0){
			game.currentScene.gameover()
		}else{
			game.currentScene.lives--;
			this.spawn();
		}
	},
	move: function(dir) {
	
		if(dir == "left")
			this.x = this.x - 5;
		else
			this.x = this.x + 5;
		if(this.x <= 0 + 1/2 * this.width)
			this.x = 0 + 1/2 * this.width;
		if(this.x >= game.width - (this.width*3/2))
			this.x = game.width - (this.width*3/2);
		}
});

/*
	The barrier object. Used to shield the player from torpedoes
*/

var Barrier = enchant.Class.create(enchant.Sprite, {

    initialize: function (x,y) {

        enchant.Sprite.call(this, 30, 30);
		this.image = game.assets['img/barrier.png'];
        this.x = x;
		this.y = y;
		
		this.dead = 0;
    }
});

/*
	The torpedo object. Moves up or down the screen based on its type
	Will be set as dead if it moves off the screen or collides will enemy/player/barrier
	Removed by the game if .dead = 1
*/

var Torpedo = enchant.Class.create(enchant.Sprite, {

    initialize: function (x, y, type) {

        enchant.Sprite.call(this, 10, 20);
        this.image = game.assets['img/torpedo.png'];
        this.x = x;
        this.y = y;
		this.type = type;

		this.dead = 0;
		

        this.addEventListener('enterframe', function () {
			// if game not paused
			if(!game.currentScene.pause)
			{
				if(this.type == "player"){
					// player torpedoes move up the screen
					this.y = this.y-torpedoSpeed;
					
					// check if still within screen, if not set as dead
					if(this.y <= 0)
						this.dead=1;
				}else{
					// enemy torpedoes move down the screen
					this.y = this.y+torpedoSpeed;
					
					// check if still within the screen, set as dead if not
					if(this.y >= game.height + this.height)
						this.dead = 1;
				}

			}
        });

    }
});

/*
	Enemy spawns at given x,y coord
	Different enemy types have a different image and give more 
	points when killed
	When an enemy reaches the player's y level, the game is over
*/
var Enemy = enchant.Class.create(enchant.Sprite, {

    initialize: function (x,y, type) {

        enchant.Sprite.call(this, 30, 30);
		this.image = game.assets['img/enemy'+type+'.png'];
        this.x = x;
		this.y = y;
		
		
		switch(type)
		{
			case 0 :
				this.points = 10;
				break;
			case 1 :
				this.points = 5;
				break;
			case 2 :
				this.points = 2;
				break;
			case 3 :
				this.points = 1;
				break;
			
		}
			
		this.dead = 0;
		this.count = 0;
        
		this.addEventListener("enterframe", function() {
			if (this.y >= 520 - this.height)
			{
				game.currentScene.gameover();
			}
		});

    },
	
	move: function (dir) {
		if(dir == "right")
			this.x += 30;
		else if(dir == "left")
			this.x -= 30;
		else if(dir == "down")
			this.y += 30;
	}

});
