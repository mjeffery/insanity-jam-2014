var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game-container');

game.state.add('boot', Boot);
game.state.add('preloader', Preloader);
game.state.add('game', Game);

game.state.start('boot');

