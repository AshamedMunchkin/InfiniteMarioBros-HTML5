/**
	Displays the title screen and menu.
	Code by Rob Kleffner, 2011
*/

Mario.TitleState = function() {
    this.drawManager = null;
    this.camera = null;
    this.logoY = null;
    this.bounce = null;
    this.font = null;
};

Mario.TitleState.prototype = new Enjine.GameState();

Mario.TitleState.prototype.enter = function() {
    this.drawManager = new Enjine.DrawableManager();
    this.camera = new Enjine.Camera();
    
    var bgGenerator = new Mario.BackgroundGenerator(2048, 15, true, Mario.LevelType.Overground);
    var bgLayer0 = new Mario.BackgroundRenderer(bgGenerator.CreateLevel(), 320, 240, 2);
    bgGenerator.SetValues(2048, 15, false, Mario.LevelType.Overground);
    var bgLayer1 = new Mario.BackgroundRenderer(bgGenerator.CreateLevel(), 320, 240, 1);
    
    this.title = new Enjine.Sprite();
    this.title.image = Enjine.Resources.images["title"];
    this.title.x = 0, this.title.y = 120;
    
    this.logo = new Enjine.Sprite();
    this.logo.image = Enjine.Resources.images["logo"];
    this.logo.x = 0, this.logo.y = 0;
    
    this.font = Mario.SpriteCuts.CreateRedFont();
    this.font.strings[0] = { string: "Press S to Start", x: 96, y: 120 };

    this.logoY = 20;
    
    this.drawManager.add(bgLayer0);
    this.drawManager.add(bgLayer1);
    
    this.bounce = 0;
	
	Mario.GlobalMapState = new Mario.MapState();
	//set up the global main character variable
	Mario.MarioCharacter = new Mario.Character();
	Mario.MarioCharacter.Image = Enjine.Resources.images["smallMario"];
	
	//Mario.PlayTitleMusic();
};

Mario.TitleState.prototype.exit = function() {
	//Mario.StopMusic();
	
    this.drawManager.clear();
    delete this.drawManager;
    delete this.camera;
    delete this.font;
};

Mario.TitleState.prototype.update = function(delta) {
    this.bounce += delta * 2;
    this.logoY = 20 + Math.sin(this.bounce) * 10;
    
    this.camera.x += delta * 25;
    
    this.drawManager.update(delta);
};

Mario.TitleState.prototype.draw = function(context) {
    this.drawManager.draw(context, this.camera);
    
    context.drawImage(Enjine.Resources.images["title"], 0, 120);
    context.drawImage(Enjine.Resources.images["logo"], 0, this.logoY);
    
    this.font.draw(context, this.camera);
};

Mario.TitleState.prototype.checkForChange = function(context) {
    if (Enjine.Keyboard.isKeyDown(Enjine.Keys.s)) {
        context.changeState(Mario.GlobalMapState);
    }
};