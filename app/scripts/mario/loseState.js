/**
	State shown when the player loses!
	Code by Rob Kleffner, 2011
*/

Mario.LoseState = function() {
    this.drawManager = null;
    this.camera = null;
    this.gameOver = null;
    this.font = null;
    this.wasKeyDown = false;
};

Mario.LoseState.prototype = new Enjine.GameState();

Mario.LoseState.prototype.enter = function() {
    this.drawManager = new Enjine.DrawableManager();
    this.camera = new Enjine.Camera();
    
    this.gameOver = new Enjine.AnimatedSprite();
    this.gameOver.image = Enjine.Resources.images["gameOverGhost"];
    this.gameOver.setColumnCount(9);
    this.gameOver.setRowCount(1);
    this.gameOver.addNewSequence("turnLoop", 0, 0, 0, 8);
    this.gameOver.playSequence("turnLoop", true);
    this.gameOver.framesPerSecond = 1/15;
    this.gameOver.x = 112;
    this.gameOver.y = 68;
    this.gameOver.xPivot = 0;
    this.gameOver.yPivot = 0;
    
    this.font = Mario.SpriteCuts.createBlackFont();
    this.font.strings[0] = { string: "Game over!", x: 116, y: 160 };
    
    this.drawManager.add(this.font);
    this.drawManager.add(this.gameOver);
};

Mario.LoseState.prototype.exit = function() {
    this.drawManager.clear();
    delete this.drawManager;
    delete this.camera;
    delete this.gameOver;
    delete this.font;
};

Mario.LoseState.prototype.update = function(delta) {
    this.drawManager.update(delta);
    if (Enjine.Keyboard.isKeyDown(Enjine.Keys.s)) {
        this.wasKeyDown = true;
    }
};

Mario.LoseState.prototype.draw = function(context) {
    this.drawManager.draw(context, this.camera);
};

Mario.LoseState.prototype.checkForChange = function(context) {
    if (this.wasKeyDown && !Enjine.Keyboard.isKeyDown(Enjine.Keys.s)) {
        context.changeState(new Mario.TitleState());
    }
};