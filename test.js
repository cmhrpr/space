enchant();
window.onload = function () {

	// create instance of Game with 800x600 resolution
    game = new Game(800, 600);
	
	// set the FPS of the game to 30
    game.fps = 30;

	// bind the spacebar to 'a' and the escape key to 'b'
	game.keybind('32', 'a');
	game.keybind('27', 'b');
	
	// set the score to 0
	game.score = 0;
	
	// load all the required images before the game starts
    game.preload(	'img/torpedo.png', 'img/barrier.png', 'img/player.png', 
					'img/titleimage.png', 'img/bgimage.png',  'img/spacebarimage.png',
					'img/start_un.png', 'img/scores_un.png','img/start_sel.png', 'img/scores_sel.png');

	// on loading the game, set the scene to the title scene
    game.onload = function () {
		game.pushScene(new TestScene());
    };
	
	// start the game
    game.start();
	
};
bgSpeed = 5;
torpedoSpeed = 5;
var TestScene = enchant.Class.create(enchant.Scene, {
	initialize: function(){
	
		Scene.apply(this);
		this.lives = 0;
		// add the two background Sprites
		this.enemy = new Enemy(100,500);
		
		this.addChild(this.enemy);
		
		// add a TitleImage instance to the game
		
		this.backgroundColor = "black";
	this.addEventListener("enterframe", function () {
		});
		this.addEventListener("touchdown", function () {
			game.replaceScene(new TestScene());
		});
	}
});
