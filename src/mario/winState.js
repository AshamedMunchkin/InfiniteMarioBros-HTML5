/**
	State that's shown when the player wins the game!
	Code by Rob Kleffner, 2011
*/

Mario.WinState = function() {
    this.waitTime = 2;
    this.drawManager = null;
    this.camera = null;
    this.font = null;
    this.kissing = null;
    this.wasKeyDown = false;
};

Mario.WinState.prototype = new Enjine.GameState();

Mario.WinState.prototype.enter = function() {
    this.drawManager = new Enjine.DrawableManager();
    this.camera = new Enjine.Camera();
    
    this.font = Mario.SpriteCuts.createBlackFont();
    this.font.strings[0] = { string: "Thank you for saving me, Mario!", x: 36, y: 160 };
    
    this.kissing = new Enjine.AnimatedSprite();
    this.kissing.image = Enjine.Resources.images["endScene"];
    this.kissing.x = 112;
    this.kissing.y = 52;
    this.kissing.setColumnCount(2);
    this.kissing.setRowCount(1);
    this.kissing.addNewSequence("loop", 0, 0, 0, 1);
    this.kissing.playSequence("loop", true);
    this.kissing.framesPerSecond = 1/2;
    this.kissing.xPivot = 0;
    this.kissing.yPivot = 0;
    
    this.waitTime = 2;
    
    this.drawManager.add(this.font);
    this.drawManager.add(this.kissing);
};

Mario.WinState.prototype.exit = function() {
    this.drawManager.clear();
    delete this.drawManager;
    delete this.camera;
};

Mario.WinState.prototype.update = function(delta) {
    this.drawManager.update(delta);
    
    if (this.waitTime > 0) {
        this.waitTime -= delta;
    } else {
        if (Enjine.Keyboard.isKeyDown(Enjine.Keys.s)) {
            this.wasKeyDown = true;
        }
    }
};

Mario.WinState.prototype.draw = function(context) {
    this.drawManager.draw(context, this.camera);
};

Mario.WinState.prototype.checkForChange = function(context) {
    if (this.waitTime <= 0) {
        if (this.wasKeyDown && !Enjine.Keyboard.isKeyDown(Enjine.Keys.s)) {
            context.changeState(new Mario.TitleState());
        }
    }
};