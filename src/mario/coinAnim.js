/**
	Represents a simple little coin animation when popping out of the box.
	Code by Rob Kleffner, 2011
*/

Mario.CoinAnim = function(world, x, y) {
    this.world = world;
    this.life = 10;
    this.image = Enjine.Resources.images["map"];
    this.picWidth = this.picHeight = 16;
    this.x = x * 16;
    this.y = y * 16 - 16;
    this.xa = 0;
    this.ya = -6;
    this.xPic = 0;
    this.yPic = 2;
};

Mario.CoinAnim.prototype = new Mario.NotchSprite();

Mario.CoinAnim.prototype.move = function() {
    var x = 0, y = 0;
    if (this.life-- < 0) {
        this.world.removeSprite(this);
        for (x = 0; x < 2; x++) {
            for (y = 0; y < 2; y++) {
                this.world.addSprite(new Mario.Sparkle(this.world, (this.x + x * 8 + Math.random() * 8) | 0, (this.y + y * 8 + Math.random() * 8) | 0, 0, 0, 0, 2, 5));
            }
        }
    }
    
    this.xPic = this.life & 3;
    this.x += this.xa;
    this.y += this.ya;
    this.ya += 1;
};