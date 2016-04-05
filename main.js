// initialise the enchant library
enchant();

// game settings
bgSpeed = 5;
torpedoSpeed = 7.5;

// check if scoreboard exists
if(!localStorage.scores){
	// if not, create an array of scores
	var scores = new Array();
	scores[0] = [0, "Nobody"];
	scores[1] = [0, "Nobody"];
	scores[2] = [0, "Nobody"];
	scores[3] = [0, "Nobody"];

	// and save it locally
	localStorage.scores = JSON.stringify(scores);
}

// to be called when the window is loaded
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

	// load all the required images and sounds before the game starts
    game.preload(	'img/torpedo.png', 'img/barrier.png', 'img/player.png',
    				'img/enemy0.png', 'img/enemy1.png', 'img/enemy2.png', 'img/enemy3.png',
					'img/titleimage.png', 'img/bgimage.png',  'img/spacebarimage.png',
					'img/start_un.png', 'img/scores_un.png','img/start_sel.png', 'img/scores_sel.png',
					'img/wave.png');

	// on loading the game, set the scene to the title scene
    game.onload = function () {
		game.pushScene(new TitleScene());
    };

	// start the game
    game.start();

};
