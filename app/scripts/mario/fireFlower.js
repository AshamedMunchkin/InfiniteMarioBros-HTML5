/**
	Represents a fire powerup.
	Code by Rob Kleffner, 2011
*/

Mario.FireFlower = function(world, x, y) {
	this.width = 4;
	this.height = 24;
	
	this.world = world;
	this.x = x;
	this.y = y;
	this.image = Enjine.Resources.images["items"];
	
	this.xPicO = 8;
	this.yPicO = 15;
	this.xPic = 1;
	this.yPic = 0;
	this.height = 12;
	this.facing = 1;
	this.picWidth = this.picHeight = 16;
	
	this.life = 0;
};

Mario.FireFlower.prototype = new Mario.NotchSprite();

Mario.FireFlower.prototype.collideCheck = function() {
	var xMarioD = Mario.MarioCharacter.x - this.x, yMarioD = Mario.MarioCharacter.y - this.y;
	if (xMarioD > -16 && xMarioD < 16) {
		if (yMarioD > -this.height && yMarioD < Mario.MarioCharacter.height) {
			Mario.MarioCharacter.getFlower();
			this.world.removeSprite(this);
		}
	}
};

Mario.FireFlower.prototype.move = function() {
	if (this.life < 9) {
		this.layer = 0;
		this.y--;
		this.life++;
		return;
	}
};