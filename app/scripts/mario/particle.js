/**
	Represents a piece of a broken block.
	Code by Rob Kleffner, 2011
*/

Mario.Particle = function(world, x, y, xa, ya, xPic, yPic) {
	this.world = world;
	this.x = x;
	this.y = y;
	this.xa = xa;
	this.ya = ya;
	this.xPic = (Math.random() * 2) | 0;
	this.yPic = 0;
	this.xPicO = 4;
	this.yPicO = 4;
	
	this.picWidth = 8;
	this.picHeight = 8;
	this.life = 10;
	
	this.image = Enjine.Resources.images["particles"];
};

Mario.Particle.prototype = new Mario.NotchSprite();

Mario.Particle.prototype.move = function() {
	if (this.life - this.delta < 0) {
		this.world.removeSprite(this);
	}
	this.life -= this.delta;
	
	this.x += this.xa;
	this.y += this.ya;
	this.ya *= 0.95;
	this.ya += 3;
};