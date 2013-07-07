/**
	Represents a little sparkle object in the game.
	Code by Rob Kleffner, 2011
*/

Mario.Sparkle = function(world, x, y, xa, ya) {
    this.world = world;
    this.x = x;
    this.y = y;
    this.xa = xa;
    this.ya = ya;
    this.xPic = (Math.random() * 2) | 0;
    this.yPic = 0;
    
    this.life = 10 + ((Math.random() * 5) | 0);
    this.xPicStart = this.xPic;
    this.xPicO = 4;
    this.yPicO = 4;
    
    this.picWidth = 8;
    this.picHeight = 8;
    this.image = Enjine.Resources.images["particles"];
};

Mario.Sparkle.prototype = new Mario.NotchSprite();

Mario.Sparkle.prototype.move = function() {
    if (this.life > 10) {
        this.xPic = 7;
    } else {
        this.xPic = (this.xPicStart + (10 - this.life) * 0.4) | 0;
    }
    
    if (this.life-- < 0) {
        this.world.removeSprite(this);
    }
    
    this.x += this.xa;
    this.y += this.ya;
};