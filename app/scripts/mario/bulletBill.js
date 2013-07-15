/**
	Represents a bullet bill enemy.
	Code by Rob Kleffner, 2011
*/

Mario.BulletBill = function(world, x, y, dir) {
	this.image = Enjine.Resources.images["enemies"];
	this.world = world;
	this.x = x;
	this.y = y;
	this.facing = dir;
	
	this.xPicO = 8;
	this.yPicO = 31;
	this.height = 12;
	this.width = 4;
	this.picWidth = 16;
	this.yPic = 5;
	this.xPic = 0;
	this.ya = -5;
	this.deadTime = 0;
	this.dead = false;
	this.anim = 0;
};

Mario.BulletBill.prototype = new Mario.NotchSprite();

Mario.BulletBill.prototype.collideCheck = function() {
    if (this.dead) {
        return;
    }
    
    var xMarioD = Mario.MarioCharacter.x - this.x, yMarioD = Mario.MarioCharacter.y - this.y;
    if (xMarioD > -16 && xMarioD < 16) {
        if (yMarioD > -this.height && yMarioD < this.world.mario.height) {
            if (Mario.MarioCharacter.y > 0 && yMarioD <= 0 && (!Mario.MarioCharacter.onGround || !Mario.MarioCharacter.wasOnGround)) {
                Mario.MarioCharacter.stomp(this);
                this.dead = true;
                
                this.xa = 0;
                this.ya = 1;
                this.deadTime = 100;
            } else {
                Mario.MarioCharacter.getHurt();
            }
        }
    }
};

Mario.BulletBill.prototype.move = function() {
    var i = 0, sideWaysSpeed = 4;
    if (this.deadTime > 0) {
        this.deadTime--;
        
        if (this.deadTime === 0) {
            this.deadTime = 1;
            for (i = 0; i < 8; i++) {
                this.world.addSprite(new Mario.Sparkle(((this.x + Math.random() * 16 - 8) | 0) + 4, ((this.y + Math.random() * 8) | 0) + 4, Math.random() * 2 - 1, Math.random() * -1, 0, 1, 5));
            }
            this.world.removeSprite(this);
        }
        
        this.x += this.xa;
        this.y += this.ya;
        this.ya *= 0.95;
        this.ya += 1;
        
        return;
    }
    
    this.xa = this.facing * sideWaysSpeed;
    this.xFlip = this.facing === -1;
    this.move(this.xa, 0);
};

Mario.BulletBill.prototype.subMove = function(xa, ya) {
	this.x += xa;
	return true;
};

Mario.BulletBill.prototype.fireballCollideCheck = function(fireball) {
    if (this.deadTime !== 0) {
        return false;
    }
    
    var xD = fireball.x - this.x, yD = fireball.y - this.y;
    if (xD > -16 && xD < 16) {
        if (yD > -this.height && yD < fireball.height) {
            return true;
        }
    }
    return false;
};

Mario.BulletBill.prototype.shellCollideCheck = function(shell) {
    if (this.deadTime !== 0) {
        return false;
    }
    
    var xD = shell.x - this.x, yD = shell.y - this.y;
    if (xD > -16 && xD < 16) {
        if (yD > -this.height && yD < shell.height) {
            Enjine.Resources.playSound("kick");
            this.dead = true;
            this.xa = 0;
            this.ya = 1;
            this.deadTime = 100;
            return true;
        }
    }
    return false;
};