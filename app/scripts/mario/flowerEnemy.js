/**
	Represents a flower enemy.
	Code by Rob Kleffner, 2011
*/

Mario.FlowerEnemy = function(world, x, y) {
    this.image = Enjine.Resources.images["enemies"];
    this.world = world;
    this.x = x;
    this.y = y;
    this.facing = 1;
    this.type = Mario.Enemy.spiky;
    this.winged = false;
    this.noFireballDeath = false;
    this.xPic = 0;
    this.yPic = 6;
    this.yPicO = 24;
    this.height = 12;
    this.width = 2;
    this.yStart = y;
    this.ya = -8;
    this.y -= 1;
    this.layer = 0;
    this.jumpTime = 0;
    this.tick = 0;
    
    var i = 0;
    for (i = 0; i < 4; i++) {
        this.move();
    }
};

Mario.FlowerEnemy.prototype = new Mario.Enemy();

Mario.FlowerEnemy.prototype.move = function() {
    var i = 0, xd = 0;
    if (this.deadTime > 0) {
        this.deadTime--;
        
        if (this.deadTime === 0) {
            this.deadTime = 1;
            for (i = 0; i < 8; i++) {
                this.world.addSprite(new Mario.Sparkle(((this.x + Math.random() * 16 - 8) | 0)  + 4, ((this.y + Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
            this.world.removeSprite(this);
        }
        
        this.x += this.xa;
        this.y += this.ya;
        this.ya *= 0.95;
        this.ya += 1;
        
        return;
    }
    
    this.tick++;
    
    if (this.y >= this.yStart) {
        this.yStart = this.y;
        xd = Math.abs(Mario.MarioCharacter.x - this.x) | 0;
        this.jumpTime++;
        if (this.jumpTime > 40 && xd > 24) {
            this.ya = -8;
        } else {
            this.ya = 0;
        }
    } else {
        this.jumpTime = 0;
    }
    
    this.y += this.ya;
    this.ya *= 0.9;
    this.ya += 0.1;
    
    this.xPic = (((this.tick / 2) | 0) & 1) * 2 + (((this.tick / 6) | 0) & 1);
};